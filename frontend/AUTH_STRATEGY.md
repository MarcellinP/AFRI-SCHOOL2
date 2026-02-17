# 🔐 AFRI-SCHOOL - Stratégie Authentification Frontend

## 📋 Vue d'ensemble

Implémentation sécurisée d'une authentification JWT avec stratégie hybride:
- **Access Token**: Stocké en mémoire (RAM)
- **Refresh Token**: httpOnly cookie
- **Auto-refresh**: Automatique avant expiration

## 🏗️ Architecture

### Flux de Connexion

```
1. Utilisateur → Login (email/password)
   ↓
2. Backend vérifie credentials
   ↓
3. Backend génère 2 tokens:
   - accessToken (15 min) → Response JSON
   - refreshToken (7 jours) → httpOnly cookie
   ↓
4. Frontend:
   - Stocke accessToken en mémoire
   - Cookie auto-géré par navigateur
   - Ajoute "Bearer token" à chaque request
   ↓
5. Dashboard accessible
```

### Flux d'Auto-Refresh

```
Token expire dans 1 min
   ↓
Frontend détecte expiration
   ↓
Envoie POST /auth/refresh
(cookie envoyé automatiquement)
   ↓
Backend valide cookie
   ↓
Renvoie nouveau accessToken
   ↓
Frontend met à jour token en mémoire
   ↓
Request réessayée automatiquement
```

## 🔒 Sécurité

### Pourquoi cette stratégie?

| Approche | Avantage | Risque |
|----------|----------|--------|
| **LocalStorage** | Persistant | ⚠️ Vulnérable XSS |
| **SessionStorage** | Sécurisé | ❌ Perte au refresh |
| **Memory (RAM)** ✅ | Sécurisé contre XSS | ⚠️ Perte au refresh |
| **HttpOnly Cookie** ✅ | Sécurisé XSS, persistant | ❌ CSRF (mitigé par SameSite) |
| **Hybrid** ✅✅ | Meilleur des deux | Complexité |

### Protection Implémentée

```typescript
1. Access Token en mémoire
   - Impossible à voler via XSS
   - Pas visible dans DevTools
   - Perte au refresh (acceptable pour user)

2. Refresh Token en httpOnly cookie
   - Impossible à lire via JS
   - Automatiquement envoyé au backend
   - SameSite=Strict (CSRF protection)
   - Secure flag en production
   - MaxAge: 7 jours

3. CORS avec credentials
   - withCredentials: true
   - Cookies auto-envoyés
   - Origin stricte

4. Token expiration
   - Access: 15 minutes
   - Refresh: 7 jours
   - Auto-refresh 1 min avant expiry

5. Revocation immédiate
   - Logout → Redis clearing
   - Session invalidée immédiatement
```

## 📁 Fichiers Implémentés

### Backend

#### 1. `authController.ts` - Endpoints modifiés

```typescript
// Login - Retourne accessToken + cookie refreshToken
POST /api/auth/login

// Réponse:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJ..." // En mémoire
    // refreshToken en httpOnly cookie
  }
}

// Refresh - Utilise cookie automatiquement
POST /api/auth/refresh
// Cookie auto-envoyé par navigateur

// Logout - Efface cookie et Redis
POST /api/auth/logout
// Cookie clearé automatiquement
```

#### 2. `app.ts` - Cookie parser ajouté

```typescript
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

#### 3. `package.json` - Dépendance ajoutée

```json
"cookie-parser": "^1.4.6"
```

### Frontend

#### 1. `token-manager.ts` - Gestion tokens en mémoire

```typescript
// Stockage sécurisé
TokenManager.setAccessToken(token, expiresIn)
TokenManager.getAccessToken() // null si expiré
TokenManager.hasValidAccessToken()
TokenManager.getTimeUntilExpiry()

// Décoding client-side (sans vérification)
TokenManager.decodeToken(token)
TokenManager.getUserFromToken()

// Scheduling auto-refresh
TokenManager.scheduleRefresh(onRefresh, bufferTime)
TokenManager.clearRefreshSchedule()

// Reset complet
TokenManager.clear()

// Debug
TokenManager.getTokenInfo()
```

#### 2. `api-client.ts` - Interceptors mise à jour

```typescript
// Request interceptor
- Ajoute "Authorization: Bearer {token}" depuis mémoire
- Enabled withCredentials (cookies)

// Response interceptor
- Détecte 401 Unauthorized
- Queue requests pour éviter refresh multiples
- Appelle POST /auth/refresh (cookie auto-envoyé)
- Reessaye request originale avec nouveau token
- Logout si refresh échoue

// Gestion queue
- Évite appels refresh simultanés
- Remet en queue les requests pendantes
```

#### 3. `useAuth.ts` - Hook complet

```typescript
// Authentification
const { success, error } = await login(email, password)
const { success, error } = await register(userData)
await logout()

// Gestion tokens
const success = await refreshToken()
const info = getTokenInfo()

// User data
const user = await getCurrentUser()
const authenticated = isAuthenticated

// Permissions
const hasRole = hasRole('admin')
const hasPermission = hasPermission('write')

// Lifecycle
await initializeAuth() // Restore session au startup
```

## 🚀 Utilisation

### 1. Login - Formulaire

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { success, error } = await login(email, password);
    
    if (!success) {
      console.error(error);
      // Erreur déjà affichée
    }
    // Sinon redirection automatique vers /dashboard
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Connexion'}
      </button>
    </form>
  );
}
```

### 2. Page Protégée

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div>
      <h1>Bienvenue {user?.firstName}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### 3. RBAC - Vérification Permissions

```typescript
function AdminPanel() {
  const { hasRole, hasPermission } = useAuth();

  // Vérifier role
  if (!hasRole('admin')) {
    return <p>Accès refusé</p>;
  }

  // Vérifier permission
  if (!hasPermission('manage')) {
    return <p>Permission refusée</p>;
  }

  return <div>Admin Panel</div>;
}
```

### 4. Logout

```typescript
function LogoutButton() {
  const { logout, isLoading } = useAuth();

  return (
    <button onClick={logout} disabled={isLoading}>
      {isLoading ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  );
}
```

## 📊 Flux Complet - Exemple

### Scenario: Utilisateur utilise l'app pendant 2h

```
T=0:00 → Login
  • POST /auth/login
  • ✅ accessToken = 15 min
  • ✅ refreshToken cookie = 7 jours
  • Token stored en mémoire
  • Auto-refresh scheduled à T=14:00

T=14:00 → Auto-refresh trigger
  • POST /auth/refresh
  • ✅ New accessToken = 15 min
  • ✅ New refreshToken cookie
  • Token updated en mémoire
  • Auto-refresh rescheduled à T=28:00

T=28:00 → Auto-refresh trigger
  • POST /auth/refresh
  • ✅ New accessToken = 15 min
  • [Cycle continue]

T=1:55:00 → User utilise app
  • Request normal avec accessToken valide
  • ✅ Response 200

T=119:00 (~ 2h) → Refresh token approche expiry
  • POST /auth/refresh
  • ✅ New tokens
  • Session prolongée

T=7 days → Refresh token expire
  • POST /auth/refresh
  • ❌ 401 Unauthorized
  • Logout automatique
  • Redirection /auth/login
  • "Session expirée, reconnexion nécessaire"

User logout manuellement
  • POST /auth/logout
  • ✅ Cookie cleared
  • ✅ Redis entry deleted
  • Token cleared en mémoire
  • Redirection /auth/login
```

## 🛡️ Edge Cases Gérés

### 1. Utilisateur quitte l'app (F5)

```
BEFORE:
- AccessToken en mémoire → PERDU
- RefreshToken cookie → PRESERVED

APRÈS F5:
- initializeAuth() appelé
- localStorage a user data
- POST /auth/refresh avec cookie
- ✅ Nouveau accessToken généré
- Session restaurée = Transparent pour user
```

### 2. Multiple tabs ouvertes

```
Tab A: Login
  • AccessToken en mémoire (Tab A)
  • RefreshToken cookie (Shared)

Tab B: POST /api/data
  • Tab B a pas de token en mémoire
  • POST /auth/refresh (cookie envoyé)
  • Obtient nouveau token
  • Continue

⚠️ Limitation: Tab A et Tab B ont tokens différents
Workaround: Communication entre tabs via sessionStorage (optional)
```

### 3. Request pendant refresh

```
Request A → 401
  • Déclenche refresh
  • isRefreshing = true
  • Ajoute Request A à queue

Request B → 401 (pendant refresh)
  • isRefreshing = true
  • Ajoute Request B à queue
  • Ne déclenche pas second refresh

Refresh complète
  • isRefreshing = false
  • Reessaye Request A
  • Reessaye Request B
```

### 4. Refresh échoue

```
POST /auth/refresh → 401
  • Logout automatique
  • Token cleared
  • LocalStorage cleared
  • Redirection /auth/login
```

## 📈 Monitoring & Debug

### Token Info

```typescript
const { getTokenInfo } = useAuth();

const info = getTokenInfo();
// {
//   hasToken: true,
//   isExpired: false,
//   expiresAt: "2026-02-16T14:30:00Z",
//   timeUntilExpiry: 899000 // ms
// }
```

### Console Logs

```typescript
// Successful login
[Auth] Token stored in memory
[Auth] Auto-refresh scheduled for 14:00

// Token refresh
[Auth] Token refreshed at 14:00
[Auth] Next refresh scheduled for 28:00

// Auto-refresh failure
[Auth] Refresh failed: 401
[Auth] Logging out...
```

## 🔄 Migration depuis l'ancien système

Si vous aviez un système localStorage:

```typescript
// AVANT (❌ Insecure)
localStorage.setItem('accessToken', token)
localStorage.setItem('refreshToken', refreshToken)

// APRÈS (✅ Secure)
TokenManager.setAccessToken(token)
// refreshToken automatiquement en httpOnly cookie
```

## ✅ Checklist Implémentation

- [x] Backend: cookie-parser installé
- [x] Backend: httpOnly cookies activés
- [x] Backend: CORS credentials enabled
- [x] Frontend: TokenManager créé
- [x] Frontend: API client interceptors mis à jour
- [x] Frontend: useAuth hook complet
- [x] Frontend: Auto-refresh configuré
- [x] Frontend: Logout clearing cookies
- [x] Frontend: Session restore au startup
- [x] Frontend: Multi-tabs handling (partielle)
- [x] Frontend: Error handling robuste

## 🚨 Troubleshooting

### "Token not found" error

```
Cause: Token en mémoire perdu après F5
Fix: Vérifier que initializeAuth() est appelé au startup
Check: Navigateur DevTools → Application → Cookies
       Vérifier que "refreshToken" existe et est httpOnly
```

### "Refresh token expired" au login

```
Cause: Ancien refresh token dans cookie
Fix: Effacer tous les cookies
     Relancer app
     Réessayer login

Chrome: DevTools → Application → Cookies → Supprimer
Firefox: about:preferences → Cookies → Afficher les données → Supprimer
```

### "Multiple refreshes happening"

```
Cause: Queuing système non optimal
Fix: Vérifier que isRefreshing flag est respecté
Check: Console pour logs multiples de refresh
       Ne devrait pas y avoir "Refresh started" 2 fois
```

### Token claims invalid

```
Cause: Token decodé avec mauvaise clé
Fix: C'est normal - frontend décode sans verification
    Backend valide la signature
    Frontend utilise juste pour info

Ne pas utiliser TokenManager.decodeToken() pour security!
```

## 📚 Ressources

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Token Storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)
- [HttpOnly Cookies](https://owasp.org/www-community/attacks/xss/#stored-xss-attacks)
- [CORS Credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)

---

**Status**: ✅ **IMPLEMENTED & SECURE**

**Version**: 1.0.0
**Last Updated**: Feb 16, 2026
