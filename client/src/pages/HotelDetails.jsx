import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import ImageCarouselModal from '../components/ImageCarouselModal';
import { ChevronLeft, ChevronRight, Users, Home, ShoppingBag, Locate, Hotel, PersonStanding, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
                        <p className="text-2xl font-black text-indigo-600">${room.pricePerNight}</p>
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
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);

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
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotelDetails();
    }, [id]);

    if (loading) return <div className="py-28 text-center">Loading...</div>;
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

    return hotel && (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
            <h1 className="text-3xl md:text-4xl font-playfair">{hotel.name}</h1>
            <div className="flex items-center gap-1 mt-2">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
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
                            <video src={hotel.videoUrl} autoPlay muted controls className="w-full h-full object-cover pointer-events-none"></video>
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

            {/* Booking Form Bar */}
            <div className="mt-12 p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold mb-4">Set Your Travel Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400">CHECK-IN</label>
                        <input type="date" required className="p-2.5 border rounded-lg outline-none focus:border-indigo-600" onChange={(e) => setCheckInDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400">CHECK-OUT</label>
                        <input type="date" required className="p-2.5 border rounded-lg outline-none focus:border-indigo-600" onChange={(e) => setCheckOutDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400">GUESTS</label>
                        <select className="p-2.5 border rounded-lg outline-none bg-white" onChange={(e) => setGuests(e.target.value)}>
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                        </select>
                    </div>
                    <div className="text-xs text-gray-400 italic pb-3"></div>
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

            {/* Room List */}
            <div className="mt-16">
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