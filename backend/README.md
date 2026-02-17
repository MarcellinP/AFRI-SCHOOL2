# Backend README

Backend API for AFRI-SCHOOL platform built with Node.js, Express, and TypeScript.

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Development mode
npm run dev

# Build for production
npm build

# Run production build
npm start
```

## 📁 Directory Structure

```
src/
├── app.ts                 # Express app entry point
├── controllers/           # Route handlers
├── services/              # Business logic layer
├── routes/                # API route definitions
├── middlewares/           # Custom middlewares
├── validators/            # Input validation schemas
├── models/                # Mongoose schemas
├── utils/                 # Helper utilities
├── config/                # Configuration
└── types/                 # TypeScript types
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete account

### Tests
- `GET /api/tests` - List all tests
- `GET /api/tests/:id` - Get test details
- `POST /api/tests/:id/submit` - Submit test answers

### Schools
- `GET /api/schools` - List schools
- `GET /api/schools/:id` - Get school details
- `POST /api/schools` - Create school (admin only)

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/checkout` - Create checkout session
- `POST /api/subscriptions/webhook` - Stripe webhook

## 🔐 Environment Variables

See `.env.example` for required environment variables.

## 🗄️ Database

MongoDB is used as the primary database. Ensure MongoDB is running and `MONGODB_URI` is set in `.env`.

## 💾 Caching

Redis is used for caching and session management. Ensure Redis is running and `REDIS_URL` is set in `.env`.

## 🔑 Authentication

JWT tokens are used for authentication:
- Access token: 15 minutes
- Refresh token: 7 days

Tokens are stored in HTTP-only cookies for security.

## 🎨 Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Clean Architecture principles

## 📝 Logging

Winston is used for structured logging:
- Console output in development
- File-based logging in production
- Error logs in `logs/error.log`
- Combined logs in `logs/combined.log`

## 🚀 Production Checklist

- [ ] Update all environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure monitoring/alerting
- [ ] Review security headers
- [ ] Test payment flow
- [ ] Setup logging aggregation
