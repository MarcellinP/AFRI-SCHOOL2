# API Examples - Roles & Permissions

## 🚀 Démarrage initial

### 1. Seed la base de données

```bash
npm run seed
```

**Output:**
```
✅ Created 4 roles:
   - Administrator (admin)
   - Orientation Counselor (counselor)
   - Student (student)
   - Parent (parent)

✅ Admin user created:
   Email: admin@afri-school.com
   Password: AdminPassword123
```

---

## 🔐 Authentication - Admin

### 1. Login comme Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "65c7f8a9b1234567890abcde",
      "email": "admin@afri-school.com",
      "firstName": "Admin",
      "lastName": "AFRI-SCHOOL",
      "role": "admin",
      "subscriptionPlan": "pro",
      "isEmailVerified": true,
      "createdAt": "2026-02-16T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save for later use:**
```bash
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📋 Admin Routes - Rôles

### 1. Liste tous les rôles

```bash
curl -X GET http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "roles": [
      {
        "_id": "65c7f8a9b1234567890abcde",
        "name": "admin",
        "displayName": "Administrator",
        "description": "Full system access with all permissions",
        "isSystem": true,
        "isActive": true,
        "permissions": [
          {
            "name": "Create Users",
            "description": "Create Users",
            "resource": "users",
            "action": "create"
          },
          ...
        ]
      },
      {
        "name": "counselor",
        "displayName": "Orientation Counselor",
        ...
      },
      {
        "name": "student",
        "displayName": "Student",
        ...
      },
      {
        "name": "parent",
        "displayName": "Parent",
        ...
      }
    ]
  }
}
```

### 2. Récupère les détails d'un rôle

```bash
# Remplacez role_id par l'ID réel du rôle
curl -X GET http://localhost:5000/api/admin/roles/65c7f8a9b1234567890abcde \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "role": {
      "_id": "65c7f8a9b1234567890abcde",
      "name": "counselor",
      "displayName": "Orientation Counselor",
      "description": "Can manage tests, view results, and provide guidance",
      "permissions": [
        {
          "_id": "65c7f8a9b1234567890abcdf",
          "name": "Read Tests",
          "resource": "tests",
          "action": "read"
        },
        {
          "_id": "65c7f8a9b1234567890abce0",
          "name": "Create Tests",
          "resource": "tests",
          "action": "create"
        },
        ...
      ]
    }
  }
}
```

### 3. Ajouter une permission à un rôle

```bash
curl -X POST http://localhost:5000/api/admin/roles/65c7f8a9b1234567890abcde/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "resource": "schools",
    "action": "create",
    "name": "Create Schools"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Permission added successfully",
  "data": {
    "role": {
      "_id": "65c7f8a9b1234567890abcde",
      "name": "counselor",
      "permissions": [
        ...
        {
          "_id": "65c7f8a9b1234567890abce1",
          "name": "Create Schools",
          "resource": "schools",
          "action": "create"
        }
      ]
    }
  }
}
```

### 4. Supprimer une permission d'un rôle

```bash
curl -X DELETE http://localhost:5000/api/admin/roles/65c7f8a9b1234567890abcde/permissions/65c7f8a9b1234567890abce1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permission removed successfully",
  "data": {
    "role": { ... }
  }
}
```

---

## 📚 Programs - Permission-based CRUD

### 1. Liste les programs (Public)

```bash
curl -X GET "http://localhost:5000/api/programs?field=Science&level=Bachelor"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Programs retrieved successfully",
  "data": {
    "programs": [
      {
        "_id": "65c7f8a9b1234567890abce2",
        "name": "Computer Science",
        "description": "Bachelor in Computer Science",
        "abbreviation": "BSCS",
        "field": "Science",
        "level": "Bachelor",
        "duration": 4,
        "schools": ["school_id_1"],
        "requiredSkills": ["Mathematics", "Programming"],
        "careerOutlook": "Growing",
        "averageSalary": 80000,
        "isActive": true,
        "createdAt": "2026-02-16T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "skip": 0,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### 2. Récupère un program (Public)

```bash
curl -X GET http://localhost:5000/api/programs/65c7f8a9b1234567890abce2
```

**Response (200):**
```json
{
  "success": true,
  "message": "Program retrieved successfully",
  "data": {
    "program": {
      "_id": "65c7f8a9b1234567890abce2",
      "name": "Computer Science",
      ...
      "createdBy": {
        "_id": "admin_user_id",
        "firstName": "Admin",
        "lastName": "AFRI-SCHOOL",
        "email": "admin@afri-school.com"
      }
    }
  }
}
```

### 3. Créer un program (Admin only)

```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Data Science",
    "description": "Master in Data Science and Analytics",
    "abbreviation": "MDS",
    "field": "Science",
    "level": "Master",
    "duration": 2,
    "requiredSkills": ["Statistics", "Python", "Machine Learning"],
    "careerOutlook": "Growing",
    "averageSalary": 95000
  }'
```

**Response succès (201):**
```json
{
  "success": true,
  "message": "Program created successfully",
  "data": {
    "program": {
      "_id": "65c7f8a9b1234567890abce3",
      "name": "Data Science",
      "abbreviation": "MDS",
      ...
      "createdBy": "admin_user_id",
      "createdAt": "2026-02-16T11:00:00.000Z",
      "updatedAt": "2026-02-16T11:00:00.000Z"
    }
  }
}
```

**Erreur - Non autorisé (403):**
```bash
# Try with student token
curl -X POST http://localhost:5000/api/programs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{ ... }'
```

**Response (403):**
```json
{
  "success": false,
  "message": "Forbidden",
  "error": "You do not have permission to create programs"
}
```

### 4. Mettre à jour un program (Admin only)

```bash
curl -X PUT http://localhost:5000/api/programs/65c7f8a9b1234567890abce3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "averageSalary": 105000,
    "careerOutlook": "Growing"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Program updated successfully",
  "data": {
    "program": { ... }
  }
}
```

### 5. Supprimer un program (Admin only)

```bash
curl -X DELETE http://localhost:5000/api/programs/65c7f8a9b1234567890abce3 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Program deleted successfully"
}
```

*Note: Soft delete - `isActive` set to false*

---

## 📊 Admin Routes - Users

### 1. Liste tous les utilisateurs (Admin only)

```bash
curl -X GET "http://localhost:5000/api/admin/users?role=student&skip=0&limit=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id_1",
        "email": "student1@example.com",
        "firstName": "Jean",
        "lastName": "Dupont",
        "role": "student",
        "subscriptionPlan": "free",
        "lastLogin": "2026-02-16T10:00:00.000Z",
        "createdAt": "2026-02-15T10:00:00.000Z"
      },
      ...
    ],
    "pagination": {
      "total": 150,
      "skip": 0,
      "limit": 20,
      "pages": 8
    }
  }
}
```

---

## 🧪 Tester avec différents rôles

### Créer un utilisateur Student

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "firstName": "Marie",
    "lastName": "Martin",
    "password": "StudentPass123",
    "role": "student"
  }'
```

**Save token:**
```bash
export STUDENT_TOKEN="eyJhbGc..."
```

### Créer un utilisateur Counselor

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "counselor@example.com",
    "firstName": "Pierre",
    "lastName": "Bernard",
    "password": "CounselorPass123",
    "role": "counselor"
  }'
```

**Save token:**
```bash
export COUNSELOR_TOKEN="eyJhbGc..."
```

---

## 🔍 Tester les permissions

### Admin peut créer un program ✅
```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{ ... }'
# Response: 201 Created
```

### Counselor peut lire les programs ✅
```bash
curl -X GET http://localhost:5000/api/programs \
  -H "Authorization: Bearer $COUNSELOR_TOKEN"
# Response: 200 OK
```

### Counselor CANNOT créer un program ❌
```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer $COUNSELOR_TOKEN" \
  -d '{ ... }'
# Response: 403 Forbidden
```

### Student peut lire les programs ✅
```bash
curl -X GET http://localhost:5000/api/programs \
  -H "Authorization: Bearer $STUDENT_TOKEN"
# Response: 200 OK
```

### Student CANNOT créer un program ❌
```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{ ... }'
# Response: 403 Forbidden
```

---

## 📝 Summary

### Permissions par rôle - Programs

| Rôle | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Counselor | ✅ | ❌ | ❌ | ❌ |
| Student | ✅ | ❌ | ❌ | ❌ |
| Parent | ✅ | ❌ | ❌ | ❌ |

---

## 🔧 Debugging

### Voir les permissions du token courant

Décoder le JWT sur [jwt.io](https://jwt.io)

### Logs du serveur

```
Permission denied for user jane@example.com (student) trying to create programs
```

### Vérifier la DB

```javascript
// Dans MongoDB
db.roles.find({})
db.users.find({})
db.programs.find({})
```
