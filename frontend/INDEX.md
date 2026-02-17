# 📚 AFRI-SCHOOL Frontend - Complete Index & Navigation

## 🗂️ Documentation Guide

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup (⭐ START HERE)
- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Comprehensive setup guide
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Backend API integration
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Complete directory overview

## 🎯 Quick Navigation

### By Role

#### 👨‍💻 Developer
1. **Setup**: Read [QUICK_START.md](./QUICK_START.md)
2. **Architecture**: Read [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
3. **Development**: Read [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
4. **Integration**: Read [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

#### 🏗️ Architect
1. **Overview**: [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) - Project structure
2. **Data Flow**: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) - Architecture section
3. **Integration**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - System design

#### 🧪 QA/Tester
1. **Setup**: [QUICK_START.md](./QUICK_START.md)
2. **Workflows**: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) - Workflows section
3. **API Endpoints**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

### By Topic

#### 🔐 Authentication
- Hook: `src/hooks/useAuth.ts`
- Pages: `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`
- Store: `src/store/auth.store.ts`
- Guide: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md#-authentication-flow)
- API: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#authentication-endpoints)

#### 📝 Tests & Results
- Hook: `src/hooks/useTest.ts`
- Pages: `src/app/dashboard/tests/page.tsx`, `src/app/test/[id]/page.tsx`
- Store: `src/store/test.store.ts`
- Guide: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md#-test-management)
- API: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#test-endpoints)

#### 💳 Subscriptions
- Hook: `src/hooks/useSubscription.ts`
- Store: `src/store/subscription.store.ts`
- Guide: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md#-test-management)

#### 📡 API Integration
- Client: `src/lib/api-client.ts`
- Types: `src/types/index.ts`
- Constants: `src/constants/index.ts`
- Guide: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

#### 🎨 Styling & UI
- Config: `tailwind.config.ts`
- Styles: `src/styles/globals.css`
- Guide: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md#-styling)

## 📖 Detailed Guides

### Hooks & State Management

```
useAuth Hook (Authentication)
├── src/hooks/useAuth.ts (250+ lines)
├── src/store/auth.store.ts (80+ lines)
├── Functions:
│   ├── login(credentials) → IAuthResponse
│   ├── register(data) → IAuthResponse
│   ├── logout() → void
│   ├── refreshToken() → boolean
│   ├── hasRole(role) → boolean
│   └── hasPermission(role) → boolean
└── Usage: const { user, token, login, logout } = useAuth()

useTest Hook (Test Management)
├── src/hooks/useTest.ts (200+ lines)
├── src/store/test.store.ts (60+ lines)
├── Functions:
│   ├── fetchTests() → ITest[]
│   ├── getTest(id) → ITest
│   ├── submitTest(id, answers) → ITestResult
│   ├── getMyResults() → ITestResult[]
│   ├── getResult(id) → ITestResult
│   └── getRecommendations(id) → IRecommendation[]
└── Usage: const { tests, fetchTests, submitTest } = useTest()

useSubscription Hook
├── src/hooks/useSubscription.ts (120+ lines)
├── src/store/subscription.store.ts (50+ lines)
├── Functions:
│   ├── fetchSubscription() → ISubscription
│   ├── upgradeToPremium(paymentId) → ISubscription
│   ├── downgradeToFree() → boolean
│   └── cancelSubscription() → boolean
└── Usage: const { subscription, isPremium } = useSubscription()

useForm Hook (Form Management)
├── src/hooks/useForm.ts (150+ lines)
├── Functions:
│   ├── handleChange(e)
│   ├── handleBlur(e)
│   ├── handleSubmit(e)
│   ├── setFieldValue(field, value)
│   ├── setFieldError(field, error)
│   └── resetForm()
└── Usage: const { values, errors, handleSubmit } = useForm({...})
```

### Pages & Routes

```
/                          → src/app/page.tsx (Landing)
/auth/login                → src/app/auth/login/page.tsx
/auth/register             → src/app/auth/register/page.tsx
/dashboard                 → src/app/dashboard/page.tsx
/dashboard/tests           → src/app/dashboard/tests/page.tsx
/dashboard/results         → src/app/dashboard/results/page.tsx
/dashboard/results/:id     → src/app/dashboard/results/[id]/page.tsx
/test/:id                  → src/app/test/[id]/page.tsx
/admin/*                   → src/app/admin/* (Future)
/pricing                   → src/app/pricing/page.tsx (Future)
```

### API Client Usage

```
Import
└── import { apiClient } from '@/lib/api-client'

GET Request
└── const response = await apiClient.get<T>('/endpoint')
    └── Returns: IApiResponse<T>

POST Request
└── const response = await apiClient.post<T>('/endpoint', data)
    └── Returns: IApiResponse<T>

PUT Request
└── const response = await apiClient.put<T>('/endpoint', data)
    └── Returns: IApiResponse<T>

DELETE Request
└── const response = await apiClient.delete<T>('/endpoint')
    └── Returns: IApiResponse<T>

Error Handling
├── Check response.success
├── Use response.message for errors
└── Use ErrorUtils.getErrorMessage(error) in catch block
```

### Type System

```
User Types
├── IUser - User data structure
├── IAuthResponse - Login/register response
├── ILoginCredentials - Login form data
├── IRegisterData - Register form data
└── UserRole - Enum (STUDENT, ADVISOR, ADMIN, SUPERADMIN)

Test Types
├── ITest - Test structure
├── IQuestion - Question structure
├── IOption - Answer option
├── IStudentAnswer - Student's answer
├── QuestionType - Enum (MULTIPLE_CHOICE, TRUE_FALSE, RATING)
└── ITestResult - Result after test submission

School Types
├── ISchool - School information
├── IProgram - Program information
└── PROGRAM_LEVELS - Enum (BACHELOR, MASTER, DIPLOMA, CERTIFICATE)

Recommendation Types
├── ICategoryScore - Score per category
├── IRecommendation - Recommended program
└── IRecommendation[] - List of recommendations

Subscription Types
├── ISubscription - Subscription data
└── SUBSCRIPTION_PLANS - Enum (FREE, PREMIUM, ENTERPRISE)

API Types
├── IApiResponse<T> - Standard API response
└── IPaginatedResponse<T> - Paginated API response

Form Types
├── IFormError - Form field error
├── ILoading - Loading state
└── IError - Error state
```

### Utility Functions

```
Token Management (TokenManager)
├── setToken(token) - Save JWT token
├── getToken() - Get JWT token
├── removeToken() - Clear JWT token
├── setRefreshToken(token) - Save refresh token
├── getRefreshToken() - Get refresh token
├── removeRefreshToken() - Clear refresh token
├── clear() - Clear all tokens
├── isTokenExpired(token) - Check expiration
└── decodeToken(token) - Decode JWT payload

Validation Utils (ValidationUtils)
├── isValidEmail(email) - Validate email format
├── isValidPassword(password) - Check min length (8)
├── isValidPhone(phone) - Validate phone format
└── isValidName(name) - Check name length (2-50)

Date Utils (DateUtils)
├── formatDate(date) - Format as MM/DD/YYYY
├── formatTime(date) - Format as HH:MM:SS
├── formatDateTime(date) - Format as full datetime
├── formatRelative(date) - Format as "2 hours ago"
└── isWithinLast24Hours(date) - Check if recent

String Utils (StringUtils)
├── capitalize(str) - Capitalize first letter
├── titleCase(str) - Title Case Each Word
├── truncate(str, length) - Truncate with ...
├── slugify(str) - Convert to slug format
└── getInitials(first, last) - Get initials

Number Utils (NumberUtils)
├── formatScore(score, total) - Format as "X/Y (Z%)"
├── formatPercentage(num, decimals) - Format as percentage
├── roundToTwo(num) - Round to 2 decimals
└── clamp(num, min, max) - Clamp value

Error Utils (ErrorUtils)
├── getErrorMessage(error) - Extract error message
├── isNetworkError(error) - Check if network error
├── isServerError(error) - Check if 5xx error
└── isClientError(error) - Check if 4xx error
```

### Constants

```
Routes (ROUTES)
├── HOME, LOGIN, REGISTER, FORGOT_PASSWORD, RESET_PASSWORD
├── DASHBOARD, DASHBOARD_PROFILE, DASHBOARD_TESTS, DASHBOARD_RESULTS
├── TEST, TEST_ID(id), TEST_RESULT(id)
├── ADMIN, ADMIN_DASHBOARD, ADMIN_USERS, ADMIN_SCHOOLS, ADMIN_PROGRAMS, ADMIN_RESULTS
└── PRICING

HTTP Status (HTTP_STATUS)
├── OK: 200, CREATED: 201
├── BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404
├── CONFLICT: 409
└── INTERNAL_SERVER_ERROR: 500, SERVICE_UNAVAILABLE: 503

Messages
├── ERROR_MESSAGES - 10+ error messages
├── SUCCESS_MESSAGES - 5+ success messages
└── VALIDATION - Regex patterns and length limits

Enums
├── QUESTION_TYPES - MULTIPLE_CHOICE, TRUE_FALSE, RATING
├── DIFFICULTY_LEVELS - EASY, MEDIUM, HARD
├── PROGRAM_LEVELS - BACHELOR, MASTER, DIPLOMA, CERTIFICATE
├── USER_ROLES - STUDENT, ADVISOR, ADMIN, SUPERADMIN
├── SUBSCRIPTION_PLANS - FREE, PREMIUM, ENTERPRISE
├── SUBSCRIPTION_STATUS - ACTIVE, INACTIVE, CANCELLED
└── TEST_STATUS - IN_PROGRESS, SUBMITTED, GRADED

Keys & Settings
├── STORAGE_KEYS - localStorage keys
├── PAGINATION - Default page size
├── DELAYS - Animation & toast durations
└── TEST_CATEGORIES - 8+ test categories
```

## 🔄 Common Workflows

### User Registration & Login

```
1. User visits /auth/register
2. Fills registration form
3. Validates input client-side
4. Calls useAuth().register(data)
5. API validates and creates user
6. User receives verification email
7. User visits /auth/login
8. Enters credentials
9. Calls useAuth().login(credentials)
10. Backend returns JWT tokens
11. Frontend stores tokens
12. Redirects to /dashboard
```

### Taking a Test

```
1. Student visits /dashboard/tests
2. useTest().fetchTests() gets list
3. Student clicks "Start Test"
4. Navigates to /test/:id
5. useTest().getTest(id) loads questions
6. Student answers questions
7. Tracks progress with visual indicators
8. Student clicks "Submit"
9. Confirmation dialog appears
10. useTest().submitTest(id, answers) sends data
11. Backend calculates scores & recommendations
12. Redirects to /dashboard/results
13. Results displayed with breakdown
14. Recommendations shown
```

### Viewing Results

```
1. Student visits /dashboard/results
2. useTest().getMyResults() fetches history
3. Results displayed in table/cards
4. Student clicks on result
5. Navigates to /dashboard/results/:id
6. useTest().getResult(id) loads details
7. Shows category breakdown
8. Shows recommended programs
9. Student can view program details
10. Student can retake test
```

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Pages Created** | 8 |
| **Hooks Created** | 4 |
| **Zustand Stores** | 3 |
| **Type Definitions** | 20+ |
| **Utility Functions** | 25+ |
| **Constants Defined** | 50+ |
| **API Endpoints Integrated** | 15+ |
| **Documentation Files** | 4 |
| **Total Lines of Code** | 3,500+ |
| **Components to Create** | 15+ |

## 🔧 Quick Commands

```bash
# Setup
npm install                    # Install dependencies
cp .env.example .env.local    # Setup environment

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start prod server

# Quality
npm run lint                   # Run linter
npm run type-check            # Type check
npm run format                # Format code

# Directories
ls src/app                    # View pages
ls src/hooks                  # View hooks
ls src/store                  # View stores
ls src/types                  # View types
```

## 🚀 Next Steps

1. **Setup Environment** → `npm install && cp .env.example .env.local`
2. **Start Dev Server** → `npm run dev`
3. **Open in Browser** → `http://localhost:3000`
4. **Test Authentication** → Try login at `/auth/login`
5. **Create Components** → Build reusable UI components
6. **Add Pages** → Create additional pages as needed
7. **Deploy** → Build and deploy to production

## 📚 Resource Links

### Documentation
- **[QUICK_START.md](./QUICK_START.md)** - Start here!
- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Complete guide
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - API integration
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Directory overview

### External Resources
- **[Next.js Docs](https://nextjs.org/docs)** - Framework
- **[React Docs](https://react.dev)** - UI library
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Language
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling
- **[Zustand Docs](https://github.com/pmndrs/zustand)** - State management

### Backend Documentation
- **Backend API Docs** → `../backend/docs/API.md`
- **Phase 4 Guide** → `../backend/docs/PHASE4.md`
- **Examples** → `../backend/docs/EXAMPLES_PHASE4.md`

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Check TypeScript paths in `tsconfig.json` |
| Token error | Clear localStorage and login again |
| API not responding | Verify backend running on `localhost:3001` |
| Types error | Run `npm run type-check` to verify |
| Port 3000 in use | `lsof -i :3000` to find process |

## ✅ Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Copied `.env.example` to `.env.local`
- [ ] Updated API URL in `.env.local`
- [ ] Started dev server (`npm run dev`)
- [ ] Verified app loads at `http://localhost:3000`
- [ ] Tested login flow
- [ ] Tested test taking flow
- [ ] Reviewed file structure
- [ ] Understood hooks & state management
- [ ] Ready to create components

---

**Version**: 1.0.0
**Last Updated**: January 2024
**Frontend Status**: Core Complete ✅ | Components Pending 🔄

**Need Help?** Start with [QUICK_START.md](./QUICK_START.md) →
