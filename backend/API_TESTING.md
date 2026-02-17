# API Test Examples - Authentication

## 🚀 Démarrer le serveur

```bash
cd backend
npm install
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:5000`

---

## 📝 Endpoints de test

### 1. Health Check (Sans authentification)

```bash
curl -X GET http://localhost:5000/health
```

**Réponse:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-02-16T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🔐 Authentification

### 1. Inscription (Register)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@afri-school.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "password": "SecurePassword123",
    "role": "student"
  }'
```

**Réponse succès (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65c7f8a9b1234567890abcde",
      "email": "student@afri-school.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "role": "student",
      "subscriptionPlan": "free",
      "isEmailVerified": false,
      "createdAt": "2026-02-16T10:30:00.000Z",
      "updatedAt": "2026-02-16T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreur - Email existe (409):**
```json
{
  "success": false,
  "message": "An error occurred",
  "error": "Email already registered",
  "status": 409
}
```

**Erreur - Validation (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Please check your input",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

### 2. Connexion (Login)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@afri-school.com",
    "password": "SecurePassword123"
  }'
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "65c7f8a9b1234567890abcde",
      "email": "student@afri-school.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "role": "student",
      "subscriptionPlan": "free",
      "lastLogin": "2026-02-16T10:35:00.000Z",
      "createdAt": "2026-02-16T10:30:00.000Z",
      "updatedAt": "2026-02-16T10:35:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreur - Credentials invalides (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid email or password",
  "status": 401
}
```

---

### 3. Get Current User (Protégé)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "65c7f8a9b1234567890abcde",
      "email": "student@afri-school.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "role": "student",
      "subscriptionPlan": "free",
      "createdAt": "2026-02-16T10:30:00.000Z",
      "updatedAt": "2026-02-16T10:35:00.000Z"
    }
  }
}
```

**Erreur - Pas de token (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "No token provided",
  "status": 401
}
```

**Erreur - Token expiré/invalide (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid or expired token",
  "status": 401
}
```

---

### 4. Rafraîchir le Token

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 5. Déconnexion (Logout)

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## 📊 Validation des Entrées

### Password Requirements
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre

**Exemples valides:**
- `SecurePass123`
- `MyPassword2024`
- `Test@Pass99`

**Exemples invalides:**
- `pass123` (pas de majuscule)
- `PASSWORD123` (pas de minuscule)
- `SecurePass` (pas de chiffre)
- `short` (trop court)

### Email Validation
- Format standard email (user@domain.com)
- Case-insensitive (converti en minuscules)
- Unique dans la base de données

### Role Options
- `student` (default)
- `parent`
- `counselor`
- `admin` (admin only)

---

## 🔒 Rate Limiting

### Auth Endpoints (register, login)
- **Limite:** 5 requêtes par 15 minutes
- **Code erreur:** 429 Too Many Requests

```json
{
  "success": false,
  "message": "Too many login attempts",
  "error": "Please try again later"
}
```

### Autres Endpoints
- **Limite:** 100 requêtes par 15 minutes

---

## 📦 Stockage des Tokens

### Frontend - LocalStorage
```javascript
// Après login/register
localStorage.setItem('accessToken', response.data.accessToken);
localStorage.setItem('refreshToken', response.data.refreshToken);

// Pour les requêtes
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
};
```

### Refresh Token (Redis)
- Stocké côté serveur dans Redis
- TTL: 7 jours
- Clé: `refresh_token:{userId}`
- Supprimé au logout

---

## 🧪 Avec Postman

### Créer une collection avec variables

```json
{
  "info": {
    "name": "AFRI-SCHOOL Auth API"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    },
    {
      "key": "accessToken",
      "value": ""
    },
    {
      "key": "refreshToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{...}"
        }
      }
    }
  ]
}
```

### Script de test (Tests tab)
```javascript
if (pm.response.code === 201 || pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

---

## 🐍 Avec Python (requests)

```python
import requests
import json

BASE_URL = "http://localhost:5000"
HEADERS = {"Content-Type": "application/json"}

# Register
register_data = {
    "email": "student@afri-school.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "password": "SecurePassword123",
    "role": "student"
}

response = requests.post(
    f"{BASE_URL}/api/auth/register",
    headers=HEADERS,
    json=register_data
)

if response.status_code == 201:
    data = response.json()
    access_token = data['data']['accessToken']
    refresh_token = data['data']['refreshToken']
    print("Registered successfully!")

    # Get current user
    headers = {
        **HEADERS,
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(
        f"{BASE_URL}/api/auth/me",
        headers=headers
    )
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.json()}")
```

---

## 🔗 JavaScript/Fetch

```javascript
const BASE_URL = 'http://localhost:5000';

// Register
async function register() {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@afri-school.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      password: 'SecurePassword123',
      role: 'student'
    })
  });

  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    console.log('Registered successfully!');
  } else {
    console.error('Registration failed:', data.error);
  }
}

// Get current user
async function getCurrentUser() {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log('Current user:', data.data.user);
  } else {
    console.error('Failed to get user:', data.error);
  }
}
```

---

## ✅ Checklist avant production

- [ ] MongoDB connectée
- [ ] Redis connectée
- [ ] Variables .env configurées
- [ ] CORS configuré correctement
- [ ] Rate limiting actif
- [ ] Logs fonctionnels
- [ ] Erreurs testées
- [ ] Tokens JWT vérifiés
- [ ] Refresh token flow testé
- [ ] Protection des routes testée
