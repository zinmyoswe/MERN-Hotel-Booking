import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addNearbyPlace, getNearbyPlacesByHotel, updateNearbyPlace, deleteNearbyPlace } from '../controllers/nearbyPlacesController.js';

const nearbyPlacesRouter = express.Router();

nearbyPlacesRouter.post('/', protect, addNearbyPlace);
nearbyPlacesRouter.get('/:hotelId', getNearbyPlacesByHotel);
nearbyPlacesRouter.put('/:id', protect, updateNearbyPlace);
nearbyPlacesRouter.delete('/:id', protect, deleteNearbyPlace);

export default nearbyPlacesRouter;