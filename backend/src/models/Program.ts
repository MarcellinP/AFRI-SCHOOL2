import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  name: string;
  description: string;
  abbreviation: string;
  field: string; // Domain (Science, Arts, Business, etc.)
  level: string; // Bachelor, Master, PhD
  duration: number; // in years
  schools: string[]; // References to school IDs
  requiredSkills: string[];
  careerOutlook: string;
  averageSalary?: number;
  isActive: boolean;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    name: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Program description is required'],
    },
    abbreviation: {
      type: String,
      required: [true, 'Program abbreviation is required'],
      uppercase: true,
      unique: true,
    },
    field: {
      type: String,
      required: [true, 'Field is required'],
      enum: ['Science', 'Arts', 'Business', 'Engineering', 'Health', 'Social Studies', 'Other'],
    },
    level: {
      type: String,
      required: [true, 'Education level is required'],
      enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'],
      default: 'Bachelor',
    },
    duration: {
      type: Number,
      required: [true, 'Program duration is required'],
      min: 1,
      max: 10,
    },
    schools: [
      {
        type: Schema.Types.ObjectId,
        ref: 'School',
      },
    ],
    requiredSkills: [String],
    careerOutlook: {
      type: String,
      enum: ['Growing', 'Stable', 'Declining', 'Unknown'],
      default: 'Stable',
    },
    averageSalary: Number,
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

// Indexes
programSchema.index({ name: 1 });
programSchema.index({ field: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ createdAt: -1 });

export const Program = mongoose.model<IProgram>('Program', programSchema);
