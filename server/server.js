import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import nearbyPlacesRouter from './routes/nearbyPlacesRoutes.js';
import highlightRouter from './routes/highlightRoutes.js';
import facilityRouter from './routes/facilityRoutes.js';

const app = express();
const port = 3000;

await connectDB()
connectCloudinary();

//Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//API to listend to Clerk Webhooks
app.use("/api/clerk",clerkWebhooks);

app.get('/', (req,res) => res.send('server is Live!'))
app.use('/api/users', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/nearby-places', nearbyPlacesRouter);
app.use('/api/highlights', highlightRouter);
app.use('/api/facilities', facilityRouter);

app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));