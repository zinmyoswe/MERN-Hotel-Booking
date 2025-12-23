import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDistance,
  createOrUpdateDistance,
  deleteDistance
} from '../controllers/distanceController.js';

const distanceRouter = express.Router();

// Get distance for a hotel (public)
distanceRouter.get('/:hotelId', getDistance);

// Create or update distance for a hotel (protected - hotel owner only)
distanceRouter.post('/:hotelId', protect, createOrUpdateDistance);

// Delete distance for a hotel (protected - hotel owner only)
distanceRouter.delete('/:hotelId', protect, deleteDistance);

export default distanceRouter;