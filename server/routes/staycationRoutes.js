import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addStaycation, getStaycationsByHotel, removeStaycation, getAvailableStaycations } from '../controllers/staycationController.js';

const staycationRouter = express.Router();

staycationRouter.post('/', protect, addStaycation);
staycationRouter.get('/available', getAvailableStaycations);
staycationRouter.get('/:hotelId', getStaycationsByHotel);
staycationRouter.delete('/:id', protect, removeStaycation);

export default staycationRouter;