# EXEMPLES - PHASE 3: SCHOOLS & PROGRAMS API

## 📌 Prérequis

- Backend en cours d'exécution: `http://localhost:5000`
- Admin user créé: `admin@afri-school.com` / `AdminPassword123!`

---

## 🔑 Étape 1: Authentification Admin

```bash
# Connexion admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123!"
  }' | jq '.'

# Réponse:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "650f1a2b3c4d5e6f7g8h9i0j",
      "email": "admin@afri-school.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# Sauvegarder les tokens
TOKEN=<accessToken_value>
REFRESH_TOKEN=<refreshToken_value>
```

---

## 🏫 SCHOOLS API EXAMPLES

### 1️⃣ Créer une école (Admin only)

```bash
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Université Cheikh Anta Diop",
    "description": "Premier établissement d'enseignement supérieur du Sénégal, fondée en 1957. Offre des programmes dans les sciences, lettres, droit, et médecine.",
    "abbreviation": "UCAD",
    "location": "Dakar",
    "country": "Sénégal",
    "email": "contact@ucad.sn",
    "phone": "+221-33-819-5000",
    "website": "https://www.ucad.sn",
    "logo": "https://ucad.sn/logo.png",
    "schoolType": "Public",
    "studentCapacity": 25000,
    "establishedYear": 1957,
    "ranking": 150,
    "averageFees": 0,
    "admissionRate": 12.5,
    "accreditation": ["WAEC", "CAMES"]
  }' | jq '.'

# Réponse réussie:
{
  "success": true,
  "message": "School created successfully",
  "data": {
    "school": {
      "_id": "650f1a2b3c4d5e6f7g8h9i0k",
      "name": "Université Cheikh Anta Diop",
      "abbreviation": "UCAD",
      "country": "Sénégal",
      "schoolType": "Public",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": "650f1a2b3c4d5e6f7g8h9i0j"
    }
  }
}
```

### 2️⃣ Créer autre école (Privée)

```bash
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Université Virtuelle du Sénégal",
    "description": "Première université d'enseignement à distance en Afrique de l'Ouest. Offre plus de 50 programmes différents.",
    "abbreviation": "UVS",
    "location": "Dakar",
    "country": "Sénégal",
    "email": "contact@uvs.sn",
    "phone": "+221-33-822-0000",
    "website": "https://www.uvs.sn",
    "schoolType": "Private",
    "studentCapacity": 50000,
    "establishedYear": 2003,
    "ranking": 200,
    "averageFees": 1500,
    "admissionRate": 85,
    "accreditation": ["WAEC", "AACRAO"]
  }' | jq '.'
```

### 3️⃣ Lister toutes les écoles (Public)

```bash
# Sans filtres (les 10 premiers)
curl http://localhost:5000/api/schools | jq '.'

# Réponse:
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": {
    "schools": [
      {
        "_id": "650f1a2b3c4d5e6f7g8h9i0k",
        "name": "Université Cheikh Anta Diop",
        "abbreviation": "UCAD",
        "country": "Sénégal",
        "location": "Dakar",
        "schoolType": "Public",
        "studentCapacity": 25000,
        "establishedYear": 1957,
        "ranking": 150,
        "isActive": true
      }
    ],
    "pagination": {
      "total": 2,
      "skip": 0,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### 4️⃣ Filtrer écoles par pays

```bash
curl "http://localhost:5000/api/schools?country=Sénégal&limit=10" | jq '.'
```

### 5️⃣ Filtrer écoles par type

```bash
curl "http://localhost:5000/api/schools?schoolType=Public&limit=10" | jq '.'
```

### 6️⃣ Rechercher écoles par texte

```bash
curl "http://localhost:5000/api/schools?search=Dakar" | jq '.'
```

### 7️⃣ Pagination et tri

```bash
# Page 2, 5 écoles par page, trié par nom ascendant
curl "http://localhost:5000/api/schools?skip=5&limit=5&sortBy=name&sortOrder=asc" | jq '.'

# Trié par date de création décroissante
curl "http://localhost:5000/api/schools?sortBy=createdAt&sortOrder=desc&limit=20" | jq '.'
```

### 8️⃣ Récupérer une école spécifique (Public)

```bash
curl http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0k | jq '.'

# Réponse:
{
  "success": true,
  "message": "School retrieved successfully",
  "data": {
    "school": {
      "_id": "650f1a2b3c4d5e6f7g8h9i0k",
      "name": "Université Cheikh Anta Diop",
      "description": "...",
      "abbreviation": "UCAD",
      "location": "Dakar",
      "country": "Sénégal",
      "email": "contact@ucad.sn",
      "phone": "+221-33-819-5000",
      "website": "https://www.ucad.sn",
      "schoolType": "Public",
      "studentCapacity": 25000,
      "establishedYear": 1957,
      "ranking": 150,
      "averageFees": 0,
      "admissionRate": 12.5,
      "accreditation": ["WAEC", "CAMES"],
      "programs": [],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "_id": "650f1a2b3c4d5e6f7g8h9i0j",
        "firstName": "Admin",
        "lastName": "User"
      }
    }
  }
}
```

### 9️⃣ Mettre à jour une école (Admin only)

```bash
curl -X PUT http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0k \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentCapacity": 30000,
    "ranking": 140,
    "admissionRate": 15
  }' | jq '.'

# Réponse:
{
  "success": true,
  "message": "School updated successfully",
  "data": {
    "school": {
      "_id": "650f1a2b3c4d5e6f7g8h9i0k",
      "name": "Université Cheikh Anta Diop",
      "studentCapacity": 30000,
      "ranking": 140,
      "admissionRate": 15,
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  }
}
```

### 🔟 Supprimer une école (Admin only - Soft Delete)

```bash
curl -X DELETE http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0k \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Réponse:
{
  "success": true,
  "message": "School deleted successfully"
}

# Note: L'école n'est pas supprimée physiquement, juste marquée isActive: false
```

---

## 📚 PROGRAMS API EXAMPLES

### 1️⃣ Créer un programme (Admin only)

```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Licence en Informatique",
    "description": "Programme de 3 ans en sciences informatiques couvrant les bases de la programmation, les structures de données, les bases de données et les algorithmes.",
    "abbreviation": "LIC-INFO",
    "field": "Science",
    "level": "Licence",
    "duration": 3,
    "language": "French",
    "tuitionFees": 2500,
    "admissionRequirements": "Baccalauréat série S ou équivalent minimum",
    "careerOutcomes": ["Software Developer", "Data Analyst", "Systems Administrator", "IT Consultant"]
  }' | jq '.'

# Réponse:
{
  "success": true,
  "message": "Program created successfully",
  "data": {
    "program": {
      "_id": "650f1a2b3c4d5e6f7g8h9i0l",
      "name": "Licence en Informatique",
      "abbreviation": "LIC-INFO",
      "field": "Science",
      "level": "Licence",
      "duration": 3,
      "language": "French",
      "isActive": true,
      "createdAt": "2024-01-15T10:35:00Z"
    }
  }
}
```

### 2️⃣ Créer autre programme

```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Master en Ingénierie Logicielle",
    "description": "Programme avancé de 2 ans en génie logiciel avec spécialisation en architecture d'entreprise.",
    "abbreviation": "MAST-INFOSOFT",
    "field": "Engineering",
    "level": "Master",
    "duration": 2,
    "language": "French",
    "tuitionFees": 5000,
    "admissionRequirements": "Licence en Informatique ou domaine connexe",
    "careerOutcomes": ["Senior Developer", "Software Architect", "Project Manager"]
  }' | jq '.'
```

### 3️⃣ Lister tous les programmes (Public)

```bash
curl http://localhost:5000/api/programs | jq '.'
```

### 4️⃣ Filtrer programmes par domaine

```bash
curl "http://localhost:5000/api/programs?field=Engineering" | jq '.'
```

### 5️⃣ Filtrer programmes par niveau

```bash
curl "http://localhost:5000/api/programs?level=Master" | jq '.'
```

### 6️⃣ Rechercher programmes

```bash
curl "http://localhost:5000/api/programs?search=Informatique" | jq '.'
```

### 7️⃣ Récupérer un programme (Public)

```bash
curl http://localhost:5000/api/programs/650f1a2b3c4d5e6f7g8h9i0l | jq '.'
```

### 8️⃣ Mettre à jour un programme (Admin only)

```bash
curl -X PUT http://localhost:5000/api/programs/650f1a2b3c4d5e6f7g8h9i0l \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tuitionFees": 3000,
    "duration": 4
  }' | jq '.'
```

### 9️⃣ Supprimer un programme (Admin only)

```bash
curl -X DELETE http://localhost:5000/api/programs/650f1a2b3c4d5e6f7g8h9i0l \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 🔗 Relation SCHOOLS-PROGRAMS

### 1️⃣ Ajouter un programme à une école

```bash
# Assumant:
# SCHOOL_ID = 650f1a2b3c4d5e6f7g8h9i0k
# PROGRAM_ID = 650f1a2b3c4d5e6f7g8h9i0l

curl -X POST \
  "http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0k/programs/650f1a2b3c4d5e6f7g8h9i0l" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Réponse:
{
  "success": true,
  "message": "Program added to school successfully",
  "data": {
    "school": {
      "_id": "650f1a2b3c4d5e6f7g8h9i0k",
      "name": "Université Cheikh Anta Diop",
      "programs": ["650f1a2b3c4d5e6f7g8h9i0l"]
    }
  }
}
```

### 2️⃣ Retirer un programme d'une école

```bash
curl -X DELETE \
  "http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0k/programs/650f1a2b3c4d5e6f7g8h9i0l" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 3️⃣ Voir école avec ses programmes

```bash
curl http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0k | jq '.data.school.programs'

# Réponse avec programmes populés:
{
  "success": true,
  "data": {
    "school": {
      ...
      "programs": [
        {
          "_id": "650f1a2b3c4d5e6f7g8h9i0l",
          "name": "Licence en Informatique",
          "abbreviation": "LIC-INFO",
          "field": "Science"
        }
      ]
    }
  }
}
```

---

## ⚠️ Erreurs courants et solutions

### 1. Erreur 401: Unauthorized
```json
{
  "success": false,
  "error": "Authorization header is missing or invalid"
}
```
**Solution**: Ajouter le header `Authorization: Bearer <TOKEN>`

### 2. Erreur 403: Forbidden
```json
{
  "success": false,
  "error": "You don't have permission to perform this action"
}
```
**Solution**: Utiliser un compte admin ou ayant la permission `schools:create`

### 3. Erreur 422: Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "School name must be at least 3 characters"
    }
  ]
}
```
**Solution**: Vérifier les données envoyées contre les règles de validation

### 4. Erreur 409: Conflict (Duplication)
```json
{
  "success": false,
  "error": "School abbreviation already exists"
}
```
**Solution**: Utiliser une abbreviation unique

---

## 🛠️ Scripts utiles

### Script bash pour tester le flux complet

```bash
#!/bin/bash

API="http://localhost:5000"

# 1. Login
echo "🔑 Logging in..."
RESPONSE=$(curl -s -X POST $API/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123!"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.data.accessToken')
echo "Token: $TOKEN"

# 2. Create school
echo "🏫 Creating school..."
SCHOOL=$(curl -s -X POST $API/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test University",
    "description": "A test university for demonstration",
    "abbreviation": "TU123",
    "location": "TestCity",
    "country": "TestCountry",
    "email": "contact@test.edu",
    "phone": "+123456789",
    "schoolType": "Private",
    "studentCapacity": 5000,
    "establishedYear": 2000
  }')

SCHOOL_ID=$(echo $SCHOOL | jq -r '.data.school._id')
echo "School created: $SCHOOL_ID"

# 3. List schools
echo "📚 Listing schools..."
curl -s $API/api/schools | jq '.data.pagination'

# 4. Get school detail
echo "🔍 Getting school detail..."
curl -s $API/api/schools/$SCHOOL_ID | jq '.data.school | {name, abbreviation, country}'

# 5. Update school
echo "✏️ Updating school..."
curl -s -X PUT $API/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentCapacity": 6000,
    "ranking": 95
  }' | jq '.data.school | {name, studentCapacity, ranking}'

echo "✅ Test completed!"
```

---

## 📋 Checklist test complet

- [ ] Connexion admin réussie (TOKEN obtenu)
- [ ] Créer une école - réponse 201 avec `_id`
- [ ] Lister écoles - réponse 200 avec pagination
- [ ] Filtrer écoles par pays - résultats filtrés correctement
- [ ] Créer programme - réponse 201
- [ ] Ajouter programme à école - école.programs contient le programme
- [ ] Mettre à jour école - changements sauvegardés
- [ ] Supprimer école - isActive devient false
- [ ] Accès non-admin sur POST/PUT/DELETE - réponse 403
- [ ] Données invalides - réponse 422 avec erreurs spécifiques

