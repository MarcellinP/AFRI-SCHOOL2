import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  role: 'student' | 'parent' | 'counselor' | 'admin';
  subscriptionPlan: 'free' | 'premium' | 'pro';
  stripeCustomerId?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Ne pas retourner le mot de passe par défaut
    },
    phone: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'parent', 'counselor', 'admin'],
        message: 'Role must be one of: student, parent, counselor, admin',
      },
      default: 'student',
    },
    subscriptionPlan: {
      type: String,
      enum: {
        values: ['free', 'premium', 'pro'],
        message: 'Plan must be one of: free, premium, pro',
      },
      default: 'free',
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false, // Ne pas retourner isActive par défaut
    },
    lastLogin: {
      type: Date,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.isActive;
        return ret;
      },
    },
  }
);

// Index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
