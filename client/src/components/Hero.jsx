import React, { useState, useEffect, useRef } from 'react'
import { assets, cities } from '../assets/assets'
import { MapPin, UsersRound } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import './Hero.css'
import AgodaTabs from './AgodaTabs'


const Hero = () => {

    const {navigate, getToken, axios, setSearchedCities} = useAppContext();
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    
    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    
    // Get the minimum checkout date (day after check-in)
    const getMinCheckoutDate = () => {
        if (!checkIn) return getTodayDate();
        const checkInDate = new Date(checkIn);
        checkInDate.setDate(checkInDate.getDate() + 1);
        return checkInDate.toISOString().split('T')[0];
    };
    
    // Handle check-in date change
    const handleCheckInChange = (e) => {
        const selectedDate = e.target.value;
        setCheckIn(selectedDate);
        
        // Reset checkout if it's now invalid
        if (checkOut && checkOut <= selectedDate) {
            setCheckOut('');
        }
    };
    
    // Handle check-out date change
    const handleCheckOutChange = (e) => {
        const selectedDate = e.target.value;
        // Only allow checkout if it's after check-in
        if (checkIn && selectedDate > checkIn) {
            setCheckOut(selectedDate);
        } else if (!checkIn) {
            setCheckOut(selectedDate);
        }
    };

    // Debounced search function
    const searchHotels = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`/api/hotels?search=${encodeURIComponent(query)}&limit=5`);
            if (response.data.success) {
                setSuggestions(response.data.hotels);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error('Error searching hotels:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle destination input change
    const handleDestinationChange = (e) => {
        const value = e.target.value;
        setDestination(value);
        searchHotels(value);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (hotel) => {
        setDestination(hotel.name);
        setSuggestions([]);
        setShowDropdown(false);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const onSearch = async (e) => {
        e.preventDefault();
        
        // Validate dates
        if (!checkIn || !checkOut) {
            alert('Please select both check-in and check-out dates');
            return;
        }
        
        if (checkOut <= checkIn) {
            alert('Check-out date must be after check-in date');
            return;
        }
        
        const searchParams = new URLSearchParams({
            destination,
            checkIn,
            checkOut
        });
        
        navigate(`/hotels?${searchParams.toString()}`)
        
        //call api to save recent searched city
        await axios.post('/api/user/store-recent-search',{recentSearchedCity: destination}, {
            headers: {
                Authorization: `Bearer ${await getToken()}`
            }
        }),

        //add destination to searchedCities max 3 recent searched cities
        setSearchedCities((prevSearchedCities) => {
            const updatedSearchedCities = [...prevSearchedCities, destination];
            if(updatedSearchedCities.length > 3){
                updatedSearchedCities.shift();
            }
            return updatedSearchedCities;
        
        })
    }

  return (
    
    <div className='relative flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 text-white
    bg-[url("/src/assets/bg-Trip-homepage.png")] bg-no-repeat bg-cover h-[400px]  pt-20 pb-20 mt-18 mb-56 md:mb-48 lg:mb-48'>
      
      {/* Title */}
      <h1 className="text-3xl md:text-3xl mt-[-28px] font-bold mb-10 text-center drop-shadow-md">
        SEE THE WORLD FOR LESS
      </h1>

          {/* Main Search Container */}
      <div className='w-full max-w-5xl flex flex-col items-center'>

        {/* Tabs - Now attached to the top of the form */}
        <div className="w-full md:w-fit bg-white rounded-t-xl overflow-hidden shadow-lg">
           <AgodaTabs />
        </div>

             
        <div className='kQKjYj'>    
        {/*Search Form */} 
       <form onSubmit={onSearch}  
       className='w-full bg-white text-gray-800 rounded-xl p-3 md:p-4 flex flex-col md:flex-col max-md:items-start md:items-center gap-2 md:gap-4 max-md:mx-auto shadow-2xl'>
          
            {/* Destination Input - Styled for Prominence */}
            <div className='w-full relative'>
                <div className='flex items-center gap-2 mb-1'>
                    <img src={assets.calenderIcon} alt='Destination Icon' className='h-5 text-indigo-500' />
                    <label htmlFor="destinationInput" className='font-bold text-base'>Destination</label>
                </div>
                <input
                    ref={inputRef}
                    onChange={handleDestinationChange}
                    value={destination}
                    id="destinationInput"
                    type="text"
                    className="w-full rounded bg-gray-50 px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150 placeholder-gray-400"
                    placeholder="e.g. Bangkok, Thailand"
                    required
                    autoComplete="off"
                />

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute right-3 top-10 text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                {/* Dropdown suggestions */}
                {showDropdown && suggestions.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                    >
                        {suggestions.map((hotel) => (
                            <div
                                key={hotel._id}
                                onClick={() => handleSuggestionSelect(hotel)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={hotel.hotelMainImage}
                                        alt={hotel.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">{hotel.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <span><MapPin className=' h-4' /></span>
                                            {hotel.city}, {hotel.country}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No results message */}
                {showDropdown && !isLoading && suggestions.length === 0 && destination.trim() && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 p-4 text-center text-gray-500">
                        No hotels found for "{destination}"
                    </div>
                )}
            </div>
            
            {/* 🔧 FIX HERE: Grid wrapper */}
            <div className="grid grid-cols-12 gap-4 w-full">
           {/* Check In Input */}
            <div className='col-span-12 md:col-span-6'>
                <div className='flex items-center gap-2 mb-1'>
                    <img src={assets.calenderIcon} alt="Check In Icon" className='h-5 text-indigo-500' />
                    <label htmlFor="checkIn" className='font-bold text-sm'>Check in</label>
                </div>
                <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={handleCheckInChange}
                    min={getTodayDate()}
                    className="w-full rounded bg-gray-50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                />
            </div>


            {/* Check Out Input */}
            <div className='col-span-12 md:col-span-6'>
                <div className='flex items-center gap-2 mb-1'>
                    <img src={assets.calenderIcon} alt="Check Out Icon" className='h-5 text-indigo-500' />
                    <label htmlFor="checkOut" className='font-bold text-sm'>Check out</label>
                </div>
                <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={handleCheckOutChange}
                    min={getMinCheckoutDate()}
                    className="w-full rounded bg-gray-50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                />
            </div>


            </div>

            {/* Guests Input */}
            <div className='w-full'>
            <div className='flex items-center gap-2 mb-1'>
                <UsersRound className='w-6 text-gray-500'/>
                
                <label htmlFor="guests" className='font-bold text-sm'>Guests</label>
                </div>
                <input min={1} max={10} id="guests" type="number" className="w-full rounded bg-gray-50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150 placeholder-gray-400" placeholder="1" />
            </div>

            {/* Search Button - Styled with Agoda's Primary Color and Shadow */}
            <button className='flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 md:py-2 px-5 text-white font-bold cursor-pointer transition duration-200 shadow-md hover:shadow-lg max-md:w-full mt-4 max-md:mt-2' >
                <img src={assets.searchIcon} alt="Search Icon" className='h-6 md:h-6 mr-1' />
                <span className='text-lg'>Search</span>
            </button>
        </form> 
        </div>
        </div>
    </div>
  )
}

export default Hero