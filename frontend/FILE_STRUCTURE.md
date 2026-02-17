# 📦 AFRI-SCHOOL Frontend - Complete File Structure

## Directory Tree

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (HTML structure, metadata)
│   │   ├── page.tsx                      # Home page (public landing page)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Login page
│   │   │   └── register/
│   │   │       └── page.tsx              # Registration page
│   │   ├── dashboard/
│   │   │   ├── page.tsx                  # Main dashboard
│   │   │   ├── tests/
│   │   │   │   └── page.tsx              # Available tests listing
│   │   │   ├── results/
│   │   │   │   ├── page.tsx              # Results listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Result details
│   │   │   ├── profile/
│   │   │   │   └── page.tsx              # User profile (future)
│   │   │   └── layout.tsx                # Dashboard layout (sidebar, header)
│   │   ├── test/
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Test taking interface
│   │   ├── admin/                        # Admin pages (future)
│   │   │   ├── page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── schools/page.tsx
│   │   │   ├── programs/page.tsx
│   │   │   └── layout.tsx
│   │   └── pricing/
│   │       └── page.tsx                  # Pricing page (future)
│   │
│   ├── components/                       # Reusable components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProfileForm.tsx
│   │   ├── cards/
│   │   │   ├── TestCard.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── ProgramCard.tsx
│   │   ├── modals/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── ErrorModal.tsx
│   │   ├── loaders/
│   │   │   ├── Spinner.tsx
│   │   │   └── Skeleton.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Alert.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                    # Authentication hook
│   │   ├── useTest.ts                    # Test management hook
│   │   ├── useSubscription.ts            # Subscription hook
│   │   ├── useForm.ts                    # Form management hook
│   │   ├── useLocalStorage.ts            # LocalStorage hook (future)
│   │   └── useApi.ts                     # Generic API hook (future)
│   │
│   ├── lib/
│   │   ├── api-client.ts                 # Axios API client with interceptors
│   │   └── validators.ts                 # Form validators (future)
│   │
│   ├── store/
│   │   ├── auth.store.ts                 # Zustand auth store
│   │   ├── test.store.ts                 # Zustand test store
│   │   ├── subscription.store.ts         # Zustand subscription store
│   │   └── ui.store.ts                   # Zustand UI state (future)
│   │
│   ├── types/
│   │   └── index.ts                      # TypeScript type definitions
│   │       - User types (IUser, IAuthResponse, etc.)
│   │       - Test types (ITest, IQuestion, IAnswer)
│   │       - Result types (ITestResult, IRecommendation)
│   │       - School/Program types (ISchool, IProgram)
│   │       - Subscription types (ISubscription)
│   │       - API types (IApiResponse, IPaginatedResponse)
│   │       - UI types (IFormError, ILoading, IError)
│   │
│   ├── utils/
│   │   └── index.ts                      # Utility functions
│   │       - TokenManager (JWT management)
│   │       - ValidationUtils (email, password, phone, etc.)
│   │       - DateUtils (formatting, parsing)
│   │       - StringUtils (capitalize, truncate, slugify, etc.)
│   │       - NumberUtils (formatting, rounding)
│   │       - ErrorUtils (error handling)
│   │
│   ├── constants/
│   │   └── index.ts                      # Application constants
│   │       - API_BASE_URL, ROUTES, HTTP_STATUS
│   │       - ERROR_MESSAGES, SUCCESS_MESSAGES
│   │       - VALIDATION rules
│   │       - QUESTION_TYPES, DIFFICULTY_LEVELS
│   │       - USER_ROLES, SUBSCRIPTION_PLANS
│   │       - LOCAL_STORAGE_KEYS
│   │
│   └── styles/
│       ├── globals.css                   # Global styles, Tailwind imports
│       └── variables.css                 # CSS variables (future)
│
├── public/                               # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
│       ├── hero.png
│       ├── features.png
│       └── social-icons/
│
├── .env.example                          # Environment variables template
├── .env.local                            # Local environment (git ignored)
├── .gitignore                            # Git ignore rules
├── .eslintrc.json                        # ESLint configuration
├── next.config.js                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── postcss.config.js                     # PostCSS configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # NPM dependencies & scripts
├── package-lock.json                     # Locked dependency versions
├── README.md                             # Original README
├── FRONTEND_SETUP.md                     # Complete setup guide
├── INTEGRATION_GUIDE.md                  # Backend integration guide
└── QUICK_START.md                        # Quick start guide

```

## 📝 File Descriptions

### App Directory (`src/app/`)

| File | Purpose | Status |
|------|---------|--------|
| `layout.tsx` | Root HTML structure and metadata | ✅ Created |
| `page.tsx` | Landing/home page | ✅ Created |
| `auth/login/page.tsx` | Login form | ✅ Created |
| `auth/register/page.tsx` | Registration form | ✅ Created |
| `dashboard/page.tsx` | Main dashboard | ✅ Created |
| `dashboard/tests/page.tsx` | Test listing | ✅ Created |
| `dashboard/results/page.tsx` | Results listing | ✅ Created |
| `test/[id]/page.tsx` | Test taking interface | ✅ Created |

### Components (`src/components/`)

Status: 🔄 To be created as needed

- Layout components (Header, Sidebar, Footer)
- Form components (Input, Select, Checkbox)
- Card components (TestCard, ResultCard)
- Modal components (Dialogs, Alerts)
- Loader components (Spinner, Skeleton)
- Common UI components (Button, Input, Alert)

### Hooks (`src/hooks/`)

| Hook | Purpose | Status |
|------|---------|--------|
| `useAuth.ts` | Authentication & user management | ✅ Created |
| `useTest.ts` | Test taking & result management | ✅ Created |
| `useSubscription.ts` | Subscription management | ✅ Created |
| `useForm.ts` | Form state management | ✅ Created |

### Libraries (`src/lib/`)

| File | Purpose | Status |
|------|---------|--------|
| `api-client.ts` | Axios API client with interceptors | ✅ Created |

### Stores (`src/store/`)

| Store | Purpose | Status |
|-------|---------|--------|
| `auth.store.ts` | Zustand auth state | ✅ Created |
| `test.store.ts` | Zustand test state | ✅ Created |
| `subscription.store.ts` | Zustand subscription state | ✅ Created |

### Types (`src/types/`)

| Type | Interfaces |
|------|-----------|
| User | IUser, IAuthResponse, ILoginCredentials, IRegisterData |
| School | ISchool |
| Program | IProgram |
| Test | ITest, IQuestion, IOption, QuestionType |
| Result | ITestResult, IStudentAnswer, ICategoryScore, IRecommendation |
| Subscription | ISubscription |
| API | IApiResponse, IPaginatedResponse |
| UI | IFormError, ILoading, IError |

### Utils (`src/utils/`)

| Utility | Functions |
|---------|-----------|
| TokenManager | setToken, getToken, removeToken, isTokenExpired, decodeToken |
| ValidationUtils | isValidEmail, isValidPassword, isValidPhone, isValidName |
| DateUtils | formatDate, formatTime, formatDateTime, formatRelative |
| StringUtils | capitalize, titleCase, truncate, slugify, getInitials |
| NumberUtils | formatScore, formatPercentage, roundToTwo, clamp |
| ErrorUtils | getErrorMessage, isNetworkError, isServerError, isClientError |

### Constants (`src/constants/`)

| Constant | Values |
|----------|--------|
| API_BASE_URL | API endpoint URL |
| ROUTES | All application routes |
| HTTP_STATUS | HTTP status codes |
| ERROR_MESSAGES | Error message strings |
| SUCCESS_MESSAGES | Success message strings |
| VALIDATION | Validation rules (regex, min/max length) |
| QUESTION_TYPES | MULTIPLE_CHOICE, TRUE_FALSE, RATING |
| DIFFICULTY_LEVELS | EASY, MEDIUM, HARD |
| PROGRAM_LEVELS | BACHELOR, MASTER, DIPLOMA, CERTIFICATE |
| USER_ROLES | STUDENT, ADVISOR, ADMIN, SUPERADMIN |
| SUBSCRIPTION_PLANS | FREE, PREMIUM, ENTERPRISE |
| STORAGE_KEYS | localStorage key names |

## 🔄 Data Flow

```
User Action
    ↓
Component State Update
    ↓
Hook Function Call (useAuth, useTest, etc.)
    ↓
Zustand Store Update
    ↓
API Client Request (apiClient.post, etc.)
    ↓
Interceptor adds JWT token
    ↓
Backend API
    ↓
Response Interceptor
    ↓
API Client Response Handler
    ↓
Hook Updates Store
    ↓
Component Re-renders
    ↓
UI Updates
```

## 🎯 Component Communication

```
App Pages
    ├── Use Hooks
    │   ├── useAuth
    │   ├── useTest
    │   ├── useSubscription
    │   └── useForm
    │
    ├── Hooks Update
    │   └── Zustand Stores
    │
    ├── Stores
    │   ├── auth.store
    │   ├── test.store
    │   └── subscription.store
    │
    └── API Client
        ├── Request Interceptor (add token)
        ├── HTTP Method (GET, POST, etc.)
        └── Response Interceptor (handle 401)
```

## 📊 State Management Flow

```
1. User Login
   ├── Login Form Component
   ├── useAuth().login(credentials)
   ├── API Request → /auth/login
   ├── Zustand Auth Store Update
   │   ├── setUser(user)
   │   ├── setToken(token)
   │   ├── setAuthenticated(true)
   │   └── setLoading(false)
   └── Component Re-renders with new state

2. Take Test
   ├── Test Component
   ├── useTest().getTest(testId)
   ├── API Request → /tests/:id
   ├── Zustand Test Store Update
   │   ├── setCurrentTest(test)
   │   └── setLoading(false)
   └── Component Displays Test

3. Submit Test
   ├── Test Component
   ├── useTest().submitTest(testId, answers)
   ├── API Request → /results/submit
   ├── Zustand Test Store Update
   │   ├── setCurrentResult(result)
   │   ├── setRecommendations(programs)
   │   └── setLoading(false)
   └── Navigate to Results Page
```

## 🔐 Authentication Flow

```
1. Register
   └── /auth/register
       ├── Form validation
       ├── POST /auth/register
       ├── Backend creates user
       ├── Redirect to login
       └── User verifies email

2. Login
   └── /auth/login
       ├── Form validation
       ├── POST /auth/login
       ├── Backend validates credentials
       ├── Backend returns JWT + refresh token
       ├── Frontend stores tokens
       ├── Zustand updates auth state
       ├── Store user in localStorage
       └── Redirect to dashboard

3. Protected Route Access
   └── useAuth hook
       ├── Check isAuthenticated
       ├── If false, redirect to login
       └── If true, show page

4. Token Refresh
   └── API Response 401
       ├── Use refresh token
       ├── POST /auth/refresh-token
       ├── Backend returns new JWT
       ├── Update token in localStorage
       ├── Retry original request
       └── If refresh fails, redirect to login

5. Logout
   └── useAuth().logout()
       ├── POST /auth/logout
       ├── Clear tokens
       ├── Clear localStorage
       ├── Reset Zustand store
       └── Redirect to home
```

## 📱 Page Routes Map

```
Public Routes
├── / (home)
├── /auth/login
└── /auth/register

Protected Routes (Dashboard)
├── /dashboard (main)
├── /dashboard/tests (list)
├── /dashboard/results (list)
├── /dashboard/results/:id (detail)
└── /dashboard/profile (user)

Test Routes
└── /test/:id (taking)

Admin Routes (Future)
├── /admin/dashboard
├── /admin/users
├── /admin/schools
├── /admin/programs
└── /admin/results

Other Routes
└── /pricing (future)
```

## 📊 Statistics

| Category | Count | Status |
|----------|-------|--------|
| Pages Created | 8 | ✅ Complete |
| Hooks Created | 4 | ✅ Complete |
| Stores Created | 3 | ✅ Complete |
| Type Definitions | 20+ | ✅ Complete |
| Utility Functions | 20+ | ✅ Complete |
| Constants | 50+ | ✅ Complete |
| Components to Create | 15+ | 🔄 Pending |
| Documentation Files | 4 | ✅ Complete |

## 🎨 Styling Approach

```
Tailwind CSS
├── Utility classes
├── Custom color palette (primary, danger, success, warning)
├── Responsive design (mobile-first)
├── Dark mode support (future)
└── Animation utilities
```

## 🔄 Version Control

```
frontend/
├── .git/
├── .gitignore (excludes node_modules, .env.local, etc.)
└── Files tracked in Git
    ├── Source code
    ├── Configuration files
    ├── Documentation
    └── Package files
```

---

**Total Files**: ~40 source files + 4 documentation files
**Total Lines of Code**: ~3,500+ (including types, hooks, pages)
**Frontend Status**: Core structure complete, ready for components
