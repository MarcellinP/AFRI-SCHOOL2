# 🚀 AFRI-SCHOOL Frontend - Quick Start Guide

Get started with AFRI-SCHOOL frontend in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Quick Navigation

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/auth/login` | User login |
| `/auth/register` | User registration |
| `/dashboard` | Main dashboard |
| `/dashboard/tests` | Available tests |
| `/dashboard/results` | Test results |
| `/test/:id` | Take a test |

## 🎯 Common Tasks

### Create a Login Form
```tsx
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-600">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### Fetch Tests
```tsx
'use client';
import { useTest } from '@/hooks/useTest';
import { useEffect } from 'react';

export default function TestsList() {
  const { tests, fetchTests, isLoading } = useTest();

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading tests...</p>
      ) : (
        <div>
          {tests.map((test) => (
            <div key={test.id}>
              <h3>{test.title}</h3>
              <p>{test.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Take a Test
```tsx
'use client';
import { useTest } from '@/hooks/useTest';
import { useRouter } from 'next/navigation';

export default function TakeTest({ testId }: { testId: string }) {
  const { submitTest, isLoading } = useTest();
  const router = useRouter();

  const handleSubmit = async () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 },
      { questionId: 'q2', selectedOptionIndex: 1 },
    ];

    const result = await submitTest(testId, answers);
    if (result) {
      router.push('/dashboard/results');
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isLoading}
    >
      {isLoading ? 'Submitting...' : 'Submit Test'}
    </button>
  );
}
```

### Check User Authentication
```tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

## 🎨 Styling Examples

### Full Width Button
```tsx
<button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg">
  Click me
</button>
```

### Card Layout
```tsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### Grid Layout
```tsx
<div className="grid md:grid-cols-3 gap-6">
  <div className="bg-white rounded-lg shadow p-6">Item 1</div>
  <div className="bg-white rounded-lg shadow p-6">Item 2</div>
  <div className="bg-white rounded-lg shadow p-6">Item 3</div>
</div>
```

### Loading Spinner
```tsx
<div className="flex justify-center">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
</div>
```

## 🔌 API Usage

### Simple GET Request
```typescript
import { apiClient } from '@/lib/api-client';

const response = await apiClient.get('/tests');
if (response.success) {
  console.log(response.data); // Tests array
} else {
  console.error(response.message);
}
```

### POST Request with Data
```typescript
const response = await apiClient.post('/results/submit', {
  testId: '123',
  answers: [...]
});
```

### Error Handling
```typescript
try {
  const response = await apiClient.get('/tests');
} catch (error) {
  const message = ErrorUtils.getErrorMessage(error);
  console.error('Failed:', message);
}
```

## 🧩 Component Examples

### Form Input with Error
```tsx
<div>
  <label className="block text-sm font-medium mb-2">
    Email
  </label>
  <input
    type="email"
    className={`w-full px-4 py-2 border rounded-lg ${
      error ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
</div>
```

### Success/Error Messages
```tsx
{successMessage && (
  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
    {successMessage}
  </div>
)}

{errorMessage && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
    {errorMessage}
  </div>
)}
```

## 📊 Useful Hooks

### useAuth - Authentication
```typescript
const {
  user,              // Current user
  token,             // JWT token
  isAuthenticated,   // Boolean
  isLoading,         // Loading state
  error,             // Error message
  login,             // Login function
  register,          // Register function
  logout             // Logout function
} = useAuth();
```

### useTest - Test Management
```typescript
const {
  tests,             // Available tests
  currentTest,       // Current test
  testHistory,       // User's results
  isLoading,         // Loading state
  error,             // Error message
  fetchTests,        // Fetch tests
  getTest,           // Get specific test
  submitTest         // Submit test
} = useTest();
```

### useForm - Form Management
```typescript
const {
  values,            // Form values
  errors,            // Form errors
  handleChange,      // Input handler
  handleSubmit,      // Submit handler
  setFieldValue      // Set field value
} = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => { /* ... */ }
});
```

## 🧪 Testing Workflow

1. **Go to Dashboard**
   - Navigate to `/dashboard`

2. **View Available Tests**
   - Click "Available Tests"
   - See list of tests

3. **Start a Test**
   - Click on a test
   - Answer questions
   - Track progress

4. **Submit Test**
   - Review answers
   - Click "Submit"
   - View results

5. **See Results**
   - View score and category breakdown
   - See recommended programs

## 📁 Key Files to Edit

- **Add new page**: `src/app/[name]/page.tsx`
- **Add component**: `src/components/[Name].tsx`
- **Add hook**: `src/hooks/use[Feature].ts`
- **Add utility**: `src/utils/[feature].ts`
- **Update types**: `src/types/index.ts`
- **Update constants**: `src/constants/index.ts`

## 🚀 Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 📚 Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start prod server

# Code Quality
npm run lint         # Run linter
npm run type-check   # Check types

# Formatting
npm run format       # Format code
npm run format:check # Check formatting
```

## 🐛 Common Issues

### "Cannot find module '@/...'"
- Check TypeScript path aliases in `tsconfig.json`
- Restart dev server

### Token expired error
- Token refresh is automatic
- Check API is running
- Clear localStorage and login again

### Page shows "Not authenticated"
- Check if backend is running
- Verify API URL in `.env.local`
- Try logging in again

## 🔗 More Resources

- [Main Setup Guide](./FRONTEND_SETUP.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Backend API Docs](../backend/docs/API.md)

## 💡 Tips

1. **Use TypeScript** - Catch errors before runtime
2. **Check auth state** - Use `useAuth()` hook
3. **Handle loading** - Show spinner while fetching
4. **Show errors** - Display error messages to users
5. **Use constants** - Don't hardcode values

---

Happy coding! 🎉
