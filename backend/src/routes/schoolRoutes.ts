import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { hasPermission } from '../middlewares/permissions';
import { SchoolController } from '../controllers/SchoolController';
import {
  createSchoolValidationRules,
  updateSchoolValidationRules,
  validateSchool,
} from '../validators/schoolValidator';

const router = Router();

/**
 * School Routes - Public and Admin endpoints
 */

// GET /api/schools - List all schools (Public with filtering)
router.get('/', SchoolController.listSchools);

// GET /api/schools/:id - Get school details (Public)
router.get('/:id', SchoolController.getSchoolById);

// POST /api/schools - Create school (Admin only)
router.post(
  '/',
  protect,
  hasPermission('schools', 'create'),
  createSchoolValidationRules(),
  validateSchool,
  SchoolController.createSchool
);

// PUT /api/schools/:id - Update school (Admin only)
router.put(
  '/:id',
  protect,
  hasPermission('schools', 'update'),
  updateSchoolValidationRules(),
  validateSchool,
  SchoolController.updateSchool
);

// DELETE /api/schools/:id - Delete school (Admin only)
router.delete(
  '/:id',
  protect,
  hasPermission('schools', 'delete'),
  SchoolController.deleteSchool
);

// POST /api/schools/:id/programs/:programId - Add program to school (Admin only)
router.post(
  '/:id/programs/:programId',
  protect,
  hasPermission('schools', 'update'),
  SchoolController.addProgramToSchool
);

// DELETE /api/schools/:id/programs/:programId - Remove program from school (Admin only)
router.delete(
  '/:id/programs/:programId',
  protect,
  hasPermission('schools', 'update'),
  SchoolController.removeProgramFromSchool
);

export default router;
