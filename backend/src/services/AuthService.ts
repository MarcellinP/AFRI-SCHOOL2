import { User, IUser } from '../models/User';
import { JwtService } from '../utils/jwt';
import { AppError, BadRequestError, ConflictError, UnauthorizedError } from '../utils/AppError';
import { redisClient } from '../config/redis';
import logger from '../utils/logger';

export interface ILoginResponse {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterResponse {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: string = 'student'
  ): Promise<IRegisterResponse> {
    try {
      // 🔥 DIAGNOSTIC LOG
      console.log('[AuthService.register] Received:', { email, firstName, lastName, password, role });

      // ✅ STRONG VALIDATION
      if (!email || !firstName || !lastName || !password) {
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!password) missingFields.push('password');
        
        logger.warn(`[AuthService.register] Missing fields: ${missingFields.join(', ')}`);
        throw BadRequestError(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw ConflictError('Email already registered');
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        firstName,
        lastName,
        password,
        role,
        subscriptionPlan: 'free',
      });

      await user.save();
      logger.info(`User registered: ${email}`);

      // Generate tokens
      const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = JwtService.generateTokens(payload);

      // Store refresh token in Redis
      await this.storeRefreshToken(
        user._id.toString(),
        tokens.refreshToken
      );

      // Return user data without password
      const userResponse = user.toJSON() as Omit<IUser, 'password'>;
      
      return {
        user: userResponse,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Register error:', error);
      throw new AppError('Registration failed');
    }
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<ILoginResponse> {
    try {
      // Find user and get password field
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        '+password +isActive'
      );

      if (!user) {
        throw UnauthorizedError('Invalid email or password');
      }

      if (!user.isActive) {
        throw UnauthorizedError('Account is inactive');
      }

      // Compare passwords
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw UnauthorizedError('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in: ${email}`);

      // Generate tokens
      const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = JwtService.generateTokens(payload);

      // Store refresh token in Redis
      await this.storeRefreshToken(
        user._id.toString(),
        tokens.refreshToken
      );

      // Return user data without password
      const userResponse = user.toJSON() as Omit<IUser, 'password'>;

      return {
        user: userResponse,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Login error:', error);
      throw new AppError('Login failed');
    }
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = JwtService.verifyRefreshToken(refreshToken);

      // Check if refresh token exists in Redis
      const storedToken = await redisClient.get(
        `refresh_token:${payload.userId}`
      );

      if (!storedToken || storedToken !== refreshToken) {
        throw UnauthorizedError('Invalid refresh token');
      }

      // Get updated user info
      const user = await User.findById(payload.userId);
      if (!user || !user.isActive) {
        throw UnauthorizedError('User not found or inactive');
      }

      // Generate new tokens
      const newPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = JwtService.generateTokens(newPayload);

      // Update refresh token in Redis
      await this.storeRefreshToken(
        user._id.toString(),
        tokens.refreshToken
      );

      logger.info(`Token refreshed for user: ${user.email}`);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Token refresh error:', error);
      throw UnauthorizedError('Failed to refresh token');
    }
  }

  /**
   * Logout user
   */
  static async logout(userId: string): Promise<void> {
    try {
      // Remove refresh token from Redis
      await redisClient.del(`refresh_token:${userId}`);
      logger.info(`User logged out: ${userId}`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw new AppError('Logout failed');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Store refresh token in Redis
   */
  private static async storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const refreshExpireSeconds = 7 * 24 * 60 * 60; // 7 days
    await redisClient.setEx(
      `refresh_token:${userId}`,
      refreshExpireSeconds,
      refreshToken
    );
  }
}
