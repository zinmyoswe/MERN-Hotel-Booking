import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerHotel, getHotels, getHotelById, getRoomsByHotel, getHotelsByOwner, updateHotel } from '../controllers/hotelController.js';
import upload from '../middleware/uploadMiddleware.js';

const hotelRouter = express.Router();

hotelRouter.post('/', protect, upload.fields([{ name: 'hotelMainImage', maxCount: 1 }, { name: 'hotelSubImages', maxCount: 5 }]), registerHotel);
hotelRouter.get('/', getHotels);
hotelRouter.get('/owner', protect, getHotelsByOwner);
hotelRouter.get('/:id', getHotelById);
hotelRouter.put('/:id', protect, upload.fields([{ name: 'hotelMainImage', maxCount: 1 }, { name: 'hotelSubImages', maxCount: 5 }]), updateHotel);
hotelRouter.get('/:id/rooms', getRoomsByHotel);

export default hotelRouter;
