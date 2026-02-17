import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { catchAsync } from '../middlewares/errorHandler';
import { BadRequestError } from '../utils/AppError';
import logger from '../utils/logger';

export class AuthController {
  /**
   * Register endpoint - POST /api/auth/register
   */
  static register = catchAsync(async (req: Request, res: Response) => {
    // 🔥 DIAGNOSTIC LOG - Show EXACTLY what frontend sends
    console.log('[AuthController.register] Raw req.body:', JSON.stringify(req.body, null, 2));
    
    const { email, firstName, lastName, password, role = 'student' } = req.body;
    
    console.log('[AuthController.register] Extracted fields:', { email, firstName, lastName, password, role });

    const result = await AuthService.register(
      email,
      firstName,
      lastName,
      password,
      role
    );

    console.log('[AuthController.register] Registration successful, sending response...');

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        // Don't send refreshToken in body, it's in cookie
      },
    });

    console.log('[AuthController.register] Response sent successfully');
  });

  /**
   * Login endpoint - POST /api/auth/login
   */
  static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        // Don't send refreshToken in body, it's in cookie
      },
    });
  });

  /**
   * Refresh token endpoint - POST /api/auth/refresh
   */
  static refreshToken = catchAsync(async (req: Request, res: Response) => {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new BadRequestError('Refresh token not found');
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
        // Don't send refreshToken in body, it's in cookie
      },
    });
  });

  /**
   * Logout endpoint - POST /api/auth/logout
   */
  static logout = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    await AuthService.logout(req.user.userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  });

  /**
   * Get current user - GET /api/auth/me
   */
  static getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const user = await AuthService.getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: { user },
    });
  });
}
