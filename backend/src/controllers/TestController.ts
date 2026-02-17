import { Request, Response } from 'express';
import { Test } from '../models/Test';
import { TestService } from '../services/TestService';
import { catchAsync } from '../middlewares/errorHandler';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import logger from '../utils/logger';

export class TestController {
  /**
   * List all tests with filtering
   * GET /api/tests
   */
  static listTests = catchAsync(async (req: Request, res: Response) => {
    const { category, difficulty, subcategory, skip = 0, limit = 10 } =
      req.query;

    const result = await TestService.listTests({
      category: String(category || ''),
      difficulty: String(difficulty || ''),
      subcategory: String(subcategory || ''),
      skip: Number(skip),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      message: 'Tests retrieved successfully',
      data: result,
    });
  });

  /**
   * Get test details with questions
   * GET /api/tests/:id
   */
  static getTestById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const test = await TestService.getTestById(id);

    res.status(200).json({
      success: true,
      message: 'Test retrieved successfully',
      data: { test },
    });
  });

  /**
   * Get test questions for taking the test
   * GET /api/tests/:id/questions
   */
  static getTestQuestions = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const testData = await TestService.getTestQuestions(id);

    res.status(200).json({
      success: true,
      message: 'Test questions retrieved successfully',
      data: testData,
    });
  });

  /**
   * Create new test (Admin only)
   * POST /api/tests
   */
  static createTest = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const {
      title,
      description,
      category,
      subcategories,
      difficulty,
      duration,
      totalPoints,
      questions,
      passingScore,
    } = req.body;

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestError('At least one question is required');
    }

    // Verify total points matches questions
    const questionsTotalPoints = questions.reduce(
      (sum: number, q: any) => sum + q.points,
      0
    );

    if (questionsTotalPoints !== totalPoints) {
      throw new BadRequestError(
        `Total points (${questionsTotalPoints}) must match sum of question points (${totalPoints})`
      );
    }

    const testData = {
      title,
      description,
      category,
      subcategories,
      difficulty,
      duration,
      totalPoints,
      questions,
      passingScore,
      createdBy: req.user.userId,
    };

    const test = await TestService.createTest(testData);

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: { test },
    });
  });

  /**
   * Update test (Admin only)
   * PUT /api/tests/:id
   */
  static updateTest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    // If questions updated, verify total points
    if (updates.questions && updates.totalPoints) {
      const questionsTotalPoints = updates.questions.reduce(
        (sum: number, q: any) => sum + q.points,
        0
      );

      if (questionsTotalPoints !== updates.totalPoints) {
        throw new BadRequestError(
          'Total points must match sum of question points'
        );
      }
    }

    const test = await TestService.updateTest(id, updates);

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      data: { test },
    });
  });

  /**
   * Delete test (Admin only)
   * DELETE /api/tests/:id
   */
  static deleteTest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const test = await TestService.deleteTest(id);

    logger.info(`Test deleted: ${test.title} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully',
    });
  });

  /**
   * Get test statistics (Admin)
   * GET /api/tests/stats/overview
   */
  static getTestStats = catchAsync(async (req: Request, res: Response) => {
    const testCount = await Test.countDocuments({ isActive: true });
    const categoryBreakdown = await Test.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Test statistics retrieved',
      data: {
        totalTests: testCount,
        categoryBreakdown,
      },
    });
  });
}
