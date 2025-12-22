import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const HotelCardrow = ({ hotel }) => {
  return (
    <Link 
      to={`/hotels/${hotel._id}`} 
      onClick={() => window.scrollTo(0, 0)} 
      className='group flex flex-col md:grid md:grid-cols-6 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300'
    >
      {/* COLUMN 1 & 2: IMAGE (md:col-span-2) */}
      <div className="relative md:col-span-2 h-48 md:h-full overflow-hidden">
        <img 
          src={hotel.hotelMainImage} 
          alt={hotel.name} 
          className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Agoda-style Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
          Preferred
        </div>
      </div>

      {/* COLUMN 3, 4 & 5: HOTEL DETAILS (md:col-span-3) */}
      <div className='md:col-span-3 p-5 flex flex-col justify-between border-r border-gray-50'>
        <div>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors'>
                {hotel.name}
              </p>
              <div className='flex items-center gap-1 mt-1'>
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={assets.starIconFilled} alt="star" className="w-3 h-3" />
                ))}
              </div>
            </div>
            
            {/* Rating Score */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-900 leading-none">Excellent</p>
                  <p className="text-[10px] text-gray-400">2,105 reviews</p>
                </div>
                <div className="bg-blue-900 text-white font-bold px-2 py-2 rounded-lg rounded-br-none text-sm">
                  8.8
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-1 mt-3 text-sm text-blue-500'>
            <img src={assets.locationIcon} alt="location" className="w-3" />
            <span className="hover:underline">{hotel.address}</span>
          </div>

          {/* Agoda Tags */}
          <div className="flex gap-2 mt-4">
            <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded font-bold uppercase">
              Free Cancellation
            </span>
            <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded font-bold uppercase">
              Pay at Hotel
            </span>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-500 line-clamp-1 italic">
          "{hotel.city} - Excellent location, highly recommended for travelers"
        </p>
      </div>

      {/* COLUMN 6: VIEW DETAIL / PRICE ACTION (md:col-span-1) */}
      <div className='md:col-span-1 p-5 bg-gray-50/50 flex flex-col items-end justify-end text-right'>
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Price starting at</p>
          <p className="text-2xl font-black text-red-500 leading-tight">
            ${hotel.price || '120'}
          </p>
          <p className="text-[10px] text-gray-400">per night</p>
        </div>

        <button className='w-full px-4 py-3 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm'>
          View Details
        </button>
      </div>
    </Link>
  );
}

export default HotelCardrow;