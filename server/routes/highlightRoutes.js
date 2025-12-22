import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addHighlight, getHighlightsByHotel, removeHighlight, getAvailableHighlights } from '../controllers/highlightController.js';

const highlightRouter = express.Router();

highlightRouter.post('/', protect, addHighlight);
highlightRouter.get('/available', getAvailableHighlights);
highlightRouter.get('/:hotelId', getHighlightsByHotel);
highlightRouter.delete('/:id', protect, removeHighlight);

export default highlightRouter;