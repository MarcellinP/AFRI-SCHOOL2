import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { hasPermission } from '../middlewares/permissions';
import { ProgramController } from '../controllers/ProgramController';

const router = Router();

/**
 * Program Routes - Example of permission-based access control
 */

// Public - List programs
router.get('/', ProgramController.listPrograms);

// Public - Get program details
router.get('/:id', ProgramController.getProgramById);

// Protected + Admin only - Create program
router.post(
  '/',
  protect,
  hasPermission('programs', 'create'),
  ProgramController.createProgram
);

// Protected + Admin only - Update program
router.put(
  '/:id',
  protect,
  hasPermission('programs', 'update'),
  ProgramController.updateProgram
);

// Protected + Admin only - Delete program
router.delete(
  '/:id',
  protect,
  hasPermission('programs', 'delete'),
  ProgramController.deleteProgram
);

export default router;
