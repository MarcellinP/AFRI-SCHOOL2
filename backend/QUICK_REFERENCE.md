# ⚡ QUICK REFERENCE - AFRI-SCHOOL API

## 🚀 Start Server

```bash
npm run dev
# Server: http://localhost:5000
```

---

## 🔐 Authentication

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123!"
  }'

# Response: { accessToken, refreshToken }
TOKEN=<accessToken>
```

### Use Token
```bash
curl http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏫 SCHOOLS API

### List (Public)
```bash
GET /api/schools
GET /api/schools?country=Sénégal&limit=10&skip=0
GET /api/schools?search=Dakar
GET /api/schools?schoolType=Public
```

### Detail (Public)
```bash
GET /api/schools/:id
```

### Create (Admin)
```bash
POST /api/schools
Authorization: Bearer $TOKEN
{
  "name": "University Name",
  "description": "Description",
  "abbreviation": "UNI",
  "location": "City",
  "country": "Country",
  "email": "contact@uni.edu",
  "phone": "+1234567890",
  "schoolType": "Public",
  "studentCapacity": 5000,
  "establishedYear": 2020
}
```

### Update (Admin)
```bash
PUT /api/schools/:id
Authorization: Bearer $TOKEN
{
  "studentCapacity": 6000,
  "ranking": 100
}
```

### Delete (Admin)
```bash
DELETE /api/schools/:id
Authorization: Bearer $TOKEN
```

### Add Program (Admin)
```bash
POST /api/schools/:id/programs/:programId
Authorization: Bearer $TOKEN
```

### Remove Program (Admin)
```bash
DELETE /api/schools/:id/programs/:programId
Authorization: Bearer $TOKEN
```

---

## 📚 PROGRAMS API

### List (Public)
```bash
GET /api/programs
GET /api/programs?field=Science&level=Licence
GET /api/programs?search=Informatique
```

### Detail (Public)
```bash
GET /api/programs/:id
```

### Create (Admin)
```bash
POST /api/programs
Authorization: Bearer $TOKEN
{
  "name": "Program Name",
  "description": "Description",
  "abbreviation": "PROG",
  "field": "Science",
  "level": "Licence",
  "duration": 3,
  "language": "French"
}
```

### Update (Admin)
```bash
PUT /api/programs/:id
Authorization: Bearer $TOKEN
{
  "duration": 4,
  "tuitionFees": 3000
}
```

### Delete (Admin)
```bash
DELETE /api/programs/:id
Authorization: Bearer $TOKEN
```

---

## 👥 ADMIN API

### List Roles
```bash
GET /api/admin/roles
Authorization: Bearer $TOKEN
```

### Create Role
```bash
POST /api/admin/roles
Authorization: Bearer $TOKEN
{
  "name": "moderator",
  "displayName": "Moderator",
  "description": "Can manage content",
  "permissions": [...]
}
```

### Add Permission to Role
```bash
POST /api/admin/roles/:roleId/permissions
Authorization: Bearer $TOKEN
{
  "resource": "schools",
  "action": "read",
  "name": "Read Schools"
}
```

---

## 🔑 Roles & Permissions

### Default Roles
- **admin** - Full access
- **counselor** - Test & Result CRUD
- **student** - Test & Result read/create
- **parent** - Result read only

### Permission Format
```
resource:action
schools:create
schools:read
schools:update
schools:delete
programs:create
tests:create
results:read
...
```

---

## 📊 Query Parameters

### All LIST Endpoints
```
skip=0          # Offset (default: 0)
limit=10        # Per page (default: 10)
sortBy=name     # Sort field (default: createdAt)
sortOrder=asc   # asc or desc (default: desc)
search=text     # Search in fields

Schools only:
country=X       # Filter by country
schoolType=X    # Public|Private|International

Programs only:
field=X         # Science|Engineering|Business|...
level=X         # Licence|Master|Doctorat|Diplôme
```

---

## ✅ Validation Rules

### School Fields
```
name: 3-255 chars, unique
description: 10-2000 chars
abbreviation: 2-10 chars, unique, uppercase
email: valid email format
phone: non-empty
schoolType: Public|Private|International
studentCapacity: >= 1
establishedYear: 1800-currentYear
```

### Program Fields
```
name: 3-255 chars
description: 10-2000 chars
abbreviation: 2-10 chars, uppercase
field: required enum
level: required enum
duration: 1-10
language: required
```

---

## 🎯 Response Format

### Success (200, 201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "school": {...} OR
    "schools": [...],
    "pagination": {
      "total": 100,
      "skip": 0,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### Error (400, 401, 403, 422, 500)
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed description"
}
```

---

## 🔴 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET /api/schools (success) |
| 201 | Created | POST /api/schools (success) |
| 400 | Bad Request | Invalid data format |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | School doesn't exist |
| 409 | Conflict | Duplicate name |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Unexpected error |

---

## 🧪 Test Flow

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@afri-school.com",
    "password": "AdminPassword123!"
  }' | jq -r '.data.accessToken')

# 2. Create school
SCHOOL=$(curl -s -X POST http://localhost:5000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "description": "For testing",
    "abbreviation": "TS123",
    "location": "TestCity",
    "country": "TestCountry",
    "email": "test@test.com",
    "phone": "+1234567890",
    "schoolType": "Private",
    "studentCapacity": 1000,
    "establishedYear": 2020
  }')

SCHOOL_ID=$(echo $SCHOOL | jq -r '.data.school._id')

# 3. Get school
curl -s http://localhost:5000/api/schools/$SCHOOL_ID | jq '.data.school.name'

# 4. Update school
curl -s -X PUT http://localhost:5000/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentCapacity": 2000}' | jq '.success'

# 5. Delete school
curl -s -X DELETE http://localhost:5000/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.success'
```

---

## 🐛 Common Errors

### 401 Unauthorized
```
Missing Authorization header
Solution: Add -H "Authorization: Bearer $TOKEN"
```

### 403 Forbidden
```
Missing permission
Solution: Use admin token or check permissions
```

### 422 Validation Error
```
Invalid data
Solution: Check field values against validation rules
```

### 409 Conflict
```
Duplicate name/abbreviation
Solution: Use unique values
```

### 404 Not Found
```
Resource doesn't exist
Solution: Check ID is correct
```

---

## 📚 Endpoints Summary

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /health | ❌ | Anyone |
| POST | /api/auth/register | ❌ | Anyone |
| POST | /api/auth/login | ❌ | Anyone |
| POST | /api/auth/refresh | ❌ | Anyone |
| POST | /api/auth/logout | ✅ | User |
| GET | /api/auth/me | ✅ | User |
| GET | /api/schools | ❌ | Anyone |
| GET | /api/schools/:id | ❌ | Anyone |
| POST | /api/schools | ✅ | Admin |
| PUT | /api/schools/:id | ✅ | Admin |
| DELETE | /api/schools/:id | ✅ | Admin |
| POST | /api/schools/:id/programs/:programId | ✅ | Admin |
| DELETE | /api/schools/:id/programs/:programId | ✅ | Admin |
| GET | /api/programs | ❌ | Anyone |
| GET | /api/programs/:id | ❌ | Anyone |
| POST | /api/programs | ✅ | Admin |
| PUT | /api/programs/:id | ✅ | Admin |
| DELETE | /api/programs/:id | ✅ | Admin |
| GET | /api/admin/roles | ✅ | Admin |

---

## 🔗 Useful Links

- **Full API Docs**: [PHASE3.md](./PHASE3.md)
- **Usage Examples**: [EXAMPLES_PHASE3.md](./EXAMPLES_PHASE3.md)
- **Integration Guide**: [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)
- **Project Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **Progress**: [PROGRESS.md](./PROGRESS.md)

---

## ⚡ Pro Tips

1. **Save token to variable**
   ```bash
   export TOKEN="your_token_here"
   ```

2. **Pretty print JSON**
   ```bash
   curl ... | jq '.'
   ```

3. **Extract specific field**
   ```bash
   curl ... | jq '.data.school.name'
   ```

4. **Test without token**
   ```bash
   curl http://localhost:5000/api/schools
   ```

5. **Redirect to file**
   ```bash
   curl ... > response.json
   ```

---

**Version**: 1.0.0  
**Updated**: January 2024  
**Status**: 🟢 Production Ready

