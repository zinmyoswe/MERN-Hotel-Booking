import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const HotelCard = ({ hotel, room, index }) => {
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
          <p><span className='text-lg text-gray-800'>${room.pricePerNight}</span></p>
          <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded
                hover:bg-gray-50 transition-all cursor-pointer'>View Details</button>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard;