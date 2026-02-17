import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  points: number;
  categoryScore?: number; // Score for this category
}

export interface ICategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface IRecommendation {
  programId: string;
  programName: string;
  matchScore: number; // 0-100%
  reason: string;
  strengths: string[]; // Why student is suited
  weaknesses: string[]; // What to improve
}

export interface IResult extends Document {
  testId: string; // Ref: Test
  studentId: string; // Ref: User
  answers: IStudentAnswer[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: 'Passed' | 'Failed';
  categoryScores: ICategoryScore[];
  recommendations: IRecommendation[];
  startTime: Date;
  endTime: Date;
  timeSpent: number; // Seconds
  attemptNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const studentAnswerSchema = new Schema<IStudentAnswer>({
  questionId: {
    type: String,
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 0,
  },
  categoryScore: Number,
});

const categoryScoreSchema = new Schema<ICategoryScore>({
  category: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});

const recommendationSchema = new Schema<IRecommendation>({
  programId: {
    type: String,
    required: true,
  },
  programName: {
    type: String,
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  reason: {
    type: String,
    required: true,
  },
  strengths: [String],
  weaknesses: [String],
});

const resultSchema = new Schema<IResult>(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [studentAnswerSchema],
    totalScore: {
      type: Number,
      required: true,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['Passed', 'Failed'],
        message: 'Status must be Passed or Failed',
      },
      default: 'Failed',
    },
    categoryScores: [categoryScoreSchema],
    recommendations: [recommendationSchema],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
      default: 0,
    },
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indices
resultSchema.index({ studentId: 1, createdAt: -1 });
resultSchema.index({ testId: 1 });
resultSchema.index({ status: 1 });
resultSchema.index({ percentage: 1 });
resultSchema.index({ 'categoryScores.category': 1 });

export const Result = mongoose.model<IResult>('Result', resultSchema);
