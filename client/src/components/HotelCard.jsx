import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const HotelCard = ({ hotel, room, index }) => {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${hotel._id}/rooms`);
        const data = await response.json();
        if (data.success) {
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [hotel._id]);

  // Calculate the cheapest room price considering discounts
  const cheapestPrice = rooms.length > 0 ? Math.min(...rooms.map(room => {
    let effectivePrice = room.pricePerNight;
    if (room.discountType === 'price_dropped' && room.discountPercentage > 0) {
      effectivePrice = room.pricePerNight * (1 - room.discountPercentage / 100);
    } else if (room.discountType === 'mega_sale' && room.originalPrice > 0) {
      effectivePrice = room.originalPrice;
    }
    return effectivePrice;
  })) : null;

  return (
    <Link to={`/hotels/${hotel._id}`} onClick={() => scrollTo(0, 0)} key={hotel._id}
      className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90
        shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'>
      <img src={hotel.hotelMainImage} alt={hotel.name} className="w-full h-48 object-cover" />

      <div className='p-4 pt-5 h-[200px]'>
        <div className='flex item-center justify-between'>
          <p className='text-xl font-medium text-gray-800'>
            {hotel.name}
          </p>
          <div className='flex items-center gap-1'>
            <img src={assets.starIconFilled} alt="star-icon" />4.5
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
        </div>
        <div className='flex items-center justify-between mt-4'>
          <p>
            {cheapestPrice !== null && !loadingRooms ? (
              <span className='text-lg text-gray-800'>From ${cheapestPrice}</span>
            ) : loadingRooms ? (
              <span className='text-sm text-gray-500'>Loading prices...</span>
            ) : (
              <span className='text-sm text-gray-500'>No rooms available</span>
            )}
          </p>
          <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded
                hover:bg-gray-50 transition-all cursor-pointer'>View Details</button>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard;