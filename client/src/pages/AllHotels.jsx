import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '@/components/HotelCard';
import toast from 'react-hot-toast';

const AllHotels = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels`);
        const result = await response.json();
        if (result.success) {
          setHotels(result.hotels);
        } else {
          setError(result.message);
          toast.error(result.message || 'Failed to fetch hotels.');
        }
      } catch (err) {
        setError(err.message);
        toast.error('An error occurred while fetching hotels.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    const destination = searchParams.get('destination');
    if (!destination) {
      return hotels;
    }
    return hotels.filter(hotel =>
      hotel.city.toLowerCase().includes(destination.toLowerCase())
    );
  }, [hotels, searchParams]);

  if (loading) {
    return <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">Loading...</div>;
  }

  if (error) {
    return <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">Error: {error}</div>;
  }

  return (
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-col items-start text-left mb-8'>
        <h1 className='font-playfair text-4xl md:text-[40px]'>Discover Your Perfect Hotel</h1>
        <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
          Explore a wide range of hotels and find the perfect accommodation for your next trip.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))
        ) : (
          <p>No hotels found for the selected destination.</p>
        )}
      </div>
    </div>
  );
};

export default AllHotels;