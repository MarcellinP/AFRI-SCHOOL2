import { Request, Response } from 'express';
import { School } from '../models/School';
import { catchAsync } from '../middlewares/errorHandler';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/AppError';
import logger from '../utils/logger';

export class SchoolController {
  /**
   * List all schools with filtering and pagination
   * GET /api/schools
   */
  static listSchools = catchAsync(async (req: Request, res: Response) => {
    const {
      country,
      schoolType,
      search,
      skip = 0,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter
    const filter: any = { isActive: true };
    if (country) filter.country = country;
    if (schoolType) filter.schoolType = schoolType;

    // Search in name, description, location
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[String(sortBy)] = sortOrder === 'asc' ? 1 : -1;

    const schools = await School.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('programs', 'name abbreviation field')
      .populate('createdBy', 'firstName lastName')
      .sort(sort);

    const total = await School.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: {
        schools,
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
   * Get school by ID
   * GET /api/schools/:id
   */
  static getSchoolById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const school = await School.findById(id)
      .populate('programs')
      .populate('createdBy', 'firstName lastName email');

    if (!school) {
      throw new NotFoundError('School not found');
    }

    res.status(200).json({
      success: true,
      message: 'School retrieved successfully',
      data: { school },
    });
  });

  /**
   * Create school (Admin only)
   * POST /api/schools
   */
  static createSchool = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const {
      name,
      description,
      abbreviation,
      location,
      country,
      email,
      phone,
      website,
      logo,
      schoolType,
      accreditation,
      studentCapacity,
      establishedYear,
      ranking,
      averageFees,
      admissionRate,
    } = req.body;

    // Check if abbreviation already exists
    const existingByAbbr = await School.findOne({
      abbreviation: abbreviation.toUpperCase(),
    });

    if (existingByAbbr) {
      throw new ConflictError('School abbreviation already exists');
    }

    // Check if name already exists
    const existingByName = await School.findOne({ name });

    if (existingByName) {
      throw new ConflictError('School name already exists');
    }

    const school = new School({
      name,
      description,
      abbreviation: abbreviation.toUpperCase(),
      location,
      country,
      email: email.toLowerCase(),
      phone,
      website,
      logo,
      schoolType,
      accreditation,
      studentCapacity,
      establishedYear,
      ranking,
      averageFees,
      admissionRate,
      createdBy: req.user.userId,
    });

    await school.save();
    logger.info(`School created: ${school.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: { school },
    });
  });

  /**
   * Update school (Admin only)
   * PUT /api/schools/:id
   */
  static updateSchool = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing these fields
    delete updates._id;
    delete updates.createdBy;
    delete updates.createdAt;

    // Check if trying to update to existing abbreviation
    if (updates.abbreviation) {
      const existing = await School.findOne({
        abbreviation: updates.abbreviation.toUpperCase(),
        _id: { $ne: id },
      });

      if (existing) {
        throw new ConflictError('School abbreviation already exists');
      }
    }

    // Check if trying to update to existing name
    if (updates.name) {
      const existing = await School.findOne({
        name: updates.name,
        _id: { $ne: id },
      });

      if (existing) {
        throw new ConflictError('School name already exists');
      }
    }

    const school = await School.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!school) {
      throw new NotFoundError('School not found');
    }

    logger.info(`School updated: ${school.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: { school },
    });
  });

  /**
   * Delete school (Admin only - soft delete)
   * DELETE /api/schools/:id
   */
  static deleteSchool = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not found in request');
    }

    const { id } = req.params;

    const school = await School.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!school) {
      throw new NotFoundError('School not found');
    }

    logger.info(`School deleted: ${school.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'School deleted successfully',
    });
  });

  /**
   * Add program to school
   * POST /api/schools/:id/programs/:programId
   */
  static addProgramToSchool = catchAsync(
    async (req: Request, res: Response) => {
      const { id, programId } = req.params;

      const school = await School.findById(id);
      if (!school) {
        throw new NotFoundError('School not found');
      }

      // Check if program already added
      if (school.programs.includes(programId)) {
        return res.status(400).json({
          success: false,
          error: 'Program already added to this school',
        });
      }

      school.programs.push(programId);
      await school.save();

      logger.info(
        `Program added to school ${school.name} by ${req.user?.email}`
      );

      res.status(200).json({
        success: true,
        message: 'Program added to school successfully',
        data: { school },
      });
    }
  );

  /**
   * Remove program from school
   * DELETE /api/schools/:id/programs/:programId
   */
  static removeProgramFromSchool = catchAsync(
    async (req: Request, res: Response) => {
      const { id, programId } = req.params;

      const school = await School.findById(id);
      if (!school) {
        throw new NotFoundError('School not found');
      }

      const index = school.programs.indexOf(programId);
      if (index === -1) {
        throw new NotFoundError('Program not found in this school');
      }

      school.programs.splice(index, 1);
      await school.save();

      logger.info(
        `Program removed from school ${school.name} by ${req.user?.email}`
      );

      res.status(200).json({
        success: true,
        message: 'Program removed from school successfully',
        data: { school },
      });
    }
  );
}
