// User types
export enum UserRole {
  STUDENT = 'STUDENT',
  ADVISOR = 'ADVISOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  subscription?: ISubscription;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  user?: IUser;
  token?: string;
  refreshToken?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// School types
export interface ISchool {
  id: string;
  name: string;
  description: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  programs: IProgram[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// Program types
export interface IProgram {
  id: string;
  name: string;
  description: string;
  school: ISchool | string;
  duration: number;
  level: 'BACHELOR' | 'MASTER' | 'DIPLOMA' | 'CERTIFICATE';
  categories: string[];
  requiredSkills?: string[];
  tuition?: number;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

// Test types
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  RATING = 'RATING',
}

export interface IOption {
  id: string;
  text: string;
  category?: string;
}

export interface IQuestion {
  id: string;
  text: string;
  type: QuestionType;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options: IOption[];
  correctOptionIndex?: number;
  points?: number;
}

export interface ITest {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  questions: IQuestion[];
  duration: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}

// Answer types
export interface IStudentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  selectedCategory?: string;
  isCorrect?: boolean;
  points?: number;
}

// Result & Scoring types
export interface ICategoryScore {
  category: string;
  score: number;
  percentage: number;
  maxScore: number;
}

export interface IRecommendation {
  programId: string;
  program: IProgram;
  matchPercentage: number;
  matchedCategories: string[];
  reasoning: string;
}

export interface ITestResult {
  id: string;
  studentId: string;
  testId: string;
  test: ITest;
  answers: IStudentAnswer[];
  totalScore: number;
  totalPercentage: number;
  categoryScores: ICategoryScore[];
  recommendations: IRecommendation[];
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
  startedAt: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface ISubscription {
  id: string;
  userId: string;
  planType: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form validation types
export interface IFormError {
  field: string;
  message: string;
}

// UI State types
export interface ILoading {
  [key: string]: boolean;
}

export interface IError {
  [key: string]: string;
}
