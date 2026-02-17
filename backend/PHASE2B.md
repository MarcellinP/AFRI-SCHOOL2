# PHASE 2B — RÔLES & PERMISSIONS ✅

## 📋 Résumé complet de l'implémentation

### 1️⃣ Modèle Role (Mongoose) ✅
**Fichier:** `src/models/Role.ts`

**Schéma:**
```typescript
{
  name: string (unique, lowercase)           // 'admin', 'counselor', 'student', 'parent'
  displayName: string                        // 'Administrator', etc.
  description: string                        // Description du rôle
  permissions: IPermission[]                 // Array de permissions
  isSystem: boolean                          // Ne peut pas être supprimé si true
  isActive: boolean (default: true)          // Peut être désactivé
  createdAt: Date
  updatedAt: Date
}
```

**Objet Permission:**
```typescript
{
  name: string                               // 'Create Users'
  description: string                        // Description
  resource: string (lowercase)               // 'users', 'schools', 'tests', etc.
  action: string (lowercase)                 // 'create' | 'read' | 'update' | 'delete'
}
```

**Méthodes:**
- `hasPermission(resource: string, action: string): boolean` - Vérifie si role a permission

### 2️⃣ Configuration Permissions ✅
**Fichier:** `src/config/permissions.ts`

**Permissions définies:**
```typescript
USER_CREATE, USER_READ, USER_UPDATE, USER_DELETE
SCHOOL_CREATE, SCHOOL_READ, SCHOOL_UPDATE, SCHOOL_DELETE
PROGRAM_CREATE, PROGRAM_READ, PROGRAM_UPDATE, PROGRAM_DELETE
TEST_CREATE, TEST_READ, TEST_UPDATE, TEST_DELETE
RESULT_CREATE, RESULT_READ, RESULT_UPDATE, RESULT_DELETE
SUBSCRIPTION_CREATE, SUBSCRIPTION_READ, SUBSCRIPTION_UPDATE, SUBSCRIPTION_DELETE
REPORT_READ, REPORT_CREATE, ADMIN_ACCESS
```

**Rôles par défaut:**

#### Admin
- **Accès:** Toutes les permissions
- **Cas d'usage:** Gestion complète du système

#### Counselor (Conseiller d'orientation)
- **Permissions:**
  - Test: read, create
  - Result: read, create
  - School: read
  - Program: read
  - Report: read
  - User: read
- **Cas d'usage:** Gérer tests, voir résultats, offrir des recommandations

#### Student (Étudiant)
- **Permissions:**
  - Test: read, create (passer les tests)
  - Result: read, create
  - School: read
  - Program: read
- **Cas d'usage:** Passer des tests et voir les recommandations

#### Parent
- **Permissions:**
  - Result: read
  - School: read
  - Program: read
- **Cas d'usage:** Surveiller le progrès de l'enfant

### 3️⃣ Middlewares de Permissions ✅
**Fichier:** `src/middlewares/permissions.ts`

#### `hasPermission(resource, action)`
```typescript
router.post(
  '/users',
  protect,
  hasPermission('users', 'create'),
  UserController.createUser
);
```
- Vérifie la permission exacte
- Retourne 403 si non autorisé

#### `hasAnyPermission(permissions[])`
```typescript
// Utilisateur doit avoir AU MOINS UNE permission
router.get(
  '/reports',
  protect,
  hasAnyPermission([['reports', 'read'], ['reports', 'create']]),
  ReportController.getReports
);
```
- Logique OR
- Retourne 403 si aucune permission

#### `hasAllPermissions(permissions[])`
```typescript
// Utilisateur doit avoir TOUTES les permissions
router.delete(
  '/admin/users/:id',
  protect,
  hasAllPermissions([['users', 'delete'], ['users', 'read']]),
  UserController.deleteUser
);
```
- Logique AND
- Retourne 403 si une permission manque

### 4️⃣ Service Rôles ✅
**Fichier:** `src/services/RoleService.ts`

**Méthodes:**

#### `seedRoles()`
- Crée les rôles par défaut au premier démarrage
- Appelée automatiquement dans app.ts
- Idempotente (ne crée pas si déjà existants)

#### `addPermissionToRole(roleName, resource, action, permissionName?)`
- Ajoute une permission à un rôle
- Retourne le rôle mis à jour

#### `removePermissionFromRole(roleName, resource, action)`
- Supprime une permission d'un rôle
- Retourne le rôle mis à jour

#### `getRolePermissions(roleName)`
- Retourne toutes les permissions d'un rôle

#### `listAllRoles()`
- Retourne tous les rôles actifs

### 5️⃣ Modèle Program ✅
**Fichier:** `src/models/Program.ts`

**Schéma:**
```typescript
{
  name: string (unique)
  description: string
  abbreviation: string (unique, uppercase)
  field: string (enum: 'Science', 'Arts', 'Business', 'Engineering', 'Health', 'Social Studies', 'Other')
  level: string (enum: 'Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate')
  duration: number (years, 1-10)
  schools: ObjectId[]                        // References à des écoles
  requiredSkills: string[]
  careerOutlook: string (enum: 'Growing', 'Stable', 'Declining', 'Unknown')
  averageSalary?: number
  isActive: boolean (default: true)
  createdBy: ObjectId (User)
  createdAt: Date
  updatedAt: Date
}
```

### 6️⃣ Routes Programs ✅
**Fichier:** `src/routes/programRoutes.ts`

```
GET    /api/programs           - Liste publique
GET    /api/programs/:id       - Détails publiques
POST   /api/programs           - Admin only (create)
PUT    /api/programs/:id       - Admin only (update)
DELETE /api/programs/:id       - Admin only (delete - soft delete)
```

**Exemple: POST /api/programs (Admin only)**
```
Middleware chain:
1. protect                           - Vérifie JWT
2. hasPermission('programs', 'create') - Vérifie permission
3. ProgramController.createProgram   - Handler
```

### 7️⃣ Routes Admin ✅
**Fichier:** `src/routes/adminRoutes.ts`

#### Gestion des Rôles
```
GET    /api/admin/roles                    - List all roles (admin only)
GET    /api/admin/roles/:id                - Get role details (admin only)
POST   /api/admin/roles/seed               - Seed default roles (admin only)
POST   /api/admin/roles/:roleId/permissions   - Add permission (admin only)
DELETE /api/admin/roles/:roleId/permissions/:permissionId - Remove permission (admin only)
```

#### Gestion des Utilisateurs
```
GET    /api/admin/users                    - List users (admin only)
```

### 8️⃣ Script Seed ✅
**Fichier:** `src/scripts/seed.ts`

**Fonctionnalités:**
- Crée les 4 rôles par défaut avec leurs permissions
- Crée un utilisateur admin par défaut
- Idempotent (peut être exécuté plusieurs fois)
- Logs détaillés

**Utilisation:**
```bash
npm run seed
```

**Résultat:**
```
✅ Created 4 roles:
   - Administrator (admin)
   - Orientation Counselor (counselor)
   - Student (student)
   - Parent (parent)

✅ Admin user created:
   Email: admin@afri-school.com
   Password: AdminPassword123
   ⚠️  IMPORTANT: Change this password immediately in production!
```

## 🔐 Flux d'autorisation

```
REQUEST: POST /api/programs (Bearer token)
  ↓
app.use(apiLimiter)                    - Rate limit général
  ↓
app.use(protect)                       - Vérifie JWT, attach req.user
  ↓
app.use(hasPermission('programs', 'create'))
  ↓
  1. Get role du user depuis DB
  2. Check role.hasPermission('programs', 'create')
  3. Si non → 403 Forbidden
  4. Si oui → continue
  ↓
ProgramController.createProgram        - Handler
```

## 📊 Exemple d'utilisation

### 1. Seed la base de données
```bash
npm run seed
```

### 2. Login en tant qu'admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123"
  }'
```

Réponse:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 3. Créer un program (Admin only)
```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "name": "Computer Science",
    "description": "Bachelor in Computer Science",
    "abbreviation": "BSC",
    "field": "Science",
    "level": "Bachelor",
    "duration": 4,
    "requiredSkills": ["Mathematics", "Problem Solving"],
    "careerOutlook": "Growing",
    "averageSalary": 60000
  }'
```

Réponse succès (201):
```json
{
  "success": true,
  "message": "Program created successfully",
  "data": {
    "program": { ... }
  }
}
```

### 4. Essayer avec un rôle non autorisé
Login en tant que `student`:
```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer student_token" \
  -d '{ ... }'
```

Réponse (403):
```json
{
  "success": false,
  "message": "Forbidden",
  "error": "You do not have permission to create programs"
}
```

## 🛠️ Ajouter une nouvelle permission

### 1. Ajouter à `PERMISSIONS` dans `config/permissions.ts`
```typescript
export const PERMISSIONS = {
  // ...
  CUSTOM_ACTION: { 
    resource: 'custom_resource', 
    action: 'action', 
    name: 'Custom Permission' 
  },
};
```

### 2. Utiliser dans une route
```typescript
router.post(
  '/custom',
  protect,
  hasPermission('custom_resource', 'action'),
  CustomController.handler
);
```

## 🛠️ Créer un nouveau rôle

### Via API (Admin only)
```bash
POST /api/admin/roles
{
  "name": "moderator",
  "displayName": "Moderator",
  "description": "Can moderate content",
  "permissions": [...]
}
```

### Via code
Ajouter à `DEFAULT_ROLES` dans `config/permissions.ts` et relancer `npm run seed`

## 📁 Structure finale

```
backend/src/
├── models/
│   ├── User.ts
│   ├── Role.ts                    ✅ Modèle Role
│   └── Program.ts                 ✅ Modèle Program
├── config/
│   └── permissions.ts             ✅ Permissions et rôles par défaut
├── middlewares/
│   ├── auth.ts
│   └── permissions.ts             ✅ Middlewares de permissions
├── services/
│   ├── AuthService.ts
│   └── RoleService.ts             ✅ Logique des rôles
├── controllers/
│   └── ProgramController.ts        ✅ Handlers pour programs
├── routes/
│   ├── authRoutes.ts
│   ├── programRoutes.ts           ✅ Routes programs
│   └── adminRoutes.ts             ✅ Routes admin
└── scripts/
    └── seed.ts                     ✅ Script seed
```

## ✅ Checklist implémentation

- ✅ Modèle Role avec permissions
- ✅ 4 rôles par défaut (admin, counselor, student, parent)
- ✅ Permissions granulaires (CRUD par ressource)
- ✅ Middlewares hasPermission
- ✅ Exemple routes programs
- ✅ Script seed automatique
- ✅ Gestion admin des rôles/permissions
- ✅ Soft delete pour programs
- ✅ Logs détaillés
- ✅ Gestion erreurs cohérente

## 🚀 Utilisation dans les phases futures

### Phase 3 - Modèles métier
```typescript
// Chaque route peut être protégée
router.post(
  '/schools',
  protect,
  hasPermission('schools', 'create'),
  SchoolController.createSchool
);
```

### Phase 4 - Reports et statistiques
```typescript
router.get(
  '/reports',
  protect,
  hasPermission('reports', 'read'),
  ReportController.getReports
);
```

## 🎉 Rôles & Permissions production-ready!

Le système est maintenant :
- ✅ Flexible (permissions granulaires)
- ✅ Scalable (facile d'ajouter des rôles)
- ✅ Sécurisé (vérification à chaque requête)
- ✅ Maintenable (centralisé dans config/permissions.ts)
- ✅ Auditables (tous les logs)
