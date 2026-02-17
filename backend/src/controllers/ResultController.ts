import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { TestService } from '../services/TestService';
import { ResultService } from '../services/ResultService';
import { catchAsync } from '../middlewares/errorHandler';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import logger from '../utils/logger';

export class ResultController {
  /**
   * Submit test answers and calculate score
   * POST /api/results/submit
   */
  static submitTest = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const { testId, answers, startTime, endTime } = req.body;

    if (!testId || !Array.isArray(answers)) {
      throw new BadRequestError('Test ID and answers array are required');
    }

    // Validate time values
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeSpent = Math.round((end.getTime() - start.getTime()) / 1000); // Seconds

    if (timeSpent < 0) {
      throw new BadRequestError('End time must be after start time');
    }

    // Score the result
    const scoreData = await ResultService.scoreResult(
      testId,
      answers,
      req.user.userId,
      timeSpent
    );

    // Generate recommendations
    scoreData.recommendations =
      await ResultService.generateRecommendations(
        scoreData.categoryScores,
        req.user.userId
      );

    // Save to database
    const result = await ResultService.saveResult(
      testId,
      req.user.userId,
      scoreData,
      start,
      end,
      timeSpent
    );

    logger.info(
      `Test submitted by student ${req.user.email}: ${scoreData.percentage}%`
    );

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        result: {
          _id: result._id,
          testId: result.testId,
          totalScore: result.totalScore,
          maxScore: result.maxScore,
          percentage: result.percentage,
          status: result.status,
          categoryScores: result.categoryScores,
          recommendations: result.recommendations,
          timeSpent: result.timeSpent,
          attemptNumber: result.attemptNumber,
        },
      },
    });
  });

  /**
   * Get student's test results
   * GET /api/results
   */
  static getMyResults = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const { skip = 0, limit = 10 } = req.query;

    const result = await ResultService.getStudentResults(
      req.user.userId,
      Number(skip),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      message: 'Results retrieved successfully',
      data: result,
    });
  });

  /**
   * Get specific result with details
   * GET /api/results/:id
   */
  static getResultById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ResultService.getResultById(id);

    // Check access - only student, counselor, or admin can view
    if (
      req.user?.role !== 'admin' &&
      req.user?.role !== 'counselor' &&
      result.studentId.toString() !== req.user?.userId
    ) {
      throw new BadRequestError('You do not have access to this result');
    }

    res.status(200).json({
      success: true,
      message: 'Result retrieved successfully',
      data: { result },
    });
  });

  /**
   * Get recommendations from result
   * GET /api/results/:id/recommendations
   */
  static getRecommendations = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await Result.findById(id);

    if (!result) {
      throw new NotFoundError('Result not found');
    }

    // Check access
    if (
      req.user?.role !== 'admin' &&
      req.user?.role !== 'counselor' &&
      result.studentId.toString() !== req.user?.userId
    ) {
      throw new BadRequestError('You do not have access to this result');
    }

    const recommendationData = await ResultService.getRecommendations(id);

    res.status(200).json({
      success: true,
      message: 'Recommendations retrieved successfully',
      data: recommendationData,
    });
  });

  /**
   * Get student statistics
   * GET /api/results/stats/me
   */
  static getMyStats = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const stats = await ResultService.getStudentStatistics(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: { statistics: stats },
    });
  });

  /**
   * Get all results (Counselor/Admin only)
   * GET /api/results/admin/all
   */
  static getAllResults = catchAsync(async (req: Request, res: Response) => {
    const { studentId, testId, status, skip = 0, limit = 20 } = req.query;

    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (testId) filter.testId = testId;
    if (status) filter.status = status;

    const results = await Result.find(filter)
      .populate('testId', 'title category')
      .populate('studentId', 'firstName lastName email')
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Result.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Results retrieved successfully',
      data: {
        results,
        pagination: {
          total,
          skip: Number(skip),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  });

  /**
   * Get result analysis with detailed breakdown
   * GET /api/results/:id/analysis
   */
  static getAnalysis = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await Result.findById(id)
      .populate('testId')
      .populate('studentId', 'firstName lastName');

    if (!result) {
      throw new NotFoundError('Result not found');
    }

    // Check access
    if (
      req.user?.role !== 'admin' &&
      req.user?.role !== 'counselor' &&
      result.studentId.toString() !== req.user?.userId
    ) {
      throw new BadRequestError('You do not have access to this result');
    }

    res.status(200).json({
      success: true,
      message: 'Analysis retrieved successfully',
      data: {
        result: {
          percentage: result.percentage,
          status: result.status,
          categoryScores: result.categoryScores,
          recommendations: result.recommendations,
          timeSpent: result.timeSpent,
          attemptNumber: result.attemptNumber,
          topStrengths: result.categoryScores
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3),
          areasToImprove: result.categoryScores
            .sort((a, b) => a.percentage - b.percentage)
            .slice(0, 2),
        },
      },
    });
  });
}
