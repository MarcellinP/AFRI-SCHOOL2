# PHASE 4 - EXEMPLES PRATIQUES

## Table des Matières
1. [Création de Tests](#création-de-tests)
2. [Soumission de Tests](#soumission-de-tests)
3. [Récupération des Résultats](#récupération-des-résultats)
4. [Analyse et Recommandations](#analyse-et-recommandations)

---

## Création de Tests

### Exemple 1: Test d'Aptitude Général

**Requête:**
```bash
POST /api/tests
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Aptitude Test 2024 - General",
  "description": "Comprehensive aptitude test covering verbal, logical, and numerical reasoning",
  "category": "Aptitude",
  "subcategories": ["Verbal", "Logical", "Numerical"],
  "difficulty": "Medium",
  "duration": 60,
  "totalPoints": 100,
  "passingScore": 60,
  "questions": [
    {
      "text": "Which word is most similar in meaning to 'Eloquent'?",
      "type": "MultipleChoice",
      "category": "Verbal",
      "difficulty": "Medium",
      "points": 5,
      "options": [
        "Silent and reserved",
        "Fluent and persuasive",
        "Quick and sharp",
        "Loud and aggressive"
      ],
      "correctOptionIndex": 1
    },
    {
      "text": "If all roses are flowers and all flowers are plants, then all roses are plants",
      "type": "TrueFalse",
      "category": "Logical",
      "difficulty": "Easy",
      "points": 5,
      "options": ["True", "False"],
      "correctOptionIndex": 0
    },
    {
      "text": "What is 15% of 240?",
      "type": "MultipleChoice",
      "category": "Numerical",
      "difficulty": "Easy",
      "points": 5,
      "options": ["24", "30", "36", "40"],
      "correctOptionIndex": 2
    },
    {
      "text": "A train travels 120 km in 2 hours. What is its speed?",
      "type": "MultipleChoice",
      "category": "Numerical",
      "difficulty": "Medium",
      "points": 10,
      "options": ["60 km/h", "90 km/h", "120 km/h", "150 km/h"],
      "correctOptionIndex": 0
    },
    {
      "text": "Logic: If A > B and B > C, then A > C",
      "type": "TrueFalse",
      "category": "Logical",
      "difficulty": "Medium",
      "points": 10,
      "options": ["True", "False"],
      "correctOptionIndex": 0
    },
    {
      "text": "Complete the analogy: Bird is to Air as Fish is to ___",
      "type": "MultipleChoice",
      "category": "Verbal",
      "difficulty": "Hard",
      "points": 10,
      "options": ["Sky", "Water", "Wave", "Ocean"],
      "correctOptionIndex": 1
    },
    {
      "text": "Spatial: Which shape has 4 sides and all sides are equal?",
      "type": "MultipleChoice",
      "category": "Spatial",
      "difficulty": "Easy",
      "points": 5,
      "options": ["Rectangle", "Square", "Triangle", "Circle"],
      "correctOptionIndex": 1
    },
    {
      "text": "Series: 2, 4, 8, 16, __?",
      "type": "MultipleChoice",
      "category": "Numerical",
      "difficulty": "Medium",
      "points": 10,
      "options": ["24", "32", "48", "64"],
      "correctOptionIndex": 1
    },
    {
      "text": "The sun rises in the east",
      "type": "TrueFalse",
      "category": "Verbal",
      "difficulty": "Easy",
      "points": 5,
      "options": ["True", "False"],
      "correctOptionIndex": 0
    },
    {
      "text": "If x + 5 = 12, then x = ?",
      "type": "MultipleChoice",
      "category": "Numerical",
      "difficulty": "Easy",
      "points": 5,
      "options": ["5", "7", "10", "15"],
      "correctOptionIndex": 1
    },
    {
      "text": "Patterns: If red = 3, blue = 4, then yellow = ?",
      "type": "MultipleChoice",
      "category": "Logical",
      "difficulty": "Hard",
      "points": 15,
      "options": ["5", "6", "7", "8"],
      "correctOptionIndex": 2
    },
    {
      "text": "Deduction: All cats are animals; Fluffy is a cat; Therefore, Fluffy is an animal",
      "type": "TrueFalse",
      "category": "Logical",
      "difficulty": "Medium",
      "points": 10,
      "options": ["True", "False"],
      "correctOptionIndex": 0
    }
  ]
}
```

**Réponse:** 201 Created
```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {
    "test": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Aptitude Test 2024 - General",
      "category": "Aptitude",
      "subcategories": ["Verbal", "Logical", "Numerical", "Spatial"],
      "totalPoints": 100,
      "difficulty": "Medium",
      "duration": 60,
      "passingScore": 60,
      "questionsCount": 12,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### Exemple 2: Test Spécialisé - Mathématiques

**Requête:**
```bash
POST /api/tests
Authorization: Bearer {admin_token}

{
  "title": "Mathematics Specialization Test",
  "description": "Test focused on mathematics for Science and Engineering programs",
  "category": "Subject",
  "subcategories": ["Math", "Logical"],
  "difficulty": "Hard",
  "duration": 90,
  "totalPoints": 150,
  "passingScore": 75,
  "questions": [
    {
      "text": "Solve: x² - 5x + 6 = 0",
      "type": "MultipleChoice",
      "category": "Math",
      "difficulty": "Hard",
      "points": 15,
      "options": ["x = 2, 3", "x = 1, 6", "x = 2, 4", "x = 3, 5"],
      "correctOptionIndex": 0
    },
    {
      "text": "Find the derivative of f(x) = 3x² + 2x",
      "type": "MultipleChoice",
      "category": "Math",
      "difficulty": "Hard",
      "points": 20,
      "options": ["6x + 2", "3x + 2", "6x", "x + 2"],
      "correctOptionIndex": 0
    },
    {
      "text": "What is the limit of (x²-1)/(x-1) as x approaches 1?",
      "type": "MultipleChoice",
      "category": "Math",
      "difficulty": "Hard",
      "points": 20,
      "options": ["0", "1", "2", "Undefined"],
      "correctOptionIndex": 2
    }
  ]
}
```

---

## Soumission de Tests

### Exemple 1: Étudiant Soumet un Test

**Récupération des questions:**
```bash
GET /api/tests/507f1f77bcf86cd799439011/questions
Authorization: Bearer {student_token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Test questions retrieved successfully",
  "data": {
    "test": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Aptitude Test 2024 - General",
      "duration": 60,
      "totalPoints": 100
    },
    "questions": [
      {
        "_id": "q1",
        "text": "Which word is most similar in meaning to 'Eloquent'?",
        "type": "MultipleChoice",
        "category": "Verbal",
        "difficulty": "Medium",
        "options": [
          "Silent and reserved",
          "Fluent and persuasive",
          "Quick and sharp",
          "Loud and aggressive"
        ]
        // NOTE: Pas de correctOptionIndex (question sécurisée)
      },
      {
        "_id": "q2",
        "text": "If all roses are flowers and all flowers are plants...",
        "type": "TrueFalse",
        "category": "Logical",
        "difficulty": "Easy",
        "options": ["True", "False"]
      }
      // ... autres questions
    ]
  }
}
```

---

**Soumission des réponses:**
```bash
POST /api/results/submit
Authorization: Bearer {student_token}
Content-Type: application/json

{
  "testId": "507f1f77bcf86cd799439011",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T11:25:00Z",
  "answers": [
    {
      "questionId": "q1",
      "selectedOptionIndex": 1
    },
    {
      "questionId": "q2",
      "selectedOptionIndex": 0
    },
    {
      "questionId": "q3",
      "selectedOptionIndex": 2
    },
    {
      "questionId": "q4",
      "selectedOptionIndex": 0
    },
    {
      "questionId": "q5",
      "selectedOptionIndex": 0
    },
    {
      "questionId": "q6",
      "selectedOptionIndex": 1
    },
    {
      "questionId": "q7",
      "selectedOptionIndex": 1
    },
    {
      "questionId": "q8",
      "selectedOptionIndex": 1
    },
    {
      "questionId": "q9",
      "selectedOptionIndex": 0
    },
    {
      "questionId": "q10",
      "selectedOptionIndex": 1
    },
    {
      "questionId": "q11",
      "selectedOptionIndex": 2
    },
    {
      "questionId": "q12",
      "selectedOptionIndex": 0
    }
  ]
}
```

---

**Réponse avec Scoring Détaillé et Recommandations:**
```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "result": {
      "_id": "507f1f77bcf86cd799439111",
      "testId": "507f1f77bcf86cd799439011",
      "totalScore": 82,
      "maxScore": 100,
      "percentage": 82,
      "status": "pass",
      "categoryScores": [
        {
          "category": "Verbal",
          "score": 25,
          "maxScore": 30,
          "percentage": 83
        },
        {
          "category": "Logical",
          "score": 32,
          "maxScore": 40,
          "percentage": 80
        },
        {
          "category": "Numerical",
          "score": 20,
          "maxScore": 25,
          "percentage": 80
        },
        {
          "category": "Spatial",
          "score": 5,
          "maxScore": 5,
          "percentage": 100
        }
      ],
      "recommendations": [
        {
          "programId": "prog_001",
          "programName": "Software Engineering",
          "matchScore": 87.7,
          "reason": "Excellent logical reasoning and problem-solving skills align perfectly with software development requirements",
          "strengths": [
            "Logical: 80%",
            "Numerical: 80%",
            "Verbal: 83%"
          ],
          "weaknesses": []
        },
        {
          "programId": "prog_002",
          "programName": "Data Science",
          "matchScore": 81,
          "reason": "Strong numerical and logical skills are essential for data analysis and machine learning",
          "strengths": [
            "Numerical: 80%",
            "Logical: 80%"
          ],
          "weaknesses": []
        },
        {
          "programId": "prog_003",
          "programName": "Business Analytics",
          "matchScore": 76.3,
          "reason": "Good analytical and verbal communication skills useful for business context",
          "strengths": [
            "Verbal: 83%",
            "Logical: 80%"
          ],
          "weaknesses": []
        }
      ],
      "timeSpent": 3300,
      "attemptNumber": 1
    }
  }
}
```

---

### Exemple 2: Test Non-Réussi

```bash
POST /api/results/submit
Authorization: Bearer {student_token}

{
  "testId": "507f1f77bcf86cd799439011",
  "startTime": "2024-01-16T14:00:00Z",
  "endTime": "2024-01-16T14:45:00Z",
  "answers": [
    {"questionId": "q1", "selectedOptionIndex": 0},  // Incorrect
    {"questionId": "q2", "selectedOptionIndex": 1},  // Incorrect
    {"questionId": "q3", "selectedOptionIndex": 0},  // Incorrect
    {"questionId": "q4", "selectedOptionIndex": 1},  // Incorrect
    {"questionId": "q5", "selectedOptionIndex": 1},  // Incorrect
    {"questionId": "q6", "selectedOptionIndex": 0},  // Incorrect
    {"questionId": "q7", "selectedOptionIndex": 0},  // Incorrect
    {"questionId": "q8", "selectedOptionIndex": 0},  // Incorrect
    {"questionId": "q9", "selectedOptionIndex": 1},  // Incorrect
    {"questionId": "q10", "selectedOptionIndex": 0}, // Incorrect
    {"questionId": "q11", "selectedOptionIndex": 0}, // Incorrect
    {"questionId": "q12", "selectedOptionIndex": 1}  // Incorrect
  ]
}
```

**Réponse - Fail:**
```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "result": {
      "_id": "507f1f77bcf86cd799439112",
      "testId": "507f1f77bcf86cd799439011",
      "totalScore": 10,
      "maxScore": 100,
      "percentage": 10,
      "status": "fail",
      "categoryScores": [
        {
          "category": "Verbal",
          "score": 0,
          "maxScore": 30,
          "percentage": 0
        },
        {
          "category": "Logical",
          "score": 5,
          "maxScore": 40,
          "percentage": 12
        },
        {
          "category": "Numerical",
          "score": 5,
          "maxScore": 25,
          "percentage": 20
        },
        {
          "category": "Spatial",
          "score": 0,
          "maxScore": 5,
          "percentage": 0
        }
      ],
      "recommendations": [
        {
          "programId": "prog_005",
          "programName": "Foundation Program - General Studies",
          "matchScore": 64,
          "reason": "Foundational program suitable for building core competencies",
          "strengths": [],
          "weaknesses": [
            "Verbal: 0%",
            "Logical: 12%",
            "Numerical: 20%",
            "Spatial: 0%"
          ]
        }
      ],
      "timeSpent": 2700,
      "attemptNumber": 1
    }
  }
}
```

---

## Récupération des Résultats

### Exemple 1: Liste des Résultats d'un Étudiant

**Requête:**
```bash
GET /api/results?skip=0&limit=10
Authorization: Bearer {student_token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "_id": "507f1f77bcf86cd799439111",
        "testId": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Aptitude Test 2024 - General"
        },
        "totalScore": 82,
        "percentage": 82,
        "status": "pass",
        "attemptNumber": 1,
        "createdAt": "2024-01-15T11:30:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439113",
        "testId": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Mathematics Specialization Test"
        },
        "totalScore": 120,
        "percentage": 80,
        "status": "pass",
        "attemptNumber": 1,
        "createdAt": "2024-01-17T09:00:00Z"
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

---

### Exemple 2: Détails Complets d'un Résultat

**Requête:**
```bash
GET /api/results/507f1f77bcf86cd799439111
Authorization: Bearer {student_token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Result retrieved successfully",
  "data": {
    "result": {
      "_id": "507f1f77bcf86cd799439111",
      "testId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Aptitude Test 2024 - General",
        "category": "Aptitude"
      },
      "studentId": "507f1f77bcf86cd799439001",
      "totalScore": 82,
      "maxScore": 100,
      "percentage": 82,
      "status": "pass",
      "categoryScores": [
        {
          "category": "Verbal",
          "score": 25,
          "maxScore": 30,
          "percentage": 83
        },
        {
          "category": "Logical",
          "score": 32,
          "maxScore": 40,
          "percentage": 80
        },
        {
          "category": "Numerical",
          "score": 20,
          "maxScore": 25,
          "percentage": 80
        },
        {
          "category": "Spatial",
          "score": 5,
          "maxScore": 5,
          "percentage": 100
        }
      ],
      "recommendations": [
        {
          "programId": "prog_001",
          "programName": "Software Engineering",
          "matchScore": 87.7,
          "reason": "Excellent logical reasoning and problem-solving skills",
          "strengths": ["Logical: 80%", "Numerical: 80%"],
          "weaknesses": []
        },
        {
          "programId": "prog_002",
          "programName": "Data Science",
          "matchScore": 81,
          "reason": "Strong numerical and logical skills",
          "strengths": ["Numerical: 80%", "Logical: 80%"],
          "weaknesses": []
        },
        {
          "programId": "prog_003",
          "programName": "Business Analytics",
          "matchScore": 76.3,
          "reason": "Good analytical skills",
          "strengths": ["Verbal: 83%"],
          "weaknesses": []
        }
      ],
      "timeSpent": 3300,
      "attemptNumber": 1,
      "startTime": "2024-01-15T10:30:00Z",
      "endTime": "2024-01-15T11:25:00Z",
      "createdAt": "2024-01-15T11:30:00Z"
    }
  }
}
```

---

## Analyse et Recommandations

### Exemple 1: Récupération des Recommandations

**Requête:**
```bash
GET /api/results/507f1f77bcf86cd799439111/recommendations
Authorization: Bearer {student_token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Recommendations retrieved successfully",
  "data": {
    "recommendations": [
      {
        "programId": "prog_001",
        "programName": "Software Engineering",
        "matchScore": 87.7,
        "reason": "Your exceptional logical reasoning (80%) and strong numerical skills (80%) make you an ideal candidate for Software Engineering. These skills are crucial for understanding algorithms, data structures, and system design.",
        "strengths": [
          "Logical Reasoning: 80%",
          "Numerical Skills: 80%",
          "Verbal Communication: 83%"
        ],
        "weaknesses": []
      },
      {
        "programId": "prog_002",
        "programName": "Data Science",
        "matchScore": 81,
        "reason": "Your strong numerical problem-solving ability (80%) combined with solid logical thinking (80%) positions you well for data science and analytics roles.",
        "strengths": [
          "Numerical Skills: 80%",
          "Logical Reasoning: 80%"
        ],
        "weaknesses": []
      },
      {
        "programId": "prog_003",
        "programName": "Business Analytics",
        "matchScore": 76.3,
        "reason": "Your excellent verbal communication skills (83%) combined with logical analysis make you suitable for business analytics roles.",
        "strengths": [
          "Verbal Communication: 83%",
          "Logical Reasoning: 80%"
        ],
        "weaknesses": []
      }
    ]
  }
}
```

---

### Exemple 2: Analyse Détaillée d'un Résultat

**Requête:**
```bash
GET /api/results/507f1f77bcf86cd799439111/analysis
Authorization: Bearer {student_token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Analysis retrieved successfully",
  "data": {
    "result": {
      "percentage": 82,
      "status": "pass",
      "categoryScores": [
        {
          "category": "Spatial",
          "score": 5,
          "maxScore": 5,
          "percentage": 100
        },
        {
          "category": "Verbal",
          "score": 25,
          "maxScore": 30,
          "percentage": 83
        },
        {
          "category": "Logical",
          "score": 32,
          "maxScore": 40,
          "percentage": 80
        },
        {
          "category": "Numerical",
          "score": 20,
          "maxScore": 25,
          "percentage": 80
        }
      ],
      "topStrengths": [
        {
          "category": "Spatial",
          "percentage": 100,
          "interpretation": "Exceptional spatial visualization abilities"
        },
        {
          "category": "Verbal",
          "percentage": 83,
          "interpretation": "Strong verbal communication and comprehension"
        },
        {
          "category": "Logical",
          "percentage": 80,
          "interpretation": "Solid logical reasoning capabilities"
        }
      ],
      "areasToImprove": []
    }
  }
}
```

---

### Exemple 3: Statistiques d'un Étudiant

**Requête:**
```bash
GET /api/results/stats/me
Authorization: Bearer {student_token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "statistics": {
      "totalTests": 5,
      "totalAttempts": 6,
      "averageScore": 76.2,
      "passingRate": 83.3,
      "bestScore": 87,
      "worstScore": 54,
      "recentTests": [
        {
          "testTitle": "Mathematics Specialization Test",
          "percentage": 80,
          "status": "pass",
          "date": "2024-01-17T09:00:00Z"
        },
        {
          "testTitle": "Aptitude Test 2024 - General",
          "percentage": 82,
          "status": "pass",
          "date": "2024-01-15T11:30:00Z"
        }
      ],
      "categoryPerformance": {
        "Verbal": {
          "attempts": 5,
          "averagePercentage": 78,
          "trend": "improving"
        },
        "Logical": {
          "attempts": 5,
          "averagePercentage": 76,
          "trend": "stable"
        },
        "Numerical": {
          "attempts": 5,
          "averagePercentage": 74,
          "trend": "declining"
        },
        "Spatial": {
          "attempts": 3,
          "averagePercentage": 88,
          "trend": "excellent"
        }
      },
      "recommendedPrograms": [
        {
          "programName": "Software Engineering",
          "totalRecommendations": 4,
          "averageMatchScore": 85
        },
        {
          "programName": "Data Science",
          "totalRecommendations": 3,
          "averageMatchScore": 79
        }
      ]
    }
  }
}
```

---

## Cas d'Erreur

### Exemple 1: Test Non Trouvé

**Requête:**
```bash
POST /api/results/submit
{
  "testId": "invalid_id"
}
```

**Réponse:** 400 Bad Request
```json
{
  "success": false,
  "message": "Test not found",
  "statusCode": 400
}
```

---

### Exemple 2: Réponses Incomplètes

**Requête:**
```bash
POST /api/results/submit
{
  "testId": "507f1f77bcf86cd799439011",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T11:25:00Z",
  "answers": [
    {"questionId": "q1", "selectedOptionIndex": 1}
    // Seulement 1 réponse au lieu de 12
  ]
}
```

**Réponse:** 400 Bad Request
```json
{
  "success": false,
  "message": "Not all questions answered. Expected 12 answers, received 1",
  "statusCode": 400
}
```

---

### Exemple 3: Accès Non Autorisé

**Requête:**
```bash
GET /api/results/507f1f77bcf86cd799439111
Authorization: Bearer {different_student_token}
```

**Réponse:** 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have access to this result",
  "statusCode": 403
}
```

---

## Workflows Complets

### Workflow 1: Étudiant Prend un Test et Reçoit des Recommandations

```
1. Étudiant Authentifié ✓

2. Récupère liste des tests
   GET /api/tests
   → Reçoit 5 tests disponibles

3. Choisit un test
   GET /api/tests/507f1f77bcf86cd799439011

4. Démarre le test et récupère questions
   GET /api/tests/507f1f77bcf86cd799439011/questions
   → Horloge start: 10:30:00

5. Répond à toutes les questions
   Réponses remises en mémoire pendant 60 minutes

6. Soumet le test
   POST /api/results/submit
   {
     testId: "507f1f77bcf86cd799439011",
     answers: [{questionId, selectedOptionIndex}, ...],
     startTime: "2024-01-15T10:30:00Z",
     endTime: "2024-01-15T11:30:00Z"
   }

7. Serveur traite:
   a) Vérifie test existe ✓
   b) Scorre chaque réponse ✓
   c) Groupe par catégorie ✓
   d) Trie catégories (Verbal: 83%, Logical: 80%, Numerical: 80%, Spatial: 100%) ✓
   e) Sélectionne top 3 (Spatial, Verbal, Logical) ✓
   f) Cherche programmes correspondant ✓
   g) Calcule match scores:
      - Software Engineering: (80 + 80 + 83) / 3 = 87.7%
      - Data Science: (80 + 80) / 2 = 81%
      - Business Analytics: (83 + 80) / 2 = 76.3%
   h) Trie et prend top 3 ✓
   i) Enregistre en base de données ✓

8. Réponse:
   - Status: PASS (82%)
   - Score par catégorie ✓
   - Top 3 recommandations ✓

9. Étudiant voit résultats + recommandations
```

---

### Workflow 2: Conseiller Analyse Résultats d'Étudiants

```
1. Conseiller Authentifié ✓
   Rôle: counselor

2. Récupère tous les résultats
   GET /api/results/admin/all?studentId=&status=

3. Sélectionne un étudiant
   GET /api/results?studentId=507f1f77bcf86cd799439001

4. Analyse résultat détaillé
   GET /api/results/507f1f77bcf86cd799439111/analysis

5. Voit:
   - Percentage: 82%
   - Top strengths: Spatial (100%), Verbal (83%)
   - Category breakdown

6. Recommande Software Engineering basé sur analyse

7. Enregistre la discussion
```

---

## Métriques Phase 4

| Métrique | Valeur |
|----------|--------|
| Endpoints créés | 15+ |
| Modèles créés | 2 |
| Services créés | 2 |
| Contrôleurs créés | 2 |
| Validateurs créés | 2 |
| Routes créés | 2 |
| Lignes de code | ~1,700 |
| Permissions gérées | 4 rôles |
| Questions supportées | 2 types |
| Catégories supportées | 12 |
| Recommandations retournées | Top 3 |

---

## Prochaines Phases

- **Phase 4B**: Documentation OpenAPI + Postman
- **Phase 5**: Frontend (React/Vue)
- **Phase 6**: Subscriptions
- **Phase 7**: Paiements
