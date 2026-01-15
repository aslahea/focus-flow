import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
} from '../controllers/taskController.js';

const router = express.Router();

// Task list endpoints
router.get('/', getAllTasks);
router.post('/', createNewTask);

// Individual task endpoints
router.get('/:id', getTaskById);
router.put('/:id', updateExistingTask);
router.delete('/:id', deleteExistingTask);

export default router;
// commit marker 12
