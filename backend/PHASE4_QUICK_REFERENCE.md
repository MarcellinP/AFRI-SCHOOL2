# PHASE 4 - QUICK REFERENCE

## 🚀 API Endpoints

### Tests

```bash
# Lister les tests
GET /api/tests

# Récupérer un test
GET /api/tests/:id

# Récupérer les questions (pour répondre)
GET /api/tests/:id/questions

# Créer un test [ADMIN]
POST /api/tests

# Modifier un test [ADMIN]
PUT /api/tests/:id

# Supprimer un test [ADMIN]
DELETE /api/tests/:id

# Statistiques [ADMIN]
GET /api/tests/stats/overview
```

### Résultats

```bash
# Soumettre un test
POST /api/results/submit

# Mes résultats
GET /api/results

# Détails d'un résultat
GET /api/results/:id

# Recommandations d'un résultat
GET /api/results/:id/recommendations

# Analyse détaillée
GET /api/results/:id/analysis

# Mes statistiques
GET /api/results/stats/me

# Tous les résultats [ADMIN/COUNSELOR]
GET /api/results/admin/all
```

---

## 📝 Formats de Requête

### Créer un Test

```json
{
  "title": "Test Title",
  "description": "Description",
  "category": "Aptitude|Subject|Career",
  "subcategories": ["Verbal", "Logical", "Numerical"],
  "difficulty": "Easy|Medium|Hard",
  "duration": 60,
  "totalPoints": 100,
  "passingScore": 60,
  "questions": [
    {
      "text": "Question text?",
      "type": "MultipleChoice|TrueFalse",
      "category": "Verbal",
      "difficulty": "Easy|Medium|Hard",
      "points": 5,
      "options": ["Option 1", "Option 2", "Option 3"],
      "correctOptionIndex": 1
    }
  ]
}
```

### Soumettre un Test

```json
{
  "testId": "507f1f77bcf86cd799439011",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T11:30:00Z",
  "answers": [
    {
      "questionId": "q1",
      "selectedOptionIndex": 1
    },
    {
      "questionId": "q2",
      "selectedOptionIndex": 0
    }
  ]
}
```

---

## 📊 Réponse Standard (Soumission)

```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "result": {
      "_id": "result_id",
      "testId": "test_id",
      "totalScore": 82,
      "percentage": 82,
      "status": "pass|fail",
      "categoryScores": [
        {
          "category": "Verbal",
          "score": 25,
          "maxScore": 30,
          "percentage": 83
        }
      ],
      "recommendations": [
        {
          "programId": "prog_id",
          "programName": "Software Engineering",
          "matchScore": 87.7,
          "reason": "Explanation",
          "strengths": ["Verbal: 83%"],
          "weaknesses": []
        }
      ]
    }
  }
}
```

---

## 🔐 Permissions

| Endpoint | Student | Counselor | Admin |
|----------|---------|-----------|-------|
| GET /api/tests | ✅ | ✅ | ✅ |
| GET /api/tests/:id | ✅ | ✅ | ✅ |
| GET /api/tests/:id/questions | ✅ | ✅ | ✅ |
| POST /api/tests | ❌ | ❌ | ✅ |
| PUT /api/tests/:id | ❌ | ❌ | ✅ |
| DELETE /api/tests/:id | ❌ | ❌ | ✅ |
| POST /api/results/submit | ✅ | ✅ | ✅ |
| GET /api/results | ✅ | ✅ | ✅ |
| GET /api/results/:id | ✅* | ✅ | ✅ |
| GET /api/results/admin/all | ❌ | ✅ | ✅ |

*Student: Own results only

---

## 🔍 Filtres et Pagination

### Lister Résultats

```
GET /api/results?skip=0&limit=10
GET /api/results/admin/all?studentId=xyz&status=pass&skip=0&limit=20
```

### Lister Tests

```
GET /api/tests?category=Aptitude&difficulty=Medium&subcategory=Verbal&skip=0&limit=10
```

---

## ⚠️ Codes d'Erreur

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Input validation failed |
| 401 | Unauthorized | Token missing/invalid |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Unexpected error |

---

## 📋 Catégories Supportées

### Types de Tests
- `Aptitude` - Tests d'aptitude générale
- `Subject` - Tests spécifiques au sujet
- `Career` - Tests d'orientation carrière

### Sous-Catégories
- `Verbal` - Compréhension verbale
- `Numerical` - Aptitude numérique
- `Logical` - Raisonnement logique
- `Spatial` - Visualisation spatiale
- `Abstract` - Pensée abstraite
- `Science` - Connaissances scientifiques
- `Math` - Mathématiques
- `English` - Anglais
- `French` - Français
- `Arabic` - Arabe
- `Interests` - Intérêts professionnels
- `Strengths` - Points forts

### Difficultés
- `Easy` - Facile
- `Medium` - Moyen
- `Hard` - Difficile

---

## 🔄 Algorithme Recommandation (Résumé)

```
1. Score chaque réponse (correct/incorrect)
2. Groupe par catégorie et calcule pourcentage
3. Trie catégories par performance (DESC)
4. Prend top 3 catégories
5. Cherche programmes correspondant
6. Calcule matchScore = moyenne des % correspondantes
7. Retourne top 3 programmes (score >= 60%)
```

---

## 📊 Statistiques Disponibles

### Étudiant - `GET /api/results/stats/me`

```json
{
  "totalTests": 5,
  "averageScore": 76.2,
  "passingRate": 83.3,
  "bestScore": 87,
  "worstScore": 54,
  "categoryPerformance": {
    "Verbal": {"attempts": 5, "average": 78},
    "Logical": {"attempts": 5, "average": 76}
  }
}
```

---

## 🛠️ Développement

### Ajout d'une Nouvelle Catégorie

1. Modifier `ITest` dans [Result.ts](../src/models/Result.ts#L50)
2. Ajouter à liste validateur dans [testValidator.ts](../src/validators/testValidator.ts#L45)
3. Logique matching dans [ResultService.ts](../src/services/ResultService.ts#L200)

### Modification de l'Algorithme

- Logique principale: [ResultService.generateRecommendations](../src/services/ResultService.ts#L150)
- Calcul catégories: [ResultService.calculateCategoryScores](../src/services/ResultService.ts#L80)

---

## 📦 Import Exemples

```typescript
// Models
import { Test } from '../models/Test';
import { Result } from '../models/Result';

// Services
import { TestService } from '../services/TestService';
import { ResultService } from '../services/ResultService';

// Controllers
import { TestController } from '../controllers/TestController';
import { ResultController } from '../controllers/ResultController';

// Routes
import testRoutes from '../routes/testRoutes';
import resultRoutes from '../routes/resultRoutes';
```

---

## 🧪 Testing (À Faire)

### Test Création

```typescript
describe('Test Creation', () => {
  it('should create test with valid data', async () => {
    const result = await TestService.createTest({
      title: 'Test',
      category: 'Aptitude',
      // ...
    });
    expect(result).toBeDefined();
  });
});
```

### Test Soumission

```typescript
describe('Test Submission', () => {
  it('should score test correctly', async () => {
    const result = await ResultService.scoreResult(testId, answers, studentId);
    expect(result.percentage).toBeDefined();
    expect(result.categoryScores).toHaveLength(4);
  });
});
```

### Recommandations

```typescript
describe('Recommendations', () => {
  it('should return top 3 programs', async () => {
    const recommendations = await ResultService.generateRecommendations(
      categoryScores,
      studentId
    );
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });
});
```

---

## 📚 Fichiers Clés

| Fichier | Ligne | Fonction Clé |
|---------|-------|-------------|
| [ResultService.ts](../src/services/ResultService.ts) | 80 | `calculateCategoryScores()` |
| [ResultService.ts](../src/services/ResultService.ts) | 150 | `generateRecommendations()` |
| [TestService.ts](../src/services/TestService.ts) | 1 | Gestion tests |
| [ResultController.ts](../src/controllers/ResultController.ts) | 30 | `submitTest()` |
| [testValidator.ts](../src/validators/testValidator.ts) | 1 | Validation |

---

## 🔗 Liens Internes

- [Documentation Complète](./PHASE4.md)
- [Exemples Détaillés](./EXAMPLES_PHASE4.md)
- [Rapport Complétion](./PHASE4_COMPLETION_REPORT.md)

---

## ⏱️ Time Complexity

| Opération | Complexity | Notes |
|-----------|-----------|-------|
| Créer test | O(n) | n = nombre questions |
| Scorer test | O(n) | Scoring + categorisation |
| Générer recommandations | O(n*m) | n=catégories, m=programmes |
| Lister résultats | O(p) | p = pagination |

---

## 💾 Database Queries

```javascript
// Trouver programmes par catégories
db.programs.find({ 
  categories: { $in: ["Verbal", "Logical"] } 
})

// Résultats par étudiant
db.results.find({ studentId: id }).sort({ createdAt: -1 })

// Statistiques
db.results.aggregate([
  { $match: { studentId: id } },
  { $group: { _id: null, avg: { $avg: "$percentage" } } }
])
```

---

**Dernière mise à jour**: Phase 4 Completion
**Version**: 1.0
**Prêt pour**: Testing & Deployment
