import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { Star } from 'lucide-react';

const HotelCard = ({ hotel }) => {
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

  // Logic for pricing and discounts
  const pricing = rooms.length > 0 ? rooms.reduce((cheapest, current) => {
    let effectivePrice = current.pricePerNight;
    let originalPrice = current.pricePerNight;

    if (current.discountType === 'price_dropped' && current.discountPercentage > 0) {
      effectivePrice = current.pricePerNight * (1 - current.discountPercentage / 100);
    } else if (current.discountType === 'mega_sale' && current.originalPrice > 0) {
      effectivePrice = current.originalPrice;
      originalPrice = current.pricePerNight; // Assuming pricePerNight is the high one
    }
    
    return (!cheapest || effectivePrice < cheapest.effectivePrice) 
      ? { effectivePrice, originalPrice, discount: current.discountPercentage } 
      : cheapest;
  }, null) : null;

  return (
    <Link 
      to={`/hotels/${hotel._id}`} 
      onClick={() => window.scrollTo(0, 0)}
      className='group flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100'
    >
      {/* Image Container */}
      <div className='relative h-52 w-full overflow-hidden'>
        <img 
          src={hotel.hotelMainImage} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Agoda-style Tag */}
        {pricing?.discount > 0 && (
          <div className='absolute top-3 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-r-full shadow-lg'>
            -{pricing.discount}% OFF
          </div>
        )}
        {/* Replace your existing absolute div with this */}
      <div className='absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1'>
        <Star size={14} className='fill-yellow-500 text-yellow-500' />
        <span>4.5</span>
      </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors'>
          {hotel.name}
        </h3>
        
        <div className='flex items-center gap-1 mt-1'>
          <img src={assets.locationIcon} alt="" className="w-3 h-3 opacity-60" />
          <span className='text-xs text-gray-500 truncate'>
            {hotel.city}, {hotel.country}
          </span>
        </div>

        {/* Agoda USP Badges */}
        <div className='flex flex-wrap gap-2 mt-3'>
          <span className='text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100'>
            Free Cancellation
          </span>
          <span className='text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100'>
            Pay at Hotel
          </span>
        </div>

        {/* Pricing Section - Pushed to bottom */}
        <div className='mt-auto pt-4 flex flex-col items-end'>
          {loadingRooms ? (
            <div className='h-10 w-24 bg-gray-100 animate-pulse rounded'></div>
          ) : pricing ? (
            <div className='text-right'>
              {pricing.effectivePrice < pricing.originalPrice && (
                <span className='text-xs text-red-500 line-through block'>
                  ${Math.round(pricing.originalPrice)}
                </span>
              )}
              <div className='flex items-baseline justify-end gap-1'>
                <span className='text-xs text-gray-500 font-medium'>USD</span>
                <span className='text-2xl font-bold text-blue-600'>
                  {Math.round(pricing.effectivePrice)}
                </span>
              </div>
              <p className='text-[10px] text-gray-400 -mt-1'>Per night / Excl. taxes</p>
            </div>
          ) : (
            <span className='text-sm text-gray-400 italic'>Sold Out</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;