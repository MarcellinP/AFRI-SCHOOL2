# AFRI-SCHOOL Frontend - Integration Guide

## 🔗 Backend Integration

This guide covers how the frontend integrates with the AFRI-SCHOOL backend API.

## 📡 API Endpoints

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Headers: Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "subscription": null
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Register
```
POST /api/auth/register
Headers: Content-Type: application/json

Request Body:
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234 800 000 0000"
}

Response:
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": { ... }
}
```

#### Logout
```
POST /api/auth/logout
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Refresh Token
```
POST /api/auth/refresh-token
Headers: Content-Type: application/json

Request Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Test Endpoints

#### List Tests
```
GET /api/tests
Headers:
  - Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "test-id",
      "title": "Career Aptitude Test",
      "description": "Assess your career path",
      "totalQuestions": 50,
      "duration": 60,
      "passingScore": 70,
      "questions": [...]
    },
    ...
  ]
}
```

#### Get Test by ID
```
GET /api/tests/:testId
Headers:
  - Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "test-id",
    "title": "Career Aptitude Test",
    "description": "...",
    "totalQuestions": 50,
    "duration": 60,
    "passingScore": 70,
    "questions": [
      {
        "id": "q1",
        "text": "What is your favorite subject?",
        "type": "MULTIPLE_CHOICE",
        "category": "Mathematics",
        "difficulty": "EASY",
        "options": [
          { "id": "opt1", "text": "Mathematics" },
          { "id": "opt2", "text": "Science" }
        ]
      },
      ...
    ]
  }
}
```

### Result Endpoints

#### Submit Test
```
POST /api/results/submit
Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json

Request Body:
{
  "testId": "test-id",
  "answers": [
    {
      "questionId": "q1",
      "selectedOptionIndex": 0,
      "selectedCategory": "Mathematics"
    },
    ...
  ]
}

Response:
{
  "success": true,
  "data": {
    "id": "result-id",
    "studentId": "user-id",
    "testId": "test-id",
    "totalScore": 42.5,
    "totalPercentage": 85.0,
    "status": "GRADED",
    "categoryScores": [
      {
        "category": "Mathematics",
        "score": 15,
        "percentage": 90,
        "maxScore": 50
      },
      ...
    ],
    "recommendations": [
      {
        "programId": "prog-id",
        "program": {
          "id": "prog-id",
          "name": "Bachelor of Mathematics",
          "school": { ... }
        },
        "matchPercentage": 95,
        "matchedCategories": ["Mathematics"]
      },
      ...
    ]
  }
}
```

#### Get My Results
```
GET /api/results/my-results
Headers:
  - Authorization: Bearer <token>

Query Parameters:
  - page: number (default: 1)
  - pageSize: number (default: 10)

Response:
{
  "success": true,
  "data": [
    {
      "id": "result-id",
      "testId": "test-id",
      "test": { ... },
      "totalScore": 42.5,
      "totalPercentage": 85.0,
      ...
    },
    ...
  ],
  "totalCount": 5,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

#### Get Result by ID
```
GET /api/results/:resultId
Headers:
  - Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "result-id",
    "studentId": "user-id",
    "testId": "test-id",
    "test": { ... },
    "totalScore": 42.5,
    "totalPercentage": 85.0,
    ...
  }
}
```

#### Get Recommendations
```
GET /api/results/:resultId/recommendations
Headers:
  - Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "programId": "prog-id",
        "program": { ... },
        "matchPercentage": 95,
        "matchedCategories": ["Mathematics"]
      },
      ...
    ]
  }
}
```

## 🔌 Frontend API Client Usage

### Making Requests

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const response = await apiClient.get<TestType[]>('/tests');

// POST request
const response = await apiClient.post<ResultType>('/results/submit', {
  testId: '123',
  answers: [...]
});

// Error handling
if (!response.success) {
  console.error(response.message);
}
```

### Automatic Token Management

The API client automatically:
- Adds JWT token to all requests
- Handles token refresh on 401 responses
- Clears tokens and redirects to login on refresh failure

### Request Interceptors

```typescript
// Adds Authorization header
client.interceptors.request.use((config) => {
  const token = TokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptors

```typescript
// Handles 401 errors and refreshes token
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt to refresh token
      // If successful, retry original request
      // If failed, redirect to login
    }
  }
);
```

## 📊 Data Flow Examples

### Example 1: User Login

```
Frontend (Client) → useAuth.login()
↓
API Client → POST /auth/login
↓
Backend → Validate credentials
↓
Backend → Generate JWT tokens
↓
Backend → Return tokens + user data
↓
Frontend → Store tokens in localStorage
↓
Frontend → Update auth store
↓
Frontend → Redirect to dashboard
```

### Example 2: Taking a Test

```
Frontend → useTest.getTest(testId)
↓
API Client → GET /tests/:testId
↓
Backend → Fetch test with questions
↓
Frontend → Display test questions
↓
User → Answer questions
↓
Frontend → useTest.submitTest(testId, answers)
↓
API Client → POST /results/submit
↓
Backend → Calculate scores
↓
Backend → Generate recommendations
↓
Frontend → Display results + recommendations
```

### Example 3: Viewing Results

```
Frontend → useTest.getMyResults()
↓
API Client → GET /results/my-results
↓
Backend → Fetch user's results
↓
Frontend → Display results list
↓
User → Click on result
↓
Frontend → useTest.getResult(resultId)
↓
API Client → GET /results/:resultId
↓
Backend → Return detailed result
↓
Frontend → Display detailed view
```

## 🔐 Security Features

### JWT Token Handling
- Tokens stored securely in localStorage
- Tokens sent in Authorization header
- Automatic token refresh
- Token expiration handling

### Role-Based Access Control (RBAC)
- Roles: STUDENT, ADVISOR, ADMIN, SUPERADMIN
- Permission checking on protected routes
- Backend validates permissions on each request

### Input Validation
- Frontend client-side validation
- Backend server-side validation
- Type safety with TypeScript

### Error Handling
- Network error detection
- API error messages
- Automatic retry on token refresh
- User-friendly error messages

## 📝 Common API Response Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | OK | Use response data |
| 201 | Created | Show success, redirect |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Attempt token refresh, then redirect to login |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show "Not found" message |
| 409 | Conflict | Show conflict error (e.g., email exists) |
| 500 | Server Error | Show generic error message |

## 🚀 Best Practices

### 1. Always Check Success Flag

```typescript
const response = await apiClient.get('/tests');
if (response.success) {
  // Use response.data
} else {
  // Show error: response.message
}
```

### 2. Handle Loading States

```typescript
const { isLoading, data, error } = useTest();

return (
  <>
    {isLoading && <Spinner />}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {data && <Content data={data} />}
  </>
);
```

### 3. Validate Input

```typescript
if (!ValidationUtils.isValidEmail(email)) {
  setError('Invalid email format');
  return;
}
```

### 4. Use Type Safety

```typescript
// Always use types for API responses
const response = await apiClient.get<ITest[]>('/tests');
// response.data is typed as ITest[] | undefined
```

### 5. Handle Network Errors

```typescript
try {
  const response = await apiClient.post('/login', credentials);
} catch (error) {
  const message = ErrorUtils.getErrorMessage(error);
  // Show error to user
}
```

## 📚 API Documentation

For complete backend API documentation, see:
- `/backend/docs/API.md` - Full API reference
- `/backend/docs/PHASE4.md` - Phase 4 (Tests & Results) documentation
- `/backend/docs/EXAMPLES_PHASE4.md` - Practical API examples

## 🔗 Related Files

- `src/lib/api-client.ts` - API client implementation
- `src/hooks/useAuth.ts` - Authentication hook
- `src/hooks/useTest.ts` - Test management hook
- `src/types/index.ts` - Type definitions
- `src/constants/index.ts` - API endpoints and messages

---

**Last Updated**: January 2024
