# Frontend README

Frontend application for AFRI-SCHOOL platform built with Next.js 14 and React.

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📁 Directory Structure

```
src/
├── app/                   # Next.js App Router
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
├── lib/                   # Utilities (API client, helpers)
├── hooks/                 # Custom React hooks
├── context/              # State management (Zustand)
├── styles/               # Global CSS & Tailwind config
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Global styles in `src/styles/globals.css`
- Configuration in `tailwind.config.js`

## 📡 API Integration

- Axios client configured in `src/lib/api.ts`
- Automatic token injection in headers
- Auto-logout on 401 errors
- Base URL from `NEXT_PUBLIC_API_URL` env variable

## 🔐 Authentication

- JWT tokens stored in localStorage
- Protected routes with authentication checks
- Auto-redirect to login on token expiry

## 💳 Payment Integration

- Stripe integration for subscriptions
- Checkout flow implementation
- Plan selection UI

## 🧠 State Management

Zustand is used for lightweight state management:
- Auth store for user state
- Easy-to-use API
- No boilerplate

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly UI components

## 🚀 Deployment

Recommended deployment platform: Vercel

```bash
# Deploy to Vercel
npm i -g vercel
vercel
```

## 📝 Environment Variables

See `.env.example` for required variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe public key
- `NEXT_PUBLIC_APP_NAME` - Application name

## 🧪 Testing

```bash
npm run test
```

## 📦 Performance Optimization

- Image optimization with Next.js Image
- Code splitting and lazy loading
- CSS purging with Tailwind
- Server-side rendering where applicable

## 🔍 Best Practices

- Component composition over inheritance
- Custom hooks for logic reuse
- TypeScript for type safety
- Environment variables for configuration
- Proper error handling and user feedback
