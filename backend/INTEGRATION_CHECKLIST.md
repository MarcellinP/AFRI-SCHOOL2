# ✅ PHASE 3 - INTEGRATION CHECKLIST

## 1️⃣ Vérifier les fichiers créés

```bash
# Vérifier les modèles
ls -la src/models/
# Doit contenir: User.ts, Role.ts, Program.ts, School.ts ✅

# Vérifier les contrôleurs
ls -la src/controllers/
# Doit contenir: AuthController.ts, ProgramController.ts, SchoolController.ts ✅

# Vérifier les routes
ls -la src/routes/
# Doit contenir: authRoutes.ts, programRoutes.ts, schoolRoutes.ts, adminRoutes.ts ✅

# Vérifier les validateurs
ls -la src/validators/
# Doit contenir: schoolValidator.ts, (programValidator.ts si besoin)
```

---

## 2️⃣ Vérifier app.ts intégration

```typescript
// app.ts doit importer schoolRoutes
import schoolRoutes from './routes/schoolRoutes';

// app.ts doit monter la route
app.use('/api/schools', schoolRoutes);
```

**Vérification du fichier:**
```bash
grep -n "schoolRoutes" src/app.ts
# Doit retourner 2 lignes: import et use()
```

---

## 3️⃣ Vérifier permissions.ts

```typescript
// PERMISSIONS doit contenir schools
SCHOOL_CREATE: { resource: 'schools', action: 'create', name: 'Create Schools' },
SCHOOL_READ: { resource: 'schools', action: 'read', name: 'Read Schools' },
SCHOOL_UPDATE: { resource: 'schools', action: 'update', name: 'Update Schools' },
SCHOOL_DELETE: { resource: 'schools', action: 'delete', name: 'Delete Schools' },
```

**Vérification:**
```bash
grep -n "SCHOOL_" src/config/permissions.ts
# Doit retourner 4 lignes
```

---

## 4️⃣ Compiler TypeScript

```bash
# Depuis le répertoire backend
npm run build

# Ou vérifier les erreurs TS
npx tsc --noEmit
```

**Doit compiler sans erreurs**

---

## 5️⃣ Démarrer le serveur

```bash
# Terminal 1: Démarrer Redis (si local)
redis-server

# Terminal 2: Démarrer MongoDB (si local)
mongod

# Terminal 3: Démarrer le backend
npm run dev

# Doit afficher:
# ╔═══════════════════════════════════════╗
# ║   AFRI-SCHOOL SERVER STARTED          ║
# ╚═══════════════════════════════════════╝
# ✓ Connected to MongoDB
# ✓ Connected to Redis
# ✓ Roles seeded successfully
```

---

## 6️⃣ Tester les endpoints

### Test 1: Health Check
```bash
curl http://localhost:5000/health
# Réponse attendue:
# {
#   "status": "OK",
#   "message": "Server is running"
# }
```

### Test 2: Authentification
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123!"
  }' | jq '.data.accessToken'

# Sauvegarder le token
export TOKEN="<the_token_value>"
```

### Test 3: List Schools (Public)
```bash
curl http://localhost:5000/api/schools | jq '.success'
# Réponse: true
```

### Test 4: Create School (Admin)
```bash
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "description": "A test school for verification",
    "abbreviation": "TS001",
    "location": "TestCity",
    "country": "TestCountry",
    "email": "contact@test.edu",
    "phone": "+1234567890",
    "schoolType": "Private",
    "studentCapacity": 1000,
    "establishedYear": 2020
  }' | jq '.success'
# Réponse: true
```

### Test 5: Get School Detail
```bash
# Récupérer l'ID de l'école créée
SCHOOL_ID=$(curl -s http://localhost:5000/api/schools | jq -r '.data.schools[0]._id')

# Récupérer les détails
curl http://localhost:5000/api/schools/$SCHOOL_ID | jq '.data.school.name'
# Réponse: "Test School"
```

### Test 6: Update School (Admin)
```bash
curl -X PUT http://localhost:5000/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentCapacity": 2000}' | jq '.success'
# Réponse: true
```

### Test 7: List Programs (Public)
```bash
curl http://localhost:5000/api/programs | jq '.success'
# Réponse: true
```

### Test 8: Create Program (Admin)
```bash
curl -X POST http://localhost:5000/api/programs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Program",
    "description": "A test program for verification",
    "abbreviation": "TP001",
    "field": "Science",
    "level": "Licence",
    "duration": 3,
    "language": "French"
  }' | jq '.success'
# Réponse: true
```

### Test 9: Add Program to School
```bash
# Récupérer l'ID du programme créé
PROGRAM_ID=$(curl -s http://localhost:5000/api/programs | jq -r '.data.programs[0]._id')

# Ajouter à l'école
curl -X POST \
  "http://localhost:5000/api/schools/$SCHOOL_ID/programs/$PROGRAM_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.success'
# Réponse: true
```

### Test 10: Permission Check (Non-Admin should fail)
```bash
# Créer un student/counselor pour tester
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser@afri-school.com",
    "password": "TestPassword123!",
    "role": "student"
  }' | jq -r '.data.accessToken' > /tmp/student_token.txt

STUDENT_TOKEN=$(cat /tmp/student_token.txt)

# Essayer créer une école (devrait échouer 403)
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unauthorized School",
    "description": "This should fail",
    "abbreviation": "UNAUTH",
    "location": "Nowhere",
    "country": "Nowhere",
    "email": "none@none.com",
    "phone": "0000000000",
    "schoolType": "Private",
    "studentCapacity": 100,
    "establishedYear": 2020
  }' | jq '.error'
# Réponse: "You don't have permission to perform this action"
```

---

## 7️⃣ Vérifier la base de données

```bash
# Connecter à MongoDB
mongosh

# Vérifier la base afri-school
use afri-school

# Vérifier collections
show collections
# Doit contenir: users, roles, programs, schools

# Vérifier écoles
db.schools.find().pretty()

# Vérifier programmes
db.programs.find().pretty()

# Vérifier index de performance
db.schools.getIndexes()
```

---

## 8️⃣ Vérifier les logs

```bash
# Les logs doivent afficher:
# ✓ School created: Test School by admin@afri-school.com
# ✓ Program created: Test Program by admin@afri-school.com
# ✓ Program added to school Test School by admin@afri-school.com
```

---

## 9️⃣ Test de validation

### Test données invalides
```bash
# Email invalide
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid School",
    "description": "Test",
    "abbreviation": "IS",
    "location": "City",
    "country": "Country",
    "email": "invalid-email",
    "phone": "123",
    "schoolType": "Private",
    "studentCapacity": 1000,
    "establishedYear": 2020
  }' | jq '.errors[0]'
# Doit retourner erreur d'email

# Nom trop court
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AB",
    ...
  }' | jq '.errors[0]'
# Doit retourner erreur de longueur

# Duplication
curl -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",  # Déjà existant
    ...
  }' | jq '.error'
# Doit retourner: "School name already exists"
```

---

## 🔟 Test de filtrage et pagination

```bash
# Créer plusieurs écoles
for i in {1..15}; do
  curl -X POST http://localhost:5000/api/schools \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"School $i\",
      \"description\": \"Description $i\",
      \"abbreviation\": \"SCH$i\",
      \"location\": \"City $((i % 3))\",
      \"country\": \"Country $((i % 2))\",
      \"email\": \"school$i@test.com\",
      \"phone\": \"+123456789\",
      \"schoolType\": \"$([ $((i % 2)) -eq 0 ] && echo 'Public' || echo 'Private')\",
      \"studentCapacity\": $((1000 * i)),
      \"establishedYear\": $((2000 + i))
    }" 2>/dev/null
done

# Tester pagination
curl "http://localhost:5000/api/schools?skip=0&limit=5" | jq '.data.pagination'
# Réponse: { "total": 15, "skip": 0, "limit": 5, "pages": 3 }

# Tester filtrage par pays
curl "http://localhost:5000/api/schools?country=Country%200" | jq '.data.schools | length'
# Doit retourner environ 8

# Tester tri
curl "http://localhost:5000/api/schools?sortBy=name&sortOrder=asc" | jq '.data.schools[0].name'
# Doit être le premier alphabétiquement

# Tester recherche
curl "http://localhost:5000/api/schools?search=City%201" | jq '.data.schools | length'
# Doit retourner les écoles avec "City 1" dans la description/location
```

---

## 1️⃣1️⃣ Vérifier les réponses JSON

### Format de réponse réussie
```json
{
  "success": true,
  "message": "...",
  "data": {
    "school/program/...": {...}
  }
}
```

### Format de réponse list
```json
{
  "success": true,
  "message": "...",
  "data": {
    "schools/programs": [...],
    "pagination": {
      "total": number,
      "skip": number,
      "limit": number,
      "pages": number
    }
  }
}
```

### Format d'erreur
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 1️⃣2️⃣ Test de fermeture gracieuse

```bash
# Arrêter le serveur
Ctrl+C

# Doit afficher:
# 🛑 Shutting down gracefully...
# ✓ Server closed
# ✓ Database connection closed
# ✓ Redis connection closed
```

---

## 📋 Checklist final

- [ ] Tous les fichiers créés avec succès
- [ ] TypeScript compile sans erreurs
- [ ] Serveur démarre sans erreurs
- [ ] Health check fonctionne
- [ ] Authentification fonctionne
- [ ] Schools CRUD fonctionne
- [ ] Programs CRUD fonctionne
- [ ] Permissions sont appliquées (403 pour non-admin)
- [ ] Validation fonctionne (422 pour données invalides)
- [ ] Pagination fonctionne
- [ ] Filtrage fonctionne
- [ ] Tri fonctionne
- [ ] Recherche fonctionne
- [ ] Relations School-Program fonctionne
- [ ] Logs affichent les opérations importantes
- [ ] Réponses JSON sont au bon format

---

## 🐛 Troubleshooting

### Erreur: "Cannot find module 'schoolRoutes'"
**Solution**: Vérifier que le fichier existe et l'import est correct dans app.ts

### Erreur: "Permission denied" (403)
**Solution**: S'assurer d'utiliser un token admin avec les permissions appropriées

### Erreur: "Validation failed" (422)
**Solution**: Vérifier les données envoyées contre les règles de validation documentées

### Erreur: "School not found"
**Solution**: Vérifier que l'ID est correct et l'école n'a pas été supprimée

### MongoDB connection error
**Solution**: Vérifier que MongoDB est en cours d'exécution et accessible

### Redis connection error
**Solution**: Vérifier que Redis est en cours d'exécution et accessible

---

## 📊 Performance Checks

```bash
# Vérifier les indices DB
db.schools.getIndexes()
# Doit avoir indices sur: name, country, location, isActive, createdAt

# Vérifier les indices Programs
db.programs.getIndexes()
# Doit avoir indices sur: name, field, level, isActive, createdAt
```

---

## 📝 Next Steps After Phase 3

1. **Phase 4 - Tests Module**
   - Créer Test model
   - Créer Result model
   - Implémenter test CRUD
   - Implémenter result scoring

2. **Documentation**
   - Créer Swagger/OpenAPI spec
   - Créer Database schema diagram
   - Créer Architecture diagram

3. **Testing**
   - Écrire unit tests
   - Écrire integration tests
   - Setup test coverage

4. **Deployment**
   - Setup CI/CD
   - Docker containerization
   - Production environment

---

**✅ Phase 3 Integration Complete!**

