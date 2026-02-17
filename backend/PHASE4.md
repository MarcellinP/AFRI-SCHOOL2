# PHASE 4 - ORIENTATION ENGINE

## Vue d'ensemble
Phase 4 implémente le moteur d'orientation pour AFRI-SCHOOL. Ce système permet aux étudiants de passer des tests d'aptitude et de recevoir des recommandations de programmes basées sur leurs performances dans différentes catégories.

## Architecture

### 1. Modèles de Données

#### Test Model (`src/models/Test.ts`)
Représente un test d'aptitude avec ses questions.

**Interfaces:**
- `IQuestion`: Question avec options, réponse correcte, catégorie, difficulté
- `ITest`: Test complet avec tableau de questions

**Caractéristiques:**
- Support de 3 types de tests: Aptitude, Subject, Career
- 8 sous-catégories: Verbal, Numerical, Logical, Spatial, Abstract, Science, Math, English
- 3 niveaux de difficulté: Easy, Medium, Hard
- Points flexibles par question
- Score de passage configurable

**Indices de base de données:**
- `category` - Filtre par type de test
- `difficulty` - Filtre par niveau
- `subcategories` - Recherche par domaine
- `isActive` - Filtrer les tests actifs
- `createdAt` - Tri temporel

---

#### Result Model (`src/models/Result.ts`)
Enregistre les résultats des tests et les recommandations.

**Interfaces:**
- `IStudentAnswer`: Réponse d'un étudiant à une question
- `ICategoryScore`: Score par catégorie avec pourcentage
- `IRecommendation`: Recommandation de programme avec score de correspondance
- `IResult`: Résultat complet avec scoring et recommandations

**Caractéristiques:**
- Suivi des tentatives multiples
- Scoring par catégorie (pas seulement le score total)
- Recommandations de top 3 programmes
- Mesure du temps passé
- Raison et strengths/weaknesses pour chaque recommandation

---

### 2. Services Métier

#### TestService (`src/services/TestService.ts`)
Gère la logique métier des tests.

**Méthodes principales:**

```typescript
// Liste les tests avec filtrage
async listTests(filters: {
  category?: string;
  difficulty?: string;
  subcategory?: string;
  skip?: number;
  limit?: number;
}): Promise<{tests, total, pages}>

// Récupère les détails d'un test
async getTestById(testId: string): Promise<ITest>

// Récupère questions SANS les réponses (pour les étudiants)
async getTestQuestions(testId: string): Promise<{test, questions}>

// Récupère test AVEC réponses correctes (admin/counselor)
async getTestWithAnswers(testId: string): Promise<ITest>

// CRUD complet
async createTest(testData: Partial<ITest>): Promise<ITest>
async updateTest(testId: string, updates: Partial<ITest>): Promise<ITest>
async deleteTest(testId: string): Promise<ITest>
```

---

#### ResultService (`src/services/ResultService.ts`)
Implémente le moteur de scoring et de recommandations.

**Méthodes principales:**

```typescript
// SCORING - Étape 1: Calcule les scores par catégorie
private async calculateCategoryScores(
  questions: IQuestion[],
  answers: IStudentAnswer[]
): Promise<ICategoryScore[]>
// Logique:
// 1. Groupe les questions par catégorie
// 2. Accumule score/maxScore par catégorie
// 3. Calcule pourcentage par catégorie
// 4. Trie par pourcentage DESCENDANT (meilleur d'abord)
// Retour: Catégories triées par performance

// SCORING - Étape 2: Évalue le test
async scoreResult(
  testId: string,
  answers: IStudentAnswer[],
  studentId: string,
  timeSpent: number
): Promise<IScoreData>
// Logique:
// 1. Valide que le test existe
// 2. Pour chaque réponse: vérifie correctOptionIndex
// 3. Appelle calculateCategoryScores
// 4. Calcule pourcentage global et pass/fail
// 5. Retourne scoreData complète

// RECOMMENDATIONS - Étape 3: Génère les recommandations
async generateRecommendations(
  categoryScores: ICategoryScore[],
  studentId: string
): Promise<IRecommendation[]>
// Logique:
// 1. Prend les 3 MEILLEURES catégories
// 2. Cherche Programmes avec tags correspondant
// 3. Pour chaque programme:
//    - matchScore = moyenne des % des catégories du programme
//    - Filtre si matchScore >= 60%
// 4. Trie par matchScore DESCENDANT
// 5. Retourne TOP 3 avec raison + strengths/weaknesses

// PERSISTENCE - Étape 4: Enregistre le résultat
async saveResult(
  testId: string,
  studentId: string,
  scoreData: IScoreData,
  startTime: Date,
  endTime: Date,
  timeSpent: number
): Promise<IResult>

// Accesseurs
async getStudentResults(
  studentId: string,
  skip?: number,
  limit?: number
): Promise<{results, total, pages}>

async getResultById(resultId: string): Promise<IResult>
async getRecommendations(resultId: string): Promise<IRecommendation[]>
async getStudentStatistics(studentId: string): Promise<IStatistics>
```

---

### 3. Contrôleurs HTTP

#### TestController (`src/controllers/TestController.ts`)
Expose la gestion des tests via HTTP.

**Endpoints:**

| Méthode | Route | Permission | Description |
|---------|-------|-----------|-------------|
| GET | `/api/tests` | Student+ | Liste les tests |
| GET | `/api/tests/:id` | Student+ | Détails du test |
| GET | `/api/tests/:id/questions` | Student+ | Questions du test (sans réponses) |
| POST | `/api/tests` | Admin | Crée un test |
| PUT | `/api/tests/:id` | Admin | Modifie un test |
| DELETE | `/api/tests/:id` | Admin | Supprime un test |
| GET | `/api/tests/stats/overview` | Admin | Statistiques des tests |

---

#### ResultController (`src/controllers/ResultController.ts`)
Expose la soumission et la consultation des résultats.

**Endpoints:**

| Méthode | Route | Permission | Description |
|---------|-------|-----------|-------------|
| POST | `/api/results/submit` | Student+ | Soumet les réponses du test |
| GET | `/api/results` | Student+ | Mes résultats |
| GET | `/api/results/:id` | Student+ | Détails d'un résultat |
| GET | `/api/results/:id/recommendations` | Student+ | Recommandations |
| GET | `/api/results/:id/analysis` | Student+ | Analyse détaillée |
| GET | `/api/results/stats/me` | Student+ | Mes statistiques |
| GET | `/api/results/admin/all` | Admin/Counselor | Tous les résultats |

---

### 4. Validateurs

#### testValidator (`src/validators/testValidator.ts`)
Valide les requêtes de création/modification de tests.

**Règles:**
- Titre: 3-100 caractères
- Description: max 500 caractères
- Catégorie: Aptitude, Subject, Career
- Sous-catégories: Array de 1+ valide
- Difficulté: Easy, Medium, Hard
- Durée: 1-480 minutes
- Points: 1-1000 max total
- Questions: min 1
  - Texte requis
  - Type: MultipleChoice, TrueFalse
  - Catégorie requise
  - Points: 1-100
  - Options: min 2
  - Réponse correcte: index valide

---

#### resultValidator (`src/validators/resultValidator.ts`)
Valide les soumissions de tests.

**Règles:**
- testId: ID MongoDB valide
- answers: Array de 1+
  - questionId: ID MongoDB valide
  - selectedOptionIndex: 0-3
- startTime: ISO 8601 valide
- endTime: ISO 8601 valide et après startTime

---

## Flux de Soumission de Test

```
1. Étudiant récupère questions
   GET /api/tests/:id/questions

2. Étudiant remplit le test

3. Étudiant soumet les réponses
   POST /api/results/submit
   Body: {
     testId,
     answers: [{questionId, selectedOptionIndex}, ...],
     startTime,
     endTime
   }

4. Serveur traite:
   a. Valide le test existe
   b. Score chaque réponse (correcte/incorrecte)
   c. Groupe par catégorie (calculateCategoryScores)
   d. Trie catégories par performance
   e. Sélectionne top 3 catégories
   f. Cherche programmes correspondant (generateRecommendations)
   g. Calcule match score pour chaque programme
   h. Retourne top 3 recommandations

5. Résultat enregistré en base de données

6. Réponse avec:
   - totalScore, percentage, status (pass/fail)
   - categoryScores triés par performance
   - Recommandations top 3 avec:
     - programId, programName
     - matchScore (0-100%)
     - reason
     - strengths (catégories > 75%)
     - weaknesses (catégories < 50%)
```

---

## Algorithme de Recommandation

### Étape 1: Évaluation des Catégories

```
Pour chaque catégorie du test:
  score = (points correctes / points max) * 100
  
Trier: categorie.percentage DESC
```

**Exemple:**
```
Verbal: 85%
Logical: 72%
Numerical: 65%
Spatial: 45%
```

---

### Étape 2: Sélection des Top 3 Catégories

Prendre les 3 meilleures catégories:
```
Top 3:
1. Verbal: 85%
2. Logical: 72%
3. Numerical: 65%
```

---

### Étape 3: Correspondance avec Programmes

Pour chaque programme en base:
```
Si programme.categories contient au moins 1 de [Verbal, Logical, Numerical]:
  
  matchScore = moyenne des pourcentages des catégories du programme
  
  Exemple Program 1 (Verbal + Logical):
    matchScore = (85 + 72) / 2 = 78.5%
    
  Exemple Program 2 (Verbal + Numerical + Logical):
    matchScore = (85 + 65 + 72) / 3 = 74%
    
  Exemple Program 3 (Spatial):
    matchScore = 45%
    Exclu car < 60%
```

---

### Étape 4: Retour des Top 3 Recommandations

```
Trier par matchScore DESC
Retourner les 3 premiers:

1. Program: "Software Engineering"
   matchScore: 78.5%
   reason: "Excellent match with top strengths"
   strengths: ["Verbal: 85%", "Logical: 72%"]
   
2. Program: "Data Science"
   matchScore: 74%
   reason: "Good match across multiple areas"
   strengths: ["Verbal: 85%", "Numerical: 65%"]
   
3. Program: "Business Management"
   matchScore: 71%
   reason: "Solid match with verbal skills"
   strengths: ["Verbal: 85%"]
```

---

## Format des Réponses

### Soumission de Test - 201 Created

```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "result": {
      "_id": "507f1f77bcf86cd799439011",
      "testId": "507f1f77bcf86cd799439012",
      "totalScore": 78,
      "maxScore": 100,
      "percentage": 78,
      "status": "pass",
      "categoryScores": [
        {
          "category": "Verbal",
          "score": 42,
          "maxScore": 50,
          "percentage": 84
        },
        {
          "category": "Logical",
          "score": 36,
          "maxScore": 50,
          "percentage": 72
        }
      ],
      "recommendations": [
        {
          "programId": "507f1f77bcf86cd799439013",
          "programName": "Software Engineering",
          "matchScore": 78.5,
          "reason": "Excellent match with logical reasoning skills",
          "strengths": ["Verbal: 84%", "Logical: 72%"],
          "weaknesses": []
        }
      ],
      "timeSpent": 1200,
      "attemptNumber": 1
    }
  }
}
```

---

### Récupération de Résultats - 200 OK

```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "testId": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Aptitude Test 2024"
        },
        "percentage": 78,
        "status": "pass",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "skip": 0,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

## Fichiers Créés

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `src/models/Test.ts` | 185 | Schéma de test avec questions |
| `src/models/Result.ts` | 200+ | Schéma de résultat et recommandations |
| `src/services/TestService.ts` | 250+ | Logique métier des tests |
| `src/services/ResultService.ts` | 350+ | Moteur de scoring et recommandations |
| `src/controllers/TestController.ts` | 150+ | Endpoints HTTP pour tests |
| `src/controllers/ResultController.ts` | 200+ | Endpoints HTTP pour résultats |
| `src/validators/testValidator.ts` | 130+ | Validation des tests |
| `src/validators/resultValidator.ts` | 80+ | Validation des résultats |
| `src/routes/testRoutes.ts` | 90+ | Routes des tests |
| `src/routes/resultRoutes.ts` | 80+ | Routes des résultats |

**Total: 10 fichiers, ~1,700 lignes de code**

---

## Intégration

Les routes sont montées dans `src/app.ts`:

```typescript
import testRoutes from './routes/testRoutes';
import resultRoutes from './routes/resultRoutes';

// ...
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
```

---

## Permissions et Rôles

| Rôle | Tests | Résultats |
|------|-------|-----------|
| Student | Lecture + Soumission | Lecture propres résultats |
| Counselor | Lecture | Lecture tous résultats |
| Admin | CRUD | CRUD + Statistiques |

---

## Prochaines Étapes

1. **Phase 4B - API Documentation**
   - Swagger/OpenAPI pour Phase 4
   - Exemples complets

2. **Phase 5 - Frontend Integration**
   - Interface de prise de test
   - Dashboard de résultats
   - Visualisation des recommandations

3. **Phase 6 - Subscriptions**
   - Plans d'abonnement
   - Limitation d'accès aux tests

4. **Phase 7 - Paiements**
   - Intégration Stripe/PayPal
   - Gestion des transactions

---

## Développement et Test

Les fichiers sont production-ready avec:
- ✅ TypeScript strict
- ✅ Gestion d'erreurs complète
- ✅ Validation d'entrées
- ✅ Logging détaillé
- ✅ Permissions par rôle
- ✅ Indices de base de données
- ✅ Patterns établis des Phases 1-3
