import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import { useNavigate } from 'react-router-dom';

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
          // Agoda usually shows 4-8 items in a featured grid
          setHotels(data.hotels.slice(0, 4)); 
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
      <div className='py-20 flex justify-center'>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Finding the best deals...</p>
        </div>
      </div>
    );
  }

  return hotels.length > 0 && (
    <section className='bg-white py-16 px-6 md:px-16 lg:px-24 mb-20'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4'>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured hotels recommended for you
            </h2>
            
          </div>
          
          <button 
            onClick={() => navigate('/hotels')} 
            className='hidden md:block text-blue-600 font-semibold hover:underline text-sm'
          >
            See all properties &rarr;
          </button>
        </div>

        {/* Grid Layout */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>

        {/* Mobile-only View All Button */}
        <div className='mt-10 flex justify-center md:hidden'>
          <button 
            onClick={() => navigate('/hotels')} 
            className='w-full py-3 text-blue-600 font-bold bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors'
          >
            View All Destinations
          </button>
        </div>

       
      </div>
    </section>
  );
}

export default FeaturedDestination;