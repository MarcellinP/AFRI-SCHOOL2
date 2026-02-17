# 🔗 Intégration Authentification Frontend-Backend

## 📋 Synchronisation Requise

### Vérifier Backend Prêt

```bash
# 1. Vérifier cookie-parser installé
cd backend
npm list | grep cookie-parser
# Doit afficher: cookie-parser@1.4.6

# 2. Redémarrer backend si nécessaire
npm run dev

# 3. Tester endpoint refresh
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  --cookie "refreshToken=your_token_here"
```

### Vérifier Frontend Prêt

```bash
cd frontend

# 1. Dépendances installées
npm list axios zustand
# Doit afficher: axios@latest, zustand@latest

# 2. Fichiers créés
ls -la src/lib/token-manager.ts
ls -la src/lib/api-client.ts
ls -la src/hooks/useAuth.ts

# 3. Démarrer dev server
npm run dev
```

## 🔄 Points d'Intégration

### 1. Login Endpoint

**Backend Endpoint:**
```
POST /api/auth/login
Headers: Content-Type: application/json
Body: { email: string, password: string }
```

**Backend Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "createdAt": "2026-02-16T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Frontend Usage:**
```typescript
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();

  async function handleLogin(email: string, password: string) {
    const { success } = await login(email, password);
    if (success) {
      // Redirection automatique vers /dashboard
    }
  }

  return (
    // Form JSX
  );
}
```

### 2. Register Endpoint

**Backend Endpoint:**
```
POST /api/auth/register
Headers: Content-Type: application/json
Body: {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  phone?: string,
  role?: string (default: "student")
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJ..."
  }
}
```

**Frontend Usage:**
```typescript
const { register } = useAuth();

const { success } = await register({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'SecurePassword123',
  phone: '+221771234567'
});
```

### 3. Refresh Endpoint

**Backend Endpoint:**
```
POST /api/auth/refresh
Headers: Content-Type: application/json
Cookie: refreshToken=<httpOnly cookie>
Body: {} (empty)
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJ..."
  }
}
```

**Frontend Automatique:**
```
API Client interceptor gère automatiquement:
1. Détecte 401 Unauthorized
2. Appelle POST /auth/refresh
3. Reessaye request originale
4. Utilisateur ne voit rien
```

### 4. Logout Endpoint

**Backend Endpoint:**
```
POST /api/auth/logout
Headers: Authorization: Bearer <accessToken>
Body: {}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

**Frontend Usage:**
```typescript
const { logout } = useAuth();

await logout();
// Automatiquement:
// - Token cleared
// - Cookie cleared
// - Redirection vers /auth/login
```

### 5. Me (Current User) Endpoint

**Backend Endpoint:**
```
GET /api/auth/me
Headers: Authorization: Bearer <accessToken>
```

**Backend Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "subscriptionPlan": "free",
      "lastLogin": "2026-02-16T10:30:00Z",
      "createdAt": "2026-02-16T10:00:00Z"
    }
  }
}
```

**Frontend Usage:**
```typescript
const { getCurrentUser } = useAuth();

const user = await getCurrentUser();
if (user) {
  console.log(`User: ${user.firstName} ${user.lastName}`);
}
```

## 🛡️ Configuration CORS

**Backend `app.ts`:**
```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // ✅ IMPORTANT: Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🍪 Cookie Configuration

**Backend:**
```typescript
res.cookie('refreshToken', token, {
  httpOnly: true,           // ✅ JS cannot access
  secure: true,             // ✅ HTTPS only (prod)
  sameSite: 'strict',       // ✅ CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
  domain: undefined // Auto-set to current domain
});
```

**Frontend Automatic:**
```typescript
// No manual cookie handling needed!
// Axios automatically sends cookies when:
withCredentials: true  // Set in api-client.ts
```

## 📊 Flux Complet - Étapes

### 1. Page Login

```
User → Login Form
  ↓
Enter email + password
  ↓
Click "Submit"
  ↓
frontend: POST /api/auth/login {email, password}
  ↓
backend: Valide credentials
  ↓
backend: Génère JWT tokens
  ↓
backend: Envoie response + set cookie
  ↓
frontend: Reçoit accessToken + user
  ↓
frontend: TokenManager.setAccessToken(token)
  ↓
frontend: authStore.setUser(user)
  ↓
frontend: localStorage.setItem('user', user)
  ↓
frontend: Redirect /dashboard
  ↓
✅ Page Dashboard charge
```

### 2. Page Dashboard (Protected)

```
/dashboard page renders
  ↓
useAuth hook initializes
  ↓
const { user, isAuthenticated } = useAuth()
  ↓
isAuthenticated = false? → Redirect /auth/login
  ↓
user data affichée
  ↓
GET /api/data request
  ↓
api-client: Ajoute "Authorization: Bearer {token}"
  ↓
backend: Valide token
  ↓
backend: Response données
  ↓
frontend: Affiche données
  ↓
✅ User voit contenu
```

### 3. Token Expiration (15 min)

```
T=14:59 User clique quelque part
  ↓
frontend: POST /api/some-endpoint
  ↓
api-client: Ajoute accessToken
  ↓
accessToken expired? 
  ↓
backend: Retourne 401 Unauthorized
  ↓
api-client response interceptor:
  - Détecte 401
  - POST /api/auth/refresh
  - Envoi cookie automatiquement
  ↓
backend: Valide refreshToken cookie
  ↓
backend: Génère nouveau accessToken
  ↓
frontend: TokenManager.setAccessToken(newToken)
  ↓
api-client: Reessaye original request
  ↓
backend: Valide nouveau token
  ↓
backend: Response succès
  ↓
frontend: Utilisateur ne voit rien!
  ↓
✅ Transparent pour user
```

### 4. Logout

```
User clique "Logout" button
  ↓
frontend: logout() called
  ↓
frontend: POST /api/auth/logout
  ↓
api-client: Ajoute token
  ↓
backend: Efface refreshToken de Redis
  ↓
backend: Envoie clear-cookie directive
  ↓
frontend: TokenManager.clear()
  ↓
frontend: authStore.logout()
  ↓
frontend: localStorage.removeItem('user')
  ↓
frontend: Redirect /auth/login
  ↓
✅ Session terminée
```

## 🧪 Tests d'Intégration

### Test 1: Login Basique

```bash
# 1. Démarrer les deux serveurs
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# 2. Naviguer vers http://localhost:3000/auth/login
# 3. Entrer credentials:
#    Email: student@example.com
#    Password: Password123

# Résultats attendus:
# ✅ Form submits
# ✅ Loading spinner appear
# ✅ Redirection vers /dashboard
# ✅ User data affiché
```

### Test 2: Token Refresh

```bash
# 1. Login (comme Test 1)
# 2. Ouvrir DevTools Console
# 3. Attendre 14 minutes (ou modifier TokenManager temporairement)
# 4. Faire une action (click button, input, etc.)

# Résultats attendus:
# ✅ POST /auth/refresh dans Network
# ✅ Pas d'erreur 401
# ✅ Original request réessayée
# ✅ User n'a rien vu
```

### Test 3: Session Restore

```bash
# 1. Login
# 2. Ouvrir DevTools Storage
#    - LocalStorage: "user" présent
#    - Cookies: "refreshToken" httpOnly
# 3. Presser F5 (refresh page)
# 4. Vérifier console

# Résultats attendus:
# ✅ Pas d'erreur 401
# ✅ POST /auth/refresh appelé
# ✅ Page chargée normalement
# ✅ Données affichées
```

### Test 4: Logout

```bash
# 1. Login
# 2. Chercher "Logout" button (ou naviguer vers page avec logout)
# 3. Clicker logout
# 4. Vérifier DevTools Storage

# Résultats attendus:
# ✅ POST /auth/logout appelé
# ✅ LocalStorage "user" supprimé
# ✅ Cookie "refreshToken" cleared
# ✅ Redirection vers /auth/login
```

### Test 5: Protected Route

```bash
# 1. Sans login, naviguer vers /dashboard
# 2. Vérifier console et Network

# Résultats attendus:
# ✅ Pas de données chargées
# ✅ Redirection vers /auth/login
# ✅ Pas d'erreur CORS
```

## 🔍 Debugging

### Activer Logs Détaillés

**`api-client.ts` - Ajouter logs:**
```typescript
// Request interceptor
console.log('[API] Request:', config.url, {
  hasToken: !!tokenManager.getAccessToken(),
  tokenExpiry: tokenManager.getTokenInfo(),
});

// Response interceptor
console.log('[API] Response:', error.response?.status);
console.log('[API] Refreshing token...');
console.log('[API] Token refreshed, retrying request');
```

**`token-manager.ts` - Ajouter logs:**
```typescript
setAccessToken(token, expiresIn) {
  console.log('[TokenManager] Setting token, expires in', expiresIn, 'ms');
}

getAccessToken() {
  if (this.accessTokenData && Date.now() > this.accessTokenData.expiresAt) {
    console.log('[TokenManager] Token expired, clearing');
  }
}
```

### DevTools Inspection

```
Chrome DevTools:
1. Application tab
2. Cookies
3. Vérifier "refreshToken"
   - Name: refreshToken
   - Value: [httpOnly, no access from JS]
   - Domain: localhost
   - Path: /
   - HttpOnly: ✅ checked
   - Secure: (checked in prod)
   - SameSite: Strict

4. Local Storage
5. Vérifier "user" et "authenticated"
```

### Network Monitoring

```
1. DevTools Network tab
2. Filter: "auth" ou "refresh"
3. Vérifier requests:

Login:
- POST /api/auth/login
- Status: 201
- Response: user + accessToken
- Cookies: refreshToken set

Refresh:
- POST /api/auth/refresh
- Status: 200
- Response: accessToken
- Request Headers: Cookie: refreshToken=...
```

## ⚠️ Problèmes Courants

### CORS Error

```
Error: Access to XMLHttpRequest blocked by CORS policy

Cause:
- Backend: credentials: false
- Frontend: withCredentials: true

Solution:
Backend app.ts:
  cors({
    credentials: true  // ✅ Add this
  })
```

### Cookie Not Sent

```
Cookie: refreshToken not in Request Headers

Cause:
- withCredentials: false
- Not same domain
- Cookie expired

Solution:
Frontend api-client.ts:
  axios.create({
    withCredentials: true  // ✅ Must be true
  })
```

### 401 Unauthorized Loop

```
GET /api/data → 401
POST /auth/refresh → 401
GET /api/data → 401 (infinite loop)

Cause:
- Refresh token cookie expired
- Redis token cleared

Solution:
- Logout + fresh login
- Clear cookies manually
```

## ✅ Checklist Intégration

- [ ] Backend cookie-parser installé
- [ ] Backend app.ts cors credentials: true
- [ ] Backend endpoints retournent accessToken
- [ ] Backend logout efface cookie
- [ ] Frontend token-manager.ts créé
- [ ] Frontend api-client.ts interceptors actifs
- [ ] Frontend useAuth hook complet
- [ ] Frontend login/register pages intégrés
- [ ] Frontend dashboard page protégée
- [ ] Frontend logout button fonctionne
- [ ] Tests: Login basique ✅
- [ ] Tests: Token refresh ✅
- [ ] Tests: Session restore ✅
- [ ] Tests: Logout ✅
- [ ] Tests: Protected routes ✅
- [ ] Logs: Console logs visibles
- [ ] DevTools: Cookies correctement set
- [ ] Network: Refresh requests visibles

## 🚀 Next Steps

1. **Pages Login/Register**: Personnaliser UI
2. **Protected Routes**: Créer wrapper ProtectedRoute
3. **Error Handling**: UI pour erreurs auth
4. **Permissions**: Implémenter RBAC checker
5. **Testing**: Unit tests pour useAuth
6. **E2E**: Cypress tests pour auth flow

---

**Integration Status**: ✅ **COMPLETE**

**Last Updated**: Feb 16, 2026
**Version**: 1.0.0
