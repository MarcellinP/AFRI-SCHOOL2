/**
 * Database Seed Script
 * Run this file to initialize the database with default roles and admin user
 *
 * Usage: npm run seed
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { DEFAULT_ROLES } from '../config/permissions';
import logger from '../utils/logger';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectDB();
    logger.info('✅ MongoDB connected\n');

    // Seed roles
    logger.info('Seeding roles...');
    const existingRoles = await Role.countDocuments({});

    if (existingRoles === 0) {
      const rolesToCreate = Object.values(DEFAULT_ROLES);
      const createdRoles = await Role.insertMany(rolesToCreate);

      console.log(`✅ Created ${createdRoles.length} roles:`);
      createdRoles.forEach((role: any) => {
        console.log(`   - ${role.displayName} (${role.name})`);
      });
    } else {
      console.log(`✅ Roles already exist (${existingRoles} found), skipping...\n`);
    }

    // Seed admin user
    logger.info('Checking for admin user...');
    const adminEmail = 'admin@afri-school.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      logger.info('Creating admin user...');

      adminUser = new User({
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'AFRI-SCHOOL',
        password: 'AdminPassword123', // This will be hashed by the pre-save hook
        role: 'admin',
        subscriptionPlan: 'pro',
        isEmailVerified: true,
        isActive: true,
      });

      await adminUser.save();

      console.log('✅ Admin user created:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: AdminPassword123`);
      console.log(`   ⚠️  IMPORTANT: Change this password immediately in production!\n`);
    } else {
      console.log(`✅ Admin user already exists\n`);
    }

    // Display summary
    console.log('════════════════════════════════════════');
    console.log('🎉 Database seed completed successfully!');
    console.log('════════════════════════════════════════\n');

    console.log('📊 Summary:');
    const totalRoles = await Role.countDocuments({});
    const totalUsers = await User.countDocuments({});

    console.log(`   • Roles: ${totalRoles}`);
    console.log(`   • Users: ${totalUsers}`);
    console.log(`\n🚀 You can now start the application!\n`);

    await mongoose.disconnect();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed error:', error);
    console.error(error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
