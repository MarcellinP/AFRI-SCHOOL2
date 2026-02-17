# AFRI-SCHOOL Frontend - Complete Setup Guide

## 📋 Overview

AFRI-SCHOOL Frontend is a modern Next.js 14 application built with React 18, TypeScript, and Tailwind CSS. It provides a complete student orientation platform where users can take tests and receive personalized school recommendations.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── auth/
│   │   │   ├── login/page.tsx    # Login page
│   │   │   └── register/page.tsx # Registration page
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   ├── tests/page.tsx    # Available tests
│   │   │   └── results/page.tsx  # Test results
│   │   ├── test/
│   │   │   └── [id]/page.tsx     # Test taking interface
│   │   └── admin/                # Admin pages (future)
│   ├── components/               # Reusable React components
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useTest.ts            # Test management hook
│   │   ├── useSubscription.ts    # Subscription hook
│   │   └── useForm.ts            # Form management hook
│   ├── lib/                      # Utility libraries
│   │   └── api-client.ts         # API client with interceptors
│   ├── store/                    # Zustand state management
│   │   ├── auth.store.ts         # Auth state
│   │   ├── test.store.ts         # Test state
│   │   └── subscription.store.ts # Subscription state
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # All shared types
│   ├── utils/                    # Utility functions
│   │   └── index.ts              # All utilities
│   ├── constants/                # Application constants
│   │   └── index.ts              # Routes, messages, validation
│   └── styles/                   # Global styles
│       └── globals.css           # Tailwind & global CSS
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: v20+)
- npm or yarn
- Backend API running on `http://localhost:3001/api`

### Installation

1. **Clone the repository**

```bash
cd frontend
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=AFRI-SCHOOL
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. **Run development server**

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📦 Key Technologies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation

## 🔐 Authentication Flow

The application implements JWT-based authentication:

1. **User Registration**
   - Form validation using Zod schemas
   - Account creation with password hashing
   - Email verification

2. **User Login**
   - JWT token generation
   - Refresh token for token renewal
   - Automatic token refresh on 401 responses

3. **Protected Routes**
   - Authentication check on protected pages
   - Automatic redirect to login if unauthenticated
   - Role-based access control (RBAC)

### useAuth Hook

```typescript
const { 
  user,              // Current user object
  token,             // JWT token
  isAuthenticated,   // Boolean flag
  isLoading,         // Loading state
  error,             // Error message
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  hasRole,           // Check if user has role
  hasPermission      // Check if user has permission
} = useAuth();
```

## 🧪 Test Management

### useTest Hook

```typescript
const {
  tests,                 // Available tests
  currentTest,           // Currently selected test
  currentResult,         // Current test result
  testHistory,           // User's test results
  recommendations,       // Program recommendations
  isLoading,             // Loading state
  error,                 // Error message
  fetchTests,            // Fetch available tests
  getTest,               // Get specific test
  submitTest,            // Submit test answers
  getMyResults,          // Fetch user's results
  getResult,             // Get specific result
  getRecommendations     // Get recommendations
} = useTest();
```

### Test Taking Flow

1. **Fetch Tests** - Get list of available tests
2. **Select Test** - Load specific test
3. **Answer Questions** - Navigate through questions and select answers
4. **Submit Test** - Send answers to backend
5. **View Results** - See score, category breakdown, and recommendations

## 💾 State Management

Zustand stores manage application state:

### Auth Store
- User authentication state
- Token management
- Role/permission checking

### Test Store
- Current test and results
- Test history
- Recommendations

### Subscription Store
- User subscription status
- Plan type (FREE/PREMIUM/ENTERPRISE)
- Subscription actions

## 🎨 UI Components

### Button Component

```tsx
<button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
  Click me
</button>
```

### Form Input

```tsx
<input
  type="email"
  placeholder="Enter email"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
/>
```

### Card Component

```tsx
<div className="bg-white rounded-lg shadow p-6">
  {/* Content */}
</div>
```

## 🔌 API Integration

### Request Structure

```typescript
// GET request
const response = await apiClient.get<TestType>('/tests');

// POST request
const response = await apiClient.post<ResultType>('/results/submit', {
  testId: '123',
  answers: [...]
});

// PUT/PATCH request
const response = await apiClient.put<TestType>(`/tests/${id}`, data);

// DELETE request
const response = await apiClient.delete(`/tests/${id}`);
```

### Response Format

```typescript
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}
```

### Error Handling

```typescript
try {
  const response = await apiClient.post('/tests', testData);
  if (response.success) {
    // Handle success
  } else {
    // Handle API error
    console.error(response.message);
  }
} catch (error) {
  // Handle network error
  const message = ErrorUtils.getErrorMessage(error);
}
```

## 📝 Form Validation

### Using useForm Hook

```typescript
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  onSubmit: async (values) => {
    // Submit form
  },
});
```

### Zod Schema Validation

```typescript
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginData = z.infer<typeof LoginSchema>;
```

## 🎯 Route Structure

- `/` - Home page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Main dashboard
- `/dashboard/tests` - Available tests
- `/dashboard/results` - Test results
- `/test/:id` - Test taking interface
- `/admin/*` - Admin pages (future)

## 🧰 Utility Functions

### Token Management

```typescript
import { TokenManager } from '@/utils';

TokenManager.setToken(token);
TokenManager.getToken();
TokenManager.removeToken();
TokenManager.isTokenExpired(token);
TokenManager.decodeToken(token);
```

### Validation Utils

```typescript
import { ValidationUtils } from '@/utils';

ValidationUtils.isValidEmail(email);
ValidationUtils.isValidPassword(password);
ValidationUtils.isValidPhone(phone);
ValidationUtils.isValidName(name);
```

### Date Utils

```typescript
import { DateUtils } from '@/utils';

DateUtils.formatDate(date);
DateUtils.formatDateTime(date);
DateUtils.formatRelative(date);
DateUtils.isWithinLast24Hours(date);
```

### String Utils

```typescript
import { StringUtils } from '@/utils';

StringUtils.capitalize('hello');      // "Hello"
StringUtils.titleCase('hello world'); // "Hello World"
StringUtils.truncate(str, 50);        // Truncate to 50 chars
StringUtils.slugify('Hello World');   // "hello-world"
StringUtils.getInitials('John', 'Doe'); // "JD"
```

## 🔄 Workflows

### Student Login & Dashboard

```
1. User navigates to /auth/login
2. Enters credentials
3. useAuth.login() sends request
4. Backend returns JWT token
5. Token stored in localStorage
6. Redirect to /dashboard
7. Dashboard fetches user's tests and results
```

### Taking a Test

```
1. Student views /dashboard/tests
2. Fetches available tests
3. Clicks "Start Test"
4. Loads test interface (/test/:id)
5. Student answers questions
6. Submits test
7. Backend calculates scores and recommendations
8. Redirected to results page
9. Views detailed results and recommendations
```

### Viewing Results

```
1. Navigate to /dashboard/results
2. Fetch all test results
3. Click on result to view details
4. See category scores, recommendations
5. Can retake test or view recommended programs
```

## 📊 Component Examples

### Protected Route

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

### Loading State

```tsx
{isLoading ? (
  <div className="flex justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
) : (
  // Content
)}
```

### Conditional Rendering

```tsx
{user?.role === 'ADMIN' && (
  <Link href="/admin/dashboard">Admin Panel</Link>
)}
```

## 🎨 Styling

Tailwind CSS classes are used throughout. Key color variables:

- `primary-600` - Main action color (Sky Blue)
- `danger-500` - Error/Delete operations (Red)
- `success-500` - Success operations (Green)
- `warning-500` - Warning messages (Amber)

### Custom Classes

Define custom classes in `src/styles/globals.css`:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700;
  }
}
```

## 📚 Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App Metadata
NEXT_PUBLIC_APP_NAME=AFRI-SCHOOL
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=false
```

## 🧪 Testing

### Running Tests (Future)

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Testing (Future)

```bash
npm run e2e
npm run e2e:ui
```

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Tailwind breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly interactions
- Adaptive layouts

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the .next folder
```

### Environment Variables for Production

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Production API URL
- `NEXT_PUBLIC_APP_NAME` - App name
- `NEXT_PUBLIC_APP_VERSION` - Version

## 🐛 Troubleshooting

### Token Expiration Issues

If you get 401 errors:
1. Check token in localStorage
2. Verify backend refresh token endpoint
3. Check API base URL in `.env.local`

### Hydration Errors

In client components using auth:
```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
// Component content
```

### API Connection Issues

1. Verify backend is running on `http://localhost:3001`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is enabled in backend

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Copyright 2024 AFRI-SCHOOL. All rights reserved.

---

**Last Updated**: January 2024
**Frontend Version**: 1.0.0
**Next.js Version**: 14.0+
