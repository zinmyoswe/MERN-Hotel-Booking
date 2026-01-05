
# MERN Hotel Booking

This is a full-stack hotel booking application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a platform for users to search for and book hotels, and for hotel owners to manage their properties.

**Live Demo:**
- **Frontend:** [https://mern-hotel-booking-trip.vercel.app/](https://mern-hotel-booking-trip.vercel.app/)
- **Backend:** [https://mern-hotel-booking-backend-pink.vercel.app/](https://mern-hotel-booking-backend-pink.vercel.app/)

## Features

- **User Authentication:** Secure user registration and login using Clerk.
- **Hotel Search & Filtering:** Search for hotels, filter by amenities, and view detailed hotel information.
- **Booking Management:** Users can book rooms and view their booking history.
- **Payment Integration:** Secure payment processing with Stripe.
- **Hotel Management:** Hotel owners can add, edit, and manage their hotels and rooms.
- **Image Uploads:** Hotel images are handled using Cloudinary.
- **Email Notifications:** Users receive booking confirmation emails.

## Tech Stack

### Backend

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk
- **Payment:** Stripe
- **File Uploads:** Cloudinary and Multer
- **Email:** Nodemailer

### Frontend

- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with shadcn/ui
- **Routing:** React Router
- **Forms:** React Hook Form with Zod for validation
- **Authentication:** Clerk React

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB instance (local or cloud-based)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/zinmyoswe/MERN-Hotel-Booking.git
    cd MERN-Hotel-Booking
    ```

2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add the environment variables as described in the **Environment Variables** section below.

    Start the backend server:
    ```bash
    npm run server
    ```
    The server will be running on `http://localhost:5000` (or the port specified in your `.env`).

3.  **Setup Frontend:**
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env.local` file in the `client` directory and add the environment variables.

    Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Environment Variables

### Backend (`server/.env`)

```
# MongoDB Connection URI
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Stripe Payments
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary Image Uploads
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Nodemailer for Email
SENDER_EMAIL=your_sender_email
SMTP_USER=your_smtp_email_user
SMTP_PASS=your_smtp_email_password

# Optional
PORT=5000
CURRENCY=$
```

### Frontend (`client/.env.local`)

```
# URL of your backend server
VITE_BACKEND_URL=http://localhost:5000

# Clerk Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Optional
VITE_CURRENCY=$
```

## Project Structure

The project is divided into two main folders:

-   `client/`: Contains the React frontend application.
-   `server/`: Contains the Node.js/Express backend API.

## API Routes

The backend exposes the following API routes:

-   `/api/auth`: User authentication routes.
-   `/api/bookings`: Booking management.
-   `/api/distances`: Get distances to hotels.
-   `/api/facilities`: Hotel facilities.
-   `/api/highlights`: Hotel highlights.
-   `/api/hotels`: Hotel management.
-   `/api/nearby-places`: Nearby places of interest.
-   `/api/rooms`: Room management.
-   `/api/staycations`: Staycation details.
-   `/api/users`: User management.

The project also includes webhook endpoints for Clerk and Stripe to handle real-time updates.
