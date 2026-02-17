# AFRI-SCHOOL 🎓

A comprehensive SaaS platform for student orientation and career guidance across Africa.

## 📋 Project Overview

AFRI-SCHOOL helps students post-baccalaureate make informed decisions about:
- Suitable study fields
- Relevant schools and institutions
- Career pathways aligned with their interests and abilities

## 🏗️ Project Structure

```
AFRI-SCHOOL/
├── backend/          # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Express middlewares
│   │   ├── validators/     # Input validation
│   │   ├── models/         # Mongoose schemas
│   │   ├── utils/          # Helper functions
│   │   ├── config/         # Configuration files
│   │   ├── types/          # TypeScript types
│   │   └── app.ts          # Application entry point
│   └── tests/              # Test files
│
└── frontend/         # Next.js 14 + React + Tailwind CSS
    ├── src/
    │   ├── app/            # App Router pages
    │   ├── components/     # React components
    │   ├── lib/            # Utility functions
    │   ├── hooks/          # Custom hooks
    │   ├── context/        # State management
    │   └── styles/         # Global styles
    └── public/             # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database and API keys
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend API.

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Cache**: Redis
- **Authentication**: JWT
- **Payment**: Stripe
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Payment**: Stripe.js

## 🎯 Core Features

### MVP Features
- User authentication (signup/login)
- Student orientation tests
- Intelligent suggestions
- School database
- Subscription management
- Payment processing

### User Roles
- **Student**: Take tests and receive guidance
- **Parent**: Monitor student progress
- **Counselor**: Manage student orientations
- **Admin**: Manage platform content

### Subscription Plans
- **Free**: Basic test access
- **Premium**: Full orientation + suggestions
- **Pro**: Coaching + PDF reports

## 🔒 Security Features

- HTTPS encryption
- JWT authentication
- Password hashing (bcryptjs)
- Rate limiting
- Input validation & sanitization
- Helmet.js for HTTP headers
- CORS configuration
- Stripe webhook validation

## 📊 Database Schema Overview

Key collections:
- `users` - User accounts and profiles
- `schools` - School/institution database
- `fields` - Study fields and specializations
- `tests` - Orientation test questions
- `results` - Student test results
- `subscriptions` - Subscription management

## 🚢 Deployment

### Backend Deployment
- Node.js hosting (Heroku, Railway, Render)
- MongoDB Atlas for database
- Redis Cloud for caching
- Environment variables configuration

### Frontend Deployment
- Vercel (recommended for Next.js)
- Alternative: Netlify, GitHub Pages

## 📝 API Documentation

API endpoints organized by resource:
- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/tests` - Orientation tests
- `/api/schools` - School directory
- `/api/subscriptions` - Subscription management
- `/api/admin` - Admin operations

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for African Students
