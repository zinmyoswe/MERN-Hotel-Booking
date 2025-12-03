import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';

const app = express();
const port = 3000;

await connectDB()

//Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//API to listend to Clerk Webhooks
app.use("/api/clerk",clerkWebhooks);

app.get('/', (req,res) => res.send('server is Live!'))

app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));