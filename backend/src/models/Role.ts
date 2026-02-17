import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission {
  name: string;
  description: string;
  resource: string; // 'users', 'schools', 'tests', 'subscriptions', etc.
  action: string; // 'create', 'read', 'update', 'delete'
}

export interface IRole extends Document {
  name: string; // 'admin', 'counselor', 'student', 'parent'
  displayName: string;
  description: string;
  permissions: IPermission[];
  isSystem: boolean; // Cannot be deleted if true
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
    lowercase: true,
  },
  action: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['create', 'read', 'update', 'delete'],
  },
});

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    permissions: [permissionSchema],
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });

// Virtual to check if role has specific permission
roleSchema.methods.hasPermission = function (
  resource: string,
  action: string
): boolean {
  return this.permissions.some(
    (perm: IPermission) =>
      perm.resource === resource.toLowerCase() &&
      perm.action === action.toLowerCase()
  );
};

export const Role = mongoose.model<IRole>('Role', roleSchema);
