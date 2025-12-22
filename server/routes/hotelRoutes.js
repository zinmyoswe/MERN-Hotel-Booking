import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerHotel, getHotels, getHotelById, getRoomsByHotel } from '../controllers/hotelController.js';
import upload from '../middleware/uploadMiddleware.js';

const hotelRouter = express.Router();

hotelRouter.post('/', protect, upload.fields([{ name: 'hotelMainImage', maxCount: 1 }, { name: 'hotelSubImages', maxCount: 5 }]), registerHotel);
hotelRouter.get('/', getHotels);
hotelRouter.get('/:id', getHotelById);
hotelRouter.get('/:id/rooms', getRoomsByHotel);

export default hotelRouter;
