import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const TopDestinationsThai = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hotelCounts, setHotelCounts] = useState({});

  const destinations = [
    {
      name: 'Bangkok',
      image: 'https://pix6.agoda.net/geo/city/9395/1_9395_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Bangkok'
    },
    {
      name: 'Pattaya',
      image: 'https://pix6.agoda.net/geo/city/8584/1_8584_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Pattaya'
    },
    {
      name: 'Chiang Mai',
      image: 'https://pix6.agoda.net/geo/city/7401/1_7401_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Chiang Mai'
    },
    {
      name: 'Phuket',
      image: 'https://pix6.agoda.net/geo/city/16056/1_16056_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Phuket'
    },
    {
      name: 'Hua Hin / Cha-am',
      image: 'https://pix6.agoda.net/geo/city/17019/1_17019_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Hua Hin'
    },
    {
      name: 'Khao Yai',
      image: 'https://pix6.agoda.net/geo/city/17005/1_17005_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Khao Yai'
    },
    {
      name: 'Chonburi',
      image: 'https://pix6.agoda.net/geo/city/17787/1_17787_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Chonburi'
    },
    {
      name: 'Krabi',
      image: 'https://pix6.agoda.net/geo/city/14865/1_14865_02.jpg?ca=6&ce=1&s=375x&ar=1x1',
      city: 'Krabi'
    }
  ];

  const itemsPerView = 4;
  const maxIndex = Math.max(0, destinations.length - itemsPerView);

  useEffect(() => {
    fetchHotelCounts();
  }, []);

  const fetchHotelCounts = async () => {
    try {
      const counts = {};
      for (const destination of destinations) {
        try {
          const { data } = await axios.get(`/api/hotels/city/${encodeURIComponent(destination.city)}/count`);
          counts[destination.city] = data.count || 0;
        } catch (error) {
          counts[destination.city] = 0;
        }
      }
      setHotelCounts(counts);
    } catch (error) {
      console.error('Error fetching hotel counts:', error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const handleDestinationClick = (city) => {
    navigate(`/hotels?city=${encodeURIComponent(city)}`);
  };

  const visibleDestinations = destinations.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="py-12 px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[24px] md:text-[28px] font-bold text-gray-800 mb-8 text-start">
          Top Destinations in Thailand
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
            disabled={currentIndex === 0}
          >
            <ChevronLeft
              size={24}
              className={`text-gray-600 ${currentIndex === 0 ? 'opacity-50' : 'hover:text-gray-800'}`}
            />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight
              size={24}
              className={`text-gray-600 ${currentIndex >= maxIndex ? 'opacity-50' : 'hover:text-gray-800'}`}
            />
          </button>

          {/* Destinations Grid */}
          {/* Destinations Viewport */}
<div className="overflow-hidden"> 
  <div 
    className="flex transition-transform duration-500 ease-out" 
    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
  >
    {destinations.map((destination, index) => (
      <div
        key={index}
        className="min-w-[100%] sm:min-w-[50%] lg:min-w-[25%] p-3" // Keeps 4 items visible on desktop
      >
        <div
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          onClick={() => handleDestinationClick(destination.city)}
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
            <div className="aspect-square overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-semibold mb-1">{destination.name}</h3>
              <p className="text-sm opacity-90">
                {hotelCounts[destination.city] || 0} accommodations
              </p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDestinationsThai;