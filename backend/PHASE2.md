# PHASE 2 — AUTHENTIFICATION ✅

## 📋 Résumé complet de l'implémentation

### 1️⃣ Modèle User (Mongoose) ✅
**Fichier:** `src/models/User.ts`

**Schéma:**
```typescript
{
  email: string (unique, lowercase, validated)
  firstName: string (min 2 chars)
  lastName: string (min 2 chars)
  password: string (min 8 chars, hashed with bcrypt)
  phone?: string
  role: 'student' | 'parent' | 'counselor' | 'admin' (default: 'student')
  subscriptionPlan: 'free' | 'premium' | 'pro' (default: 'free')
  stripeCustomerId?: string
  isEmailVerified: boolean (default: false)
  isActive: boolean (default: true, not returned by default)
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
```

**Méthodes:**
- `comparePassword(password: string): Promise<boolean>` - Compare mots de passe hashés
- `toJSON()` - Exclut password et isActive de la sérialisation

**Hooks:**
- Pre-save: Hash du mot de passe avec bcryptjs (salt=10)

**Indices:**
- `email` - Pour les recherches rapides
- `createdAt` - Pour les tri par date

### 2️⃣ Service JWT (Utility) ✅
**Fichier:** `src/utils/jwt.ts`

**Méthodes:**
- `generateAccessToken(payload: IJwtPayload): string` - Crée access token (15m)
- `generateRefreshToken(payload: IJwtPayload): string` - Crée refresh token (7j)
- `generateTokens(payload: IJwtPayload)` - Génère les deux tokens
- `verifyAccessToken(token: string): IJwtPayload` - Vérifie access token
- `verifyRefreshToken(token: string): IJwtPayload` - Vérifie refresh token
- `decodeToken(token: string)` - Décode sans vérifier (pour logs)

**Configuration:**
```
Access Token:  15 minutes
Refresh Token: 7 jours
```

### 3️⃣ Service Authentification ✅
**Fichier:** `src/services/AuthService.ts`

**Méthodes principales:**

#### `register(email, firstName, lastName, password, role)`
- ✅ Vérifie si email existe
- ✅ Hash le mot de passe
- ✅ Crée l'utilisateur
- ✅ Génère tokens JWT
- ✅ Stock le refresh token dans Redis
- ❌ Throws: `ConflictError` si email existe
- 📝 Logs: Enregistrement utilisateur

#### `login(email, password)`
- ✅ Trouve l'utilisateur
- ✅ Vérifie le compte actif
- ✅ Compare les mots de passe
- ✅ Met à jour `lastLogin`
- ✅ Génère tokens JWT
- ✅ Stock le refresh token dans Redis
- ❌ Throws: `UnauthorizedError` si credentials invalides
- 📝 Logs: Connexion utilisateur

#### `refreshAccessToken(refreshToken)`
- ✅ Vérifie le refresh token
- ✅ Vérifie la présence dans Redis
- ✅ Vérifie l'utilisateur actif
- ✅ Génère nouveaux tokens
- ✅ Met à jour le refresh token dans Redis
- ❌ Throws: `UnauthorizedError` si token invalide
- 📝 Logs: Rafraîchissement du token

#### `logout(userId)`
- ✅ Supprime le refresh token de Redis
- 📝 Logs: Déconnexion utilisateur

#### `getUserById(userId)`
- ✅ Récupère l'utilisateur par ID
- 📝 Logs: Erreurs seulement

### 4️⃣ Controller Authentification ✅
**Fichier:** `src/controllers/AuthController.ts`

**Endpoints:**
- `register` - POST /api/auth/register
- `login` - POST /api/auth/login
- `refreshToken` - POST /api/auth/refresh
- `logout` - POST /api/auth/logout
- `getCurrentUser` - GET /api/auth/me

**Tous les handlers:**
- ✅ Utilisent `catchAsync` pour gestion d'erreurs
- ✅ Retournent `success: true|false`
- ✅ Retournent un message descriptif
- ✅ Retournent les données dans `data`

### 5️⃣ Routes d'Authentification ✅
**Fichier:** `src/routes/authRoutes.ts`

```
POST   /api/auth/register     - Inscription (rate-limited: 5/15min)
POST   /api/auth/login        - Connexion (rate-limited: 5/15min)
POST   /api/auth/refresh      - Rafraîchir token
POST   /api/auth/logout       - Déconnexion (protected)
GET    /api/auth/me           - Utilisateur courant (protected)
```

**Rate Limiting:**
- Register/Login: 5 requests / 15 minutes (strict)
- Autres: Rate limit général (100/15min)

### 6️⃣ Validateurs ✅
**Fichier:** `src/validators/authValidator.ts`

**Register Validation:**
```
email:     Format email valide
firstName: Min 2 characters
lastName:  Min 2 characters
password:  Min 8 chars + Uppercase + Lowercase + Number
role:      'student' | 'parent' | 'counselor' (optional)
```

**Login Validation:**
```
email:    Format email valide
password: Requis
```

**Refresh Token Validation:**
```
refreshToken: Requis
```

**Middleware `validate`:**
- Retourne 422 si validation échoue
- Formate les erreurs par champ
- Logs les erreurs

### 7️⃣ Middlewares d'Authentification ✅
**Fichier:** `src/middlewares/auth.ts`

#### `protect` - Middleware de protection
- ✅ Vérifie la présence du token Bearer
- ✅ Extrait et valide le JWT
- ✅ Récupère l'utilisateur de DB
- ✅ Attache `req.user` au contexte
- ❌ Throws: 401 si token manquant/invalide
- 📝 Logs: Erreurs

#### `authorize(...allowedRoles)` - Middleware de rôles
- ✅ Vérifie que `req.user` existe
- ✅ Vérifie que le rôle est dans `allowedRoles`
- ❌ Throws: 403 si rôle non autorisé
- 📝 Logs: Tentatives non autorisées

#### `optionalAuth` - Auth optionnelle
- ✅ N'échoue jamais
- ✅ Attache `req.user` si token valide
- ✅ Continue même sans token
- 📝 Logs: Debug only

### 8️⃣ Extension Express Request
```typescript
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}
```

Permet `req.user` dans tous les handlers

### 9️⃣ Intégration dans app.ts ✅
```typescript
// Importé les routes
import authRoutes from './routes/authRoutes';

// Enregistré les routes
app.use('/api/auth', authRoutes);
```

## 📁 Structure finale

```
backend/src/
├── controllers/
│   └── AuthController.ts        ✅ Handlers des requêtes
├── services/
│   └── AuthService.ts           ✅ Logique métier
├── routes/
│   └── authRoutes.ts            ✅ Définition des routes
├── models/
│   └── User.ts                  ✅ Schéma Mongoose
├── middlewares/
│   ├── auth.ts                  ✅ protect, authorize, optionalAuth
│   ├── errorHandler.ts          ✅ Gestion erreurs
│   └── rateLimiter.ts           ✅ Rate limiting
├── validators/
│   └── authValidator.ts         ✅ Validation des entrées
├── utils/
│   ├── jwt.ts                   ✅ Génération/Vérification JWT
│   ├── logger.ts                ✅ Winston logger
│   └── AppError.ts              ✅ Classes d'erreur
└── types/
    └── index.ts                 ✅ Types TypeScript
```

## 🔐 Flux d'authentification

### 1. Inscription (Register)
```
POST /api/auth/register
{
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123",
  "role": "student"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Connexion (Login)
```
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 3. Rafraîchir le token (Refresh)
```
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 4. Accès protégé (Protected)
```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}

Response:
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": { ... }
  }
}
```

### 5. Déconnexion (Logout)
```
POST /api/auth/logout
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}

Response:
{
  "success": true,
  "message": "User logged out successfully"
}
```

## 🚀 Utilisation dans d'autres routes

### Route protégée
```typescript
router.get('/profile', protect, ProfileController.getProfile);
```

### Route avec rôles
```typescript
router.delete(
  '/user/:id',
  protect,
  authorize('admin'),
  UserController.deleteUser
);
```

### Rôles multiples
```typescript
router.get(
  '/reports',
  protect,
  authorize('admin', 'counselor'),
  ReportController.getReports
);
```

## ✅ Checklist implémentation

- ✅ Modèle User avec bcrypt
- ✅ JWT tokens (access + refresh)
- ✅ Redis pour refresh token storage
- ✅ Service d'authentification complet
- ✅ Controller avec tous les handlers
- ✅ Routes avec rate limiting
- ✅ Validation des entrées
- ✅ Middlewares protect et authorize
- ✅ Gestion des erreurs globale
- ✅ Logs structurés
- ✅ Types TypeScript complets
- ✅ Intégration dans app.ts

## 🧪 Prochaines phases

### Phase 3 - Modèles métier
- School
- Field
- Test
- TestResult
- Subscription

### Phase 4 - Services métier
- School service
- Test service
- Result analysis
- Recommendation engine

### Phase 5 - Paiement Stripe
- Subscription creation
- Webhook handling
- Plan management

## 🎉 Authentification complète et production-ready!

La fondation d'authentification est maintenant :
- ✅ Sécurisée (bcrypt, JWT, rate limiting)
- ✅ Scalable (Redis cache, DB indices)
- ✅ Maintenable (Clean architecture)
- ✅ Testable (Services découplés)
- ✅ Documentée (Types, comments, flows)
