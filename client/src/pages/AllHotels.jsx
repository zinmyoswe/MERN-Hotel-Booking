import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '@/components/HotelCard';
import toast from 'react-hot-toast';
import HotelCardrow from '@/components/HotelCardrow';
import { Loader2 } from "lucide-react";

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
    const city = searchParams.get('city');

    let filtered = hotels;

    if (destination) {
      filtered = filtered.filter(hotel =>
        hotel.city.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (city) {
      filtered = filtered.filter(hotel =>
        hotel.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    return filtered;
  }, [hotels, searchParams]);

  // Updated Loading State with Shadcn-style Spinner
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Just an moment</p>
      </div>
    );
  }

  return (
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-48 bg-gray-50 min-h-screen pb-20'>
      <div className='flex flex-col items-start text-left mb-8'>
        <h1 className='font-sans font-bold text-2xl md:text-3xl text-gray-800'>
          {searchParams.get('destination') ? `Hotels in ${searchParams.get('destination')}` : 'Recommended Properties'}
        </h1>
        <p className='text-sm text-gray-500'>Showing {filteredHotels.length} properties</p>
      </div>

      {/* Changed to a vertical stack for horizontal cards */}
      <div className="flex flex-col gap-4">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCardrow key={hotel._id} hotel={hotel} />
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl text-center shadow-sm">
            <p className="text-gray-500 font-medium">No hotels found for this destination.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllHotels;