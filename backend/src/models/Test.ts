import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  _id?: string;
  text: string;
  type: 'MultipleChoice' | 'TrueFalse';
  category: string; // Science, Math, Verbal, etc
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: IQuestionOption[];
  correctOptionIndex: number;
  points: number;
  explanation?: string;
}

export interface IQuestionOption {
  _id?: string;
  text: string;
}

export interface ITest extends Document {
  title: string;
  description: string;
  category: string; // Main category
  subcategories: string[]; // Science, Math, Verbal, Spatial, Logic
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // Minutes
  totalPoints: number;
  questions: IQuestion[];
  passingScore: number; // Percentage
  isActive: boolean;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  text: {
    type: String,
    required: [true, 'Question text is required'],
  },
  type: {
    type: String,
    enum: {
      values: ['MultipleChoice', 'TrueFalse'],
      message: 'Question type must be MultipleChoice or TrueFalse',
    },
    default: 'MultipleChoice',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  difficulty: {
    type: String,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Difficulty must be Easy, Medium, or Hard',
    },
    default: 'Medium',
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: [true, 'Correct option index is required'],
    min: 0,
  },
  points: {
    type: Number,
    required: [true, 'Points is required'],
    min: 1,
    max: 100,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const testSchema = new Schema<ITest>(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Main category is required'],
      enum: {
        values: ['Aptitude', 'Subject', 'Career'],
        message: 'Category must be Aptitude, Subject, or Career',
      },
    },
    subcategories: [
      {
        type: String,
        enum: [
          'Verbal',
          'Numerical',
          'Logical',
          'Spatial',
          'Abstract',
          'Science',
          'Math',
          'English',
          'French',
          'Arabic',
          'Interests',
          'Strengths',
        ],
      },
    ],
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Difficulty must be Easy, Medium, or Hard',
      },
      default: 'Medium',
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 5,
      max: 480, // Max 8 hours
    },
    totalPoints: {
      type: Number,
      required: [true, 'Total points is required'],
      min: 10,
      max: 1000,
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      required: [true, 'Passing score is required'],
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indices
testSchema.index({ category: 1 });
testSchema.index({ difficulty: 1 });
testSchema.index({ subcategories: 1 });
testSchema.index({ isActive: 1 });
testSchema.index({ createdAt: -1 });

export const Test = mongoose.model<ITest>('Test', testSchema);
