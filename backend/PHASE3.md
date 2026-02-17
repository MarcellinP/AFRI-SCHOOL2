# PHASE 3 - MODULES MÉTIER: SCHOOLS & PROGRAMS

## 📋 Vue d'ensemble

Cette phase implémente les deux modules métier principaux:
1. **Schools (Écoles)** - Gestion des institutions éducatives
2. **Programs (Programmes)** - Gestion des cursus académiques

Les deux modules suivent le même pattern architectural:
- **Routes** → **Controllers** → **Services** → **Models**
- Validation robuste avec express-validator
- Permission-based access control (RBAC)
- Soft-delete pattern (isActive flag)
- Pagination et filtrage

---

## 🏫 SCHOOLS Module

### Modèle

```typescript
interface ISchool {
  name: string;                    // Nom unique de l'école
  description: string;              // Description détaillée
  abbreviation: string;              // Abbréviation unique (ex: DAKAR_U)
  location: string;                 // Ville
  country: string;                  // Pays
  email: string;                    // Email de contact
  phone: string;                    // Téléphone
  website?: string;                 // Site web
  logo?: string;                    // URL du logo
  schoolType: 'Public'|'Private'|'International';
  accreditation?: string[];         // Certifications
  programs: ObjectId[];             // Références aux programmes
  studentCapacity: number;          // Capacité d'étudiants
  establishedYear: number;          // Année de création (1800+)
  ranking?: number;                 // Classement mondiale
  averageFees?: number;             // Frais moyens/an
  admissionRate?: number;           // Taux d'admission (0-100%)
  isActive: boolean;                // Soft-delete
  createdBy: ObjectId;              // Créé par (User ID)
  timestamps: Date;
}
```

### Endpoints

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/api/schools` | Public | Lister les écoles avec filtrage et pagination |
| GET | `/api/schools/:id` | Public | Récupérer les détails d'une école |
| POST | `/api/schools` | admin, create:schools | Créer une école |
| PUT | `/api/schools/:id` | admin, update:schools | Modifier une école |
| DELETE | `/api/schools/:id` | admin, delete:schools | Supprimer une école (soft-delete) |
| POST | `/api/schools/:id/programs/:programId` | admin, update:schools | Ajouter un programme à l'école |
| DELETE | `/api/schools/:id/programs/:programId` | admin, update:schools | Retirer un programme de l'école |

### Exemple: Créer une école

```bash
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Université Cheikh Anta Diop",
    "description": "Premier établissement d'enseignement supérieur du Sénégal",
    "abbreviation": "UCAD",
    "location": "Dakar",
    "country": "Sénégal",
    "email": "contact@ucad.sn",
    "phone": "+221-33-XXX-XXXX",
    "website": "https://www.ucad.sn",
    "schoolType": "Public",
    "studentCapacity": 25000,
    "establishedYear": 1957,
    "ranking": 150,
    "averageFees": 0,
    "admissionRate": 12.5,
    "accreditation": ["WAEC", "CAMES"]
  }'
```

### Exemple: Lister les écoles avec filtrage

```bash
# Lister toutes les écoles publiques au Sénégal, triées par date
curl "http://localhost:5000/api/schools?country=Sénégal&schoolType=Public&sortBy=createdAt&sortOrder=desc&limit=10"

# Rechercher des écoles par nom/ville
curl "http://localhost:5000/api/schools?search=Dakar&limit=20"

# Pagination
curl "http://localhost:5000/api/schools?skip=0&limit=10"
```

---

## 📚 PROGRAMS Module

### Modèle

```typescript
interface IProgram {
  name: string;                      // Nom du programme
  description: string;                // Description
  abbreviation: string;               // Code du programme
  field: 'Engineering'|'Medicine'|'Business'|'Law'|'Science'|'Arts'|'Other';
  level: 'Licence'|'Master'|'Doctorat'|'Diplôme';
  duration: number;                  // Durée en années (1-10)
  schools: ObjectId[];               // Écoles offrant ce programme
  tuitionFees?: number;              // Frais de scolarité
  admissionRequirements?: string;    // Conditions d'admission
  careerOutcomes?: string[];         // Débouchés professionnels
  language: string;                  // Langue d'enseignement
  startDate?: Date;                  // Date de démarrage
  isActive: boolean;                 // Soft-delete
  createdBy: ObjectId;               // Créé par (User ID)
  timestamps: Date;
}
```

### Endpoints

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/api/programs` | Public | Lister les programmes avec filtrage et pagination |
| GET | `/api/programs/:id` | Public | Récupérer les détails d'un programme |
| POST | `/api/programs` | admin, create:programs | Créer un programme |
| PUT | `/api/programs/:id` | admin, update:programs | Modifier un programme |
| DELETE | `/api/programs/:id` | admin, delete:programs | Supprimer un programme |

### Exemple: Créer un programme

```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Licence en Informatique",
    "description": "Programme de licence en sciences informatiques",
    "abbreviation": "LIC-INFO",
    "field": "Science",
    "level": "Licence",
    "duration": 3,
    "language": "French",
    "tuitionFees": 2500,
    "admissionRequirements": "Baccalauréat série S minimum",
    "careerOutcomes": ["Software Developer", "Data Analyst", "Systems Administrator"],
    "schools": ["650f1a2b3c4d5e6f7g8h9i0j"]
  }'
```

---

## 🔐 Contrôle d'accès

### Permissions par rôle

| Rôle | Schools | Programs | Détails |
|------|---------|----------|---------|
| **Admin** | CREATE, READ, UPDATE, DELETE | CREATE, READ, UPDATE, DELETE | Accès complet |
| **Counselor** | READ only | READ only | Consultation uniquement |
| **Student** | READ only | READ only | Consultation uniquement |
| **Parent** | READ only | READ only | Consultation uniquement |

### Exemple: Vérifier les permissions

```typescript
// Dans les routes
router.post(
  '/',
  protect,                              // Vérifier JWT
  hasPermission('schools', 'create'),  // Vérifier permission
  validateSchool,                       // Valider données
  SchoolController.createSchool
);
```

---

## ✅ Validation

### School Validation Rules

```typescript
- name: required, min 3 chars, unique
- description: required, min 10 chars
- abbreviation: required, 2-10 chars, unique, uppercase
- location: required, non-empty
- country: required, non-empty
- email: required, valid email format
- phone: required, non-empty
- schoolType: enum [Public, Private, International]
- studentCapacity: required, integer >= 1
- establishedYear: required, 1800-currentYear
- averageFees: optional, float >= 0
- admissionRate: optional, float 0-100
```

### Program Validation Rules

```typescript
- name: required, min 3 chars
- description: required, min 10 chars
- abbreviation: required, 2-10 chars, uppercase
- field: required, enum [Engineering, Medicine, Business, Law, Science, Arts, Other]
- level: required, enum [Licence, Master, Doctorat, Diplôme]
- duration: required, integer 1-10
- language: required, non-empty
- tuitionFees: optional, float >= 0
- schools: optional, array of valid ObjectIds
```

---

## 📊 Pagination & Filtrage

### Query Parameters

```typescript
// Tous les endpoints LIST supportent:
{
  skip?: number;        // Nombre d'enregistrements à sauter (défaut: 0)
  limit?: number;       // Nombre d'enregistrements par page (défaut: 10)
  sortBy?: string;      // Champ de tri (défaut: createdAt)
  sortOrder?: string;   // 'asc' ou 'desc' (défaut: desc)
  search?: string;      // Recherche texte (nom, description, etc.)
  country?: string;     // [Schools] Filtrer par pays
  schoolType?: string;  // [Schools] Filtrer par type
  field?: string;       // [Programs] Filtrer par domaine
  level?: string;       // [Programs] Filtrer par niveau
}
```

### Exemple d'utilisation

```bash
# Récupérer 20 écoles, page 1, triées par nom
curl "http://localhost:5000/api/schools?skip=0&limit=20&sortBy=name&sortOrder=asc"

# Filtrer les programmes d'ingénierie au niveau Master
curl "http://localhost:5000/api/programs?field=Engineering&level=Master"

# Rechercher et filtrer
curl "http://localhost:5000/api/schools?search=Dakar&country=Sénégal&skip=0&limit=10"
```

---

## 🔄 Relations Schools-Programs

### Ajouter un programme à une école

```bash
curl -X POST \
  http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0j/programs/650f1a2b3c4d5e6f7g8h9i0k \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Retirer un programme d'une école

```bash
curl -X DELETE \
  http://localhost:5000/api/schools/650f1a2b3c4d5e6f7g8h9i0j/programs/650f1a2b3c4d5e6f7g8h9i0k \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 🏗️ Architecture

### Flux de requête typique

```
Client Request
    ↓
Router (ex: schoolRoutes.ts)
    ↓
Validation Middleware (validateSchool)
    ↓
Auth Middleware (protect)
    ↓
Permission Middleware (hasPermission)
    ↓
Controller (SchoolController.createSchool)
    ↓
Service (si needed)
    ↓
Model (School.create / School.findById)
    ↓
MongoDB
    ↓
Response (JSON avec success/error)
```

### Couches de code

1. **Routes** (`src/routes/schoolRoutes.ts`)
   - Définit les endpoints
   - Applique middlewares dans l'ordre correct
   - Appelle les controllers

2. **Controllers** (`src/controllers/SchoolController.ts`)
   - Traite les requêtes HTTP
   - Orchestre la logique métier
   - Formate les réponses

3. **Models** (`src/models/School.ts`)
   - Définit le schéma MongoDB
   - Valide au niveau DB
   - Indices de performance

4. **Validators** (`src/validators/schoolValidator.ts`)
   - Valide les données client
   - Retourne les erreurs de validation

5. **Middlewares** (`src/middlewares/`)
   - `auth.ts` - Authentification JWT
   - `permissions.ts` - Contrôle d'accès
   - `errorHandler.ts` - Gestion des erreurs

---

## 🧪 Tests de base

### 1. Créer une école
```bash
# Admin login pour obtenir token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123!"
  }' | jq -r '.data.accessToken')

# Créer l'école
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test University",
    "description": "A test university for demonstration",
    "abbreviation": "TU",
    "location": "TestCity",
    "country": "TestCountry",
    "email": "contact@test.edu",
    "phone": "+123456789",
    "schoolType": "Private",
    "studentCapacity": 5000,
    "establishedYear": 2000
  }'
```

### 2. Lister les écoles
```bash
curl http://localhost:5000/api/schools
```

### 3. Obtenir détails d'une école
```bash
curl http://localhost:5000/api/schools/[SCHOOL_ID]
```

### 4. Mettre à jour l'école
```bash
curl -X PUT http://localhost:5000/api/schools/[SCHOOL_ID] \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentCapacity": 6000,
    "ranking": 95
  }'
```

### 5. Supprimer l'école
```bash
curl -X DELETE http://localhost:5000/api/schools/[SCHOOL_ID] \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Fichiers créés/modifiés

### Nouveaux fichiers
- `src/models/School.ts` - Modèle School
- `src/controllers/SchoolController.ts` - Contrôleur School
- `src/routes/schoolRoutes.ts` - Routes School
- `src/validators/schoolValidator.ts` - Validateurs School

### Fichiers modifiés
- `src/app.ts` - Intégration des routes schools
- `src/config/permissions.ts` - Permissions pour schools (existantes)

### Documents
- `PHASE3.md` - Cette documentation

---

## ✨ Points clés

✅ **School Model**
- Champs complets pour une école
- Indices MongoDB pour performance
- Relations avec Programs
- Soft-delete via `isActive`

✅ **SchoolController**
- 5 handlers CRUD + 2 pour programme management
- Gestion des erreurs avec AppError
- Logging détaillé
- Pagination et filtrage avancés
- Validation des doublons (name, abbreviation)

✅ **SchoolRoutes**
- GET public pour lister et détails
- POST/PUT/DELETE protégés avec permissions
- Validation de données
- Endpoints pour ajouter/retirer programmes

✅ **Validation**
- express-validator pour client-side
- Règles métier (abbreviation unique, year valid, etc.)
- Messages d'erreur clairs

✅ **Permission Control**
- Admin peut CRUD schools
- Autres rôles ont READ only
- Système granulaire (resource + action)

---

## 🎯 Prochaines étapes (Phase 4)

- Tests model & Results
- Subscription management
- Stripe payment integration
- Frontend implementation
- API documentation (Swagger)
- Comprehensive test suite

