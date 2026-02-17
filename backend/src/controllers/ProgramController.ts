import { Request, Response } from 'express';
import { Program } from '../models/Program';
import { catchAsync } from '../middlewares/errorHandler';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import logger from '../utils/logger';

export class ProgramController {
  /**
   * List all programs
   * GET /api/programs
   */
  static listPrograms = catchAsync(async (req: Request, res: Response) => {
    const { field, level, skip = 0, limit = 10 } = req.query;

    // Build filter
    const filter: any = { isActive: true };
    if (field) filter.field = field;
    if (level) filter.level = level;

    const programs = await Program.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('schools', 'name')
      .sort({ createdAt: -1 });

    const total = await Program.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Programs retrieved successfully',
      data: {
        programs,
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
   * Get program by ID
   * GET /api/programs/:id
   */
  static getProgramById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const program = await Program.findById(id)
      .populate('schools', 'name location')
      .populate('createdBy', 'firstName lastName email');

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    res.status(200).json({
      success: true,
      message: 'Program retrieved successfully',
      data: { program },
    });
  });

  /**
   * Create program (Admin only)
   * POST /api/programs
   */
  static createProgram = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const {
      name,
      description,
      abbreviation,
      field,
      level,
      duration,
      schools,
      requiredSkills,
      careerOutlook,
      averageSalary,
    } = req.body;

    // Validation
    if (!name || !abbreviation || !field || !level || !duration) {
      throw new BadRequestError('Missing required fields');
    }

    // Check if abbreviation already exists
    const existing = await Program.findOne({
      abbreviation: abbreviation.toUpperCase(),
    });

    if (existing) {
      throw new BadRequestError('Program abbreviation already exists');
    }

    const program = new Program({
      name,
      description,
      abbreviation: abbreviation.toUpperCase(),
      field,
      level,
      duration,
      schools,
      requiredSkills,
      careerOutlook,
      averageSalary,
      createdBy: req.user.userId,
    });

    await program.save();
    logger.info(`Program created: ${program.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: { program },
    });
  });

  /**
   * Update program (Admin only)
   * PUT /api/programs/:id
   */
  static updateProgram = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing these fields
    delete updates._id;
    delete updates.createdBy;
    delete updates.createdAt;

    const program = await Program.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    logger.info(`Program updated: ${program.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: { program },
    });
  });

  /**
   * Delete program (Admin only)
   * DELETE /api/programs/:id
   */
  static deleteProgram = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const { id } = req.params;

    const program = await Program.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    logger.info(`Program deleted: ${program.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
    });
  });
}
