import React, { useState, useEffect } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom' ;

const FeaturedDestination = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels`);
                const data = await response.json();
                if (data.success) {
                    setHotels(data.hotels.slice(0, 4)); // Show only first 4 hotels
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return (
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 py-20'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading featured destinations...</p>
                </div>
            </div>
        );
    }

    return hotels.length > 0 && (
        
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24  py-20'>

            <h2 className="text-2xl font-bold text-gray-800">Featured homes recommended for you</h2>
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {hotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                ))}
            </div>

            <button onClick={() => {navigate('/hotels')}}  className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50
            transition-all cursor-pointer'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination