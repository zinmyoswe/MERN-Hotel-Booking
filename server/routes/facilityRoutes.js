import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addFacility, getFacilitiesByHotel, removeFacility, getAvailableFacilities } from '../controllers/facilityController.js';

const facilityRouter = express.Router();

facilityRouter.post('/', protect, addFacility);
facilityRouter.get('/available', getAvailableFacilities);
facilityRouter.get('/:hotelId', getFacilitiesByHotel);
facilityRouter.delete('/:id', protect, removeFacility);

export default facilityRouter;