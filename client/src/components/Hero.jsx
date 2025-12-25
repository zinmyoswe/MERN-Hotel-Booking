import React, { useState, useEffect, useRef } from 'react'
import { assets, cities } from '../assets/assets'
// Added Minus and Plus icons
import { MapPin, UsersRound, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react' 
import { useAppContext } from '@/context/AppContext'
import './Hero.css'
import AgodaTabs from './AgodaTabs'

// Shadcn UI Imports
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const Hero = () => {

    const {navigate, getToken, axios, setSearchedCities} = useAppContext();
    const [destination, setDestination] = useState('');
    
    const [checkIn, setCheckIn] = useState();
    const [checkOut, setCheckOut] = useState();
    
    // --- GUEST STATE ---
    const [adults, setAdults] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [children, setChildren] = useState(0);

    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    
    const handleCheckInSelect = (date) => {
        setCheckIn(date);
        if (checkOut && date && checkOut <= date) {
            setCheckOut(undefined);
        }
    };

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

    const handleDestinationChange = (e) => {
        const value = e.target.value;
        setDestination(value);
        searchHotels(value);
    };

    const handleSuggestionSelect = (hotel) => {
        setDestination(hotel.name);
        setSuggestions([]);
        setShowDropdown(false);
    };

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
            checkIn: checkIn.toISOString().split('T')[0],
            checkOut: checkOut.toISOString().split('T')[0],
            // Only taking adult number as guest number per request
            guests: adults.toString() 
        });
        
        navigate(`/hotels?${searchParams.toString()}`)
        
        await axios.post('/api/user/store-recent-search',{recentSearchedCity: destination}, {
            headers: {
                Authorization: `Bearer ${await getToken()}`
            }
        })

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
      
      <h1 className="text-3xl md:text-3xl mt-[-28px] font-bold mb-10 text-center drop-shadow-md">
        SEE THE WORLD FOR LESS
      </h1>

      <div className='w-full max-w-5xl flex flex-col items-center'>

        <div className="w-full md:w-fit bg-white rounded-t-xl overflow-hidden shadow-lg max-sm:hidden">
            <AgodaTabs />
        </div>

        <div className='kQKjYj'>    
       <form onSubmit={onSearch}  
       className='w-full bg-[#f8f7f9] text-gray-800 rounded-xl p-3 md:p-4 flex flex-col md:flex-col max-md:items-start md:items-center gap-2 md:gap-4 max-md:mx-auto shadow-2xl'>
          
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

                {isLoading && (
                    <div className="absolute right-3 top-10 text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                    </div>
                )}

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

                {showDropdown && !isLoading && suggestions.length === 0 && destination.trim() && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 p-4 text-center text-gray-500">
                        No hotels found for "{destination}"
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-12 gap-4 w-full">
            <div className='col-span-12 md:col-span-6'>
                <div className='flex items-center gap-2 mb-1'>
                    <img src={assets.calenderIcon} alt="Check In Icon" className='h-5 text-indigo-500' />
                    <label className='font-bold text-sm'>Check in</label>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal bg-gray-50 border-none h-10",
                            !checkIn && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={handleCheckInSelect}
                        disabled={(date) => date < new Date().setHours(0,0,0,0)}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>


            <div className='col-span-12 md:col-span-6'>
                <div className='flex items-center gap-2 mb-1'>
                    <img src={assets.calenderIcon} alt="Check Out Icon" className='h-5 text-indigo-500' />
                    <label className='font-bold text-sm'>Check out</label>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal bg-gray-50 border-none h-10",
                            !checkOut && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => 
                            date < new Date().setHours(0,0,0,0) || 
                            (checkIn && date <= checkIn)
                        }
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>


            </div>

            {/* --- GUEST DROPDOWN --- */}
            <div className='w-full'>
                <div className='flex items-center gap-2 mb-1'>
                    <UsersRound className='w-6 text-gray-500'/>
                    <label className='font-bold text-sm'>Guests</label>
                </div>
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal bg-gray-50 border-none h-10 text-base"
                        >
                            {adults} Adults, {children} Children, {rooms} Room
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                            {/* Adult Counter */}
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Adults</span>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                    >
                                        <Minus className="h-4 w-4"/>
                                    </Button>
                                    <span className="w-4 text-center">{adults}</span>
                                    <Button 
                                        type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => setAdults(adults + 1)}
                                    >
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>

                            {/* Room Counter */}
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Room</span>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                                    >
                                        <Minus className="h-4 w-4"/>
                                    </Button>
                                    <span className="w-4 text-center">{rooms}</span>
                                    <Button 
                                        type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => setRooms(rooms + 1)}
                                    >
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>

                            {/* Children Counter */}
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Children</span>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                    >
                                        <Minus className="h-4 w-4"/>
                                    </Button>
                                    <span className="w-4 text-center">{children}</span>
                                    <Button 
                                        type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => setChildren(children + 1)}
                                    >
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

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