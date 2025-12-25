import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import ImageCarouselModal from '../components/ImageCarouselModal';
import { ChevronLeft, ChevronRight, Users, Home, ShoppingBag, Locate, Hotel, PersonStanding, MapPin, Umbrella, Calendar, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Loader2 } from "lucide-react";

const RoomCard = ({ room, hotel, onSubmitHandler }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = Array.isArray(room.images?.[0]) ? room.images[0] : (room.images || []);

     // 🔑 RESET to first image when room changes
    useEffect(() => {
        setCurrentIndex(1);
    }, [room._id]);

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Generate room availability label
    const getRoomAvailabilityLabel = () => {
        const quantity = room.quantity || 1;
        if (quantity === 1) {
            return "Our last room!";
        } else if (quantity === 2) {
            return "Our last 2 rooms!";
        } else if (quantity === 3) {
            return "Our last 3 rooms!";
        } else if (quantity === 4) {
            return "Our last 4 rooms!";
        }
        return null; // Don't show label if more than 4 rooms available
    };

    const availabilityLabel = getRoomAvailabilityLabel();

    // Generate discount badge
    const getDiscountBadge = () => {
        if (!room.discountType) return null;

        const iconUrl = room.discountType === 'price_dropped' 
            ? 'https://cdn6.agoda.net/cdn-design-system/icons/7c9792cf.svg'
            : room.discountType === 'mega_sale'
            ? 'https://cdn6.agoda.net/cdn-design-system/icons/273a5e4f.svg'
            : 'https://cdn6.agoda.net/cdn-design-system/icons/c647f414.svg';

        const bgColor = room.discountType === 'price_dropped' ? 'bg-green-100' : 'bg-red-100';
        const textColor = room.discountType === 'price_dropped' ? 'text-green-800' : 'text-red-800';

        const text = room.discountType === 'price_dropped' 
            ? `Price has dropped by ${room.discountPercentage}%`
            : room.discountType === 'mega_sale'
            ? 'MEGA SALE'
            : `Price has increased`;

        return (
            <div className={`flex items-center gap-1 ${bgColor} ${textColor} text-xs px-2 py-1 rounded-md font-medium`}>
                <img src={iconUrl} alt="" className="w-3 h-3" />
                <span>{text}</span>
            </div>
        );
    };

    const discountBadge = getDiscountBadge();

    // Calculate discounted price
    const discountedPrice = room.discountType === 'price_dropped' && room.originalPrice && room.discountPercentage
        ? room.originalPrice * (1 - room.discountPercentage / 100)
        : room.discountType === 'mega_sale' && room.originalPrice
        ? room.originalPrice
        : null;

    return (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-6 h-full">
                {/* Image Column */}
                <div className="relative md:col-span-2 h-48 md:h-full overflow-hidden group">
                    {images.length > 0 ? (
                        <>
                            <img src={images[currentIndex]} className="w-full h-[300px] object-cover transition-all duration-500 group-hover:scale-105" alt={room.roomType} />
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronLeft size={16} /></button>
                                    <button onClick={nextImage} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronRight size={16} /></button>
                                </>
                            )}
                            {/* Room Availability Badge */}
                            {availabilityLabel && (
                                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                                    {availabilityLabel}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                </div>

                {/* Details Column */}
                <div className="md:col-span-3 p-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-800">{room.roomType}</h3>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Available</span>
                    </div>
                    <h6 className="text-sm text-blue-600 font-medium mt-1 uppercase tracking-tight">{room.RoomView || 'Standard View'}</h6>
                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">{room.description}</p>
                    <div className="flex flex-wrap items-center mt-4 gap-2">
                        {room.amenities.slice(0, 10).map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 text-[10px] rounded-md border border-gray-200">{amenity}</span>
                        ))}
                    </div>
                </div>

                {/* Price & Action Column */}
                <div className="md:col-span-1 p-5 flex flex-col items-center justify-center bg-gray-50/50">
                    <div className="text-center mb-4">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Per Night</span>
                        {discountedPrice ? (
                            <div className="flex flex-col items-center">
                                <p className="text-lg text-gray-500 line-through">
                                    ${room.discountType === 'mega_sale' ? room.pricePerNight : room.originalPrice}
                                </p>
                                <p className="text-2xl font-black text-indigo-600">
                                    ${room.discountType === 'mega_sale' ? room.originalPrice : discountedPrice.toFixed(0)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-2xl font-black text-indigo-600">${room.pricePerNight}</p>
                        )}
                        {discountBadge && (
                            <div className="mt-2">
                                {discountBadge}
                            </div>
                        )}
                        <span className="text-[10px] text-gray-400">Taxes included</span>
                    </div>
                    <button 
                        onClick={(e) => onSubmitHandler(e, room._id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-lg transition-all text-center shadow-sm"
                    >
                        BOOK NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios, getToken } = useAppContext();

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [staycations, setStaycations] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableRoomsCount, setAvailableRoomsCount] = useState(0);

    // Form States
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Helper function to get the next day from a given date
    const getNextDay = (dateString) => {
        if (!dateString) return getTodayDate();
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    // Handle check-in date change
    const handleCheckInChange = (e) => {
        const newCheckInDate = e.target.value;
        setCheckInDate(newCheckInDate);
        
        // Reset check-out date if it's not valid anymore
        if (checkOutDate && checkOutDate <= newCheckInDate) {
            setCheckOutDate('');
        }
    };

    // Generate room availability label
    const getRoomAvailabilityLabel = () => {
        if (availableRoomsCount === 0) {
            return "Sold out on your dates!";
        } else if (availableRoomsCount === 1) {
            return "Only One Left";
        } else if (availableRoomsCount === 2) {
            return "Only Two Left";
        } else if (availableRoomsCount === 3) {
            return "Only Three Left";
        } else if (availableRoomsCount === 4) {
            return "Only Four Left";
        }
        return null; // Don't show label if more than 4 rooms available
    };

    const availabilityLabel = getRoomAvailabilityLabel();

    const onSubmitHandler = async (e, roomId) => {
        try {
            e.preventDefault();
            if(!checkInDate || !checkOutDate){
                toast.error('Please select Check-In and Check-Out dates');
                return;
            }
            if(checkInDate >= checkOutDate){
                toast.error('Check-In Date should be less than Check-Out Date');
                return;
            }
            if(checkInDate < getTodayDate()){
                toast.error('Check-In Date cannot be in the past');
                return;
            }

            const availabilityData = await axios.post('/api/bookings/check-availability', {
                room: roomId,
                checkInDate,
                checkOutDate    
            });

            if(availabilityData.data.success && availabilityData.data.isAvailable){
                const {data} = await axios.post('/api/bookings/book', {
                    room: roomId,
                    checkInDate,
                    checkOutDate,
                    guests,
                    paymentMethod: "Pay At Hotel"
                }, {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                });

                if(data.success){
                    toast.success(data.message);
                    navigate('/my-bookings');
                    window.scrollTo(0,0);
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error(availabilityData.data.message || 'Room is not available for the selected dates');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                setLoading(true);
                const hotelRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${id}`);
                const hotelData = await hotelRes.json();
                if (hotelData.success) {
                    setHotel(hotelData.hotel);
                    setMainImage(hotelData.hotel.hotelMainImage);
                }
                const roomsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${id}/rooms`);
                const roomsData = await roomsRes.json();
                if (roomsData.success) setRooms(roomsData.rooms);

                const nearbyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/nearby-places/${id}`);
                const nearbyData = await nearbyRes.json();
                if (nearbyData.success) setNearbyPlaces(nearbyData.nearbyPlaces);

                const highlightsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/highlights/${id}`);
                const highlightsData = await highlightsRes.json();
                if (highlightsData.success) setHighlights(highlightsData.highlights);

                const facilitiesRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/facilities/${id}`);
                const facilitiesData = await facilitiesRes.json();
                if (facilitiesData.success) setFacilities(facilitiesData.facilities);

                const staycationsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staycations/${id}`);
                const staycationsData = await staycationsRes.json();
                if (staycationsData.success) setStaycations(staycationsData.staycations);

                const availableCountRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/hotel/${id}/available-count`);
                const availableCountData = await availableCountRes.json();
                if (availableCountData.success) setAvailableRoomsCount(availableCountData.availableRoomsCount);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotelDetails();
    }, [id]);

    if (loading) {
        return (
          <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            {/* <p className="text-muted-foreground text-sm font-medium">Just an moment</p> */}
          </div>
        );
      }
    if (error) return <div className="py-28 text-center text-red-500">Error: {error}</div>;

    const getIconDisplay = (icon) => {
        switch (icon) {
            case 'houseicon':
                return <Home size={20} className="text-gray-600" />;
            case 'shopping icon':
                return <ShoppingBag size={20} className="text-gray-600" />;
            case 'location icon':
                return <MapPin size={20} className="text-gray-600" />;
            case 'Hotel icon':
                return <Hotel size={20} className="text-gray-600" />;
            case 'Entertainment icon':
                return <PersonStanding size={20} className="text-gray-600" />;
            default:
                return <Locate size={20} className="text-gray-600" />;
        }
    };

    const getProcessedHighlightName = (highlight) => {
        let name = highlight.name;
        
        // Handle location-based highlights
        if (name.includes('[City]')) {
            name = name.replace('[City]', hotel?.city || 'City');
        }
        if (name.includes('[Bangkok]')) {
            name = name.replace('[Bangkok]', hotel?.city || 'Bangkok');
        }
        
        // Handle customizable highlights
        if (highlight.isCustomizable && highlight.customValue) {
            name = name.replace('[X]', highlight.customValue);
        }
        
        return name;
    };

    const getProcessedFacilityName = (name) => {
        if (name.includes('[24-hour]')) {
            return name.replace('[24-hour]', '24-hour');
        }
        return name;
    };

    const getProcessedStaycationName = (name) => {
        if (name.includes('[24-hour]')) {
            return name.replace('[24-hour]', '24-hour');
        }
        return name;
    };

    const getStaycationIcon = (type) => {
        switch (type) {
            case 'Food and Drinks':
                return 'https://cdn6.agoda.net/images/staycation/default/DrinkingAndDining.svg';
            case 'Wellness':
                return 'https://cdn6.agoda.net/images/staycation/default/wellness.svg';
            case 'Activities':
                return 'https://cdn6.agoda.net/images/staycation/default/activities.svg';
            default:
                return 'https://cdn6.agoda.net/images/staycation/default/activities.svg';
        }
    };

    return hotel && (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
            <h1 className="text-3xl md:text-4xl font-playfair">{hotel.name}</h1>
            <div className="flex items-center gap-1 mt-2">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
                {availabilityLabel && (
                    <span className="ml-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                        {availabilityLabel}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1 text-gray-500 mt-2">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{hotel.address}</span>
            </div>

            {/* Images Grid */}
            <div className="flex flex-col lg:flex-row mt-6 gap-4 lg:gap-6 h-[360px]">
                <div className="lg:w-2/6 w-full" onClick={() => setIsModalOpen(true)}>
                    <img src={mainImage} className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer" alt="Main" />
                </div>
                <div className="lg:w-4/6 w-full grid grid-cols-3 gap-4">
                    {hotel.videoUrl && (
                        <div onClick={() => setIsModalOpen(true)} className="rounded-xl shadow-md overflow-hidden cursor-pointer h-full">
                            <video src={hotel.videoUrl} autoPlay muted controls loop playsInline className="w-full h-full object-cover pointer-events-none"></video>
                        </div>
                    )}
                    {hotel.hotelSubImages.slice(0, 6).map((image, index) => (
                        <div key={index} onClick={() => setIsModalOpen(true)} className="rounded-xl shadow-md overflow-hidden cursor-pointer h-full">
                            <img src={image} className="w-full h-full object-cover" alt="Sub" />
                        </div>
                    ))}
                </div>
            </div>

            <ImageCarouselModal mainImage={mainImage} subImages={hotel.hotelSubImages} open={isModalOpen} onOpenChange={setIsModalOpen} />

            {/* Cheapest Room Price Display */}
            {rooms.length > 0 && (
                <div className="mt-6  border border-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Best Price Guarantee</h3>
                            <p className="text-sm text-gray-600">Starting from our cheapest available room</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="flex items-center gap-2">
                                    <span className='text-xs text-gray-500'>from</span>
                                    <div className="text-3xl font-medium font-black text-red-500">
                                        
                                       ${Math.min(...rooms.map(room => {
                                         let effectivePrice = room.pricePerNight;
                                         if (room.discountType === 'price_dropped' && room.discountPercentage > 0) {
                                           effectivePrice = room.pricePerNight * (1 - room.discountPercentage / 100);
                                         } else if (room.discountType === 'mega_sale' && room.originalPrice > 0) {
                                           effectivePrice = room.originalPrice;
                                         }
                                         return effectivePrice;
                                       }))}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <div className="font-medium">per night</div>
                                        <div className="text-xs">taxes included</div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Lowest Price Available
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const roomsSection = document.getElementById('rooms-section');
                                    if (roomsSection) {
                                        roomsSection.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                View this deal
                            </button>
                        </div>
                    </div>
                </div>
            )}

           {/* Booking Form Bar */}
<div className="mt-12 p-8 bg-white border border-gray-100 rounded-3xl shadow-2xl">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Set Your Travel Dates</h2>
            <p className="text-sm text-gray-500">Plan your next adventure with ease.</p>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* CHECK-IN */}
        <div className="relative group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5 ml-1">
                Check-In
            </label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="date" 
                    required 
                    min={getTodayDate()}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-gray-700 font-medium" 
                    onChange={handleCheckInChange}
                    value={checkInDate}
                />
            </div>
        </div>

        {/* CHECK-OUT */}
        <div className="relative group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5 ml-1">
                Check-Out
            </label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="date" 
                    required 
                    min={checkInDate ? getNextDay(checkInDate) : getTodayDate()}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-gray-700 font-medium" 
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    value={checkOutDate}
                />
            </div>
        </div>

        {/* GUESTS */}
        <div className="relative group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5 ml-1">
                Guests
            </label>
            <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <select 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-gray-700 font-medium cursor-pointer"
                    onChange={(e) => setGuests(e.target.value)}
                >
                    {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
            onClick={() => {
                const roomsSection = document.getElementById('rooms-section');
                roomsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] active:scale-95"
        >
            Book Now
            <ArrowRight className="w-5 h-5" />
        </button>
    </div>
</div>

            <div className='flex flex-col md:flex-row gap-3 mt-10'>
                <div className='lg:w-4/6 w-full'>
                    <h2 className="text-3xl font-playfair">About this hotel</h2>
                    <p className="text-gray-600 mt-2">{hotel.description}</p>
                </div>
                {hotel.mapUrl && (
                    <div className='lg:w-2/6 w-full'>
                        <h2 className="text-3xl font-playfair mb-4">Location</h2>
                        <a href={hotel.mapUrl} target="_blank" rel="noopener noreferrer" className="relative block w-full group overflow-hidden rounded-lg shadow-lg cursor-pointer">
                            <img src={assets.propertyMapEntry} className="w-full h-36 object-cover transition-transform group-hover:scale-105" alt="Map" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors">
                                <span className="bg-white text-black px-8 py-2 rounded-full font-bold text-sm uppercase">See Map</span>
                            </div>
                        </a>
                    </div>
                )}
            </div>

            {/* Nearby Places */}
            {nearbyPlaces.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-3xl font-playfair mb-6">Nearby Places</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {nearbyPlaces.map((place, index) => (
                            <div key={place._id} className={`flex items-center justify-between p-4 ${index !== nearbyPlaces.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        {getIconDisplay(place.icon)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{place.name}</p>
                                        <p className="text-sm text-gray-500">{place.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">{place.distance}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-3xl font-playfair mb-6">Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {highlights.slice(0, 5).map((highlight) => (
                            <div key={highlight._id} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    highlight.isGreenIcon ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                    <img
                                        src={highlight.highlighticonurl}
                                        alt={highlight.name}
                                        className={`w-6 h-6 ${highlight.isGreenIcon ? 'filter brightness-0 saturate-100' : ''}`}
                                        style={highlight.isGreenIcon ? {
                                            filter: 'brightness(0) saturate(100%) invert(21%) sepia(96%) saturate(1234%) hue-rotate(87deg) brightness(95%) contrast(105%)'
                                        } : {}}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                        {getProcessedHighlightName(highlight)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Facilities */}
            {facilities.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-3xl font-playfair mb-6">Facilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {facilities.slice(0, 8).map((facility) => (
                            <div key={facility._id} className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {getProcessedFacilityName(facility.name)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Staycations */}
            {staycations.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-3xl font-playfair mb-6">Staycations</h2>
                    <div className="space-y-6">
                        {Object.entries(
                            staycations.reduce((acc, staycation) => {
                                if (!acc[staycation.staycationtype]) {
                                    acc[staycation.staycationtype] = [];
                                }
                                acc[staycation.staycationtype].push(staycation);
                                return acc;
                            }, {})
                        ).map(([type, activities]) => (
                            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <img
                                            src={getStaycationIcon(type)}
                                            alt={type}
                                            className="w-6 h-6"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">{type}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {activities.map((activity) => (
                                        <div key={activity._id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {getProcessedStaycationName(activity.name)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Room List */}
            <div id="rooms-section" className="mt-16">
                <h2 className="text-3xl font-playfair">Available Rooms</h2>
                <div className="mt-6 space-y-6">
                    {rooms.length > 0 ? (
                        rooms.map(room => (
                            <RoomCard key={room._id} room={room} hotel={hotel} onSubmitHandler={onSubmitHandler} />
                        ))
                    ) : (
                        <p>No rooms available for this hotel at the moment.</p>
                    )}
                </div>
            </div>

            <div className="mt-15 flex items-center gap-4">
                {hotel.owner.image && <img src={hotel.owner.image} alt="Host" className="h-14 w-14 rounded-full" />}
                <div>
                    <p className="text-lg font-medium">Hosted by {hotel.owner.name || hotel.name}</p>
                    <div className="flex items-center mt-1"><StarRating /><p className="ml-2 text-sm text-gray-500">Property Host</p></div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;