import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  description: string;
  abbreviation: string;
  location: string; // City
  country: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string; // URL
  schoolType: string; // Public, Private, International
  accreditation?: string[];
  programs: string[]; // References to Program IDs
  studentCapacity: number;
  establishedYear: number;
  ranking?: number; // World ranking
  averageFees?: number; // Per year
  admissionRate?: number; // Percentage
  isActive: boolean;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'School description is required'],
    },
    abbreviation: {
      type: String,
      required: [true, 'School abbreviation is required'],
      uppercase: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'Location (city) is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    website: {
      type: String,
      sparse: true,
    },
    logo: {
      type: String,
      sparse: true,
    },
    schoolType: {
      type: String,
      enum: {
        values: ['Public', 'Private', 'International'],
        message: 'School type must be Public, Private, or International',
      },
      default: 'Private',
    },
    accreditation: [String],
    programs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Program',
      },
    ],
    studentCapacity: {
      type: Number,
      required: [true, 'Student capacity is required'],
      min: 1,
    },
    establishedYear: {
      type: Number,
      required: [true, 'Established year is required'],
      min: 1800,
      max: new Date().getFullYear(),
    },
    ranking: Number,
    averageFees: Number,
    admissionRate: {
      type: Number,
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

// Indexes for performance
schoolSchema.index({ name: 1 });
schoolSchema.index({ country: 1 });
schoolSchema.index({ location: 1 });
schoolSchema.index({ isActive: 1 });
schoolSchema.index({ createdAt: -1 });
schoolSchema.index({ schoolType: 1 });

export const School = mongoose.model<ISchool>('School', schoolSchema);
