import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '@/components/HotelCard';
import toast from 'react-hot-toast';
import HotelCardrow from '@/components/HotelCardrow';
import { Loader2 } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';

const AllHotels = () => {
  const { axios } = useAppContext();
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedBedTypes, setSelectedBedTypes] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsResponse, roomsResponse] = await Promise.all([
          axios.get('/api/hotels'),
          axios.get('/api/rooms')
        ]);

        if (hotelsResponse.data.success) {
          setHotels(hotelsResponse.data.hotels);
        } else {
          setError(hotelsResponse.data.message);
          toast.error(hotelsResponse.data.message || 'Failed to fetch hotels.');
        }

        if (roomsResponse.data.success) {
          setRooms(roomsResponse.data.rooms);
        } else {
          toast.error(roomsResponse.data.message || 'Failed to fetch rooms.');
        }
      } catch (err) {
        setError(err.message);
        toast.error('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axios]);

  // Get unique values for filters
  const uniqueCities = useMemo(() => {
    const cities = [...new Set(hotels.map(hotel => hotel.city))];
    return cities.sort();
  }, [hotels]);

  const uniqueAmenities = useMemo(() => {
    const amenities = new Set();
    rooms.forEach(room => {
      room.amenities.forEach(amenity => amenities.add(amenity));
    });
    return Array.from(amenities).sort();
  }, [rooms]);

  const uniqueRoomTypes = useMemo(() => {
    const roomTypes = [...new Set(rooms.map(room => room.roomType))];
    return roomTypes.sort();
  }, [rooms]);

  const uniqueBedTypes = useMemo(() => {
    const bedTypes = [...new Set(rooms.map(room => room.Bed))];
    return bedTypes.sort();
  }, [rooms]);

  const priceRanges = [
    { label: '$0 - $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: Infinity }
  ];

  const filteredHotels = useMemo(() => {
    const destination = searchParams.get('destination');
    const city = searchParams.get('city');

    let filtered = hotels;

    // Filter by destination/city from URL
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

    // Filter by selected cities
    if (selectedCities.length > 0) {
      filtered = filtered.filter(hotel => selectedCities.includes(hotel.city));
    }

    // Filter by room-based criteria
    filtered = filtered.filter(hotel => {
      const hotelRooms = rooms.filter(room => room.hotel._id === hotel._id);

      // Price range filter
      if (selectedPriceRanges.length > 0) {
        const hasMatchingPrice = hotelRooms.some(room => {
          return selectedPriceRanges.some(rangeLabel => {
            const range = priceRanges.find(r => r.label === rangeLabel);
            return range && room.pricePerNight >= range.min && room.pricePerNight <= range.max;
          });
        });
        if (!hasMatchingPrice) return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasMatchingAmenities = hotelRooms.some(room => {
          return selectedAmenities.every(amenity => room.amenities.includes(amenity));
        });
        if (!hasMatchingAmenities) return false;
      }

      // Room types filter
      if (selectedRoomTypes.length > 0) {
        const hasMatchingRoomType = hotelRooms.some(room => selectedRoomTypes.includes(room.roomType));
        if (!hasMatchingRoomType) return false;
      }

      // Bed types filter
      if (selectedBedTypes.length > 0) {
        const hasMatchingBedType = hotelRooms.some(room => selectedBedTypes.includes(room.Bed));
        if (!hasMatchingBedType) return false;
      }

      return true;
    });

    return filtered;
  }, [hotels, rooms, searchParams, selectedPriceRanges, selectedAmenities, selectedRoomTypes, selectedBedTypes, selectedCities]);

  const handlePriceRangeChange = (rangeLabel, checked) => {
    setSelectedPriceRanges(prev =>
      checked ? [...prev, rangeLabel] : prev.filter(r => r !== rangeLabel)
    );
  };

  const handleAmenityChange = (amenity, checked) => {
    setSelectedAmenities(prev =>
      checked ? [...prev, amenity] : prev.filter(a => a !== amenity)
    );
  };

  const handleRoomTypeChange = (roomType, checked) => {
    setSelectedRoomTypes(prev =>
      checked ? [...prev, roomType] : prev.filter(rt => rt !== roomType)
    );
  };

  const handleBedTypeChange = (bedType, checked) => {
    setSelectedBedTypes(prev =>
      checked ? [...prev, bedType] : prev.filter(bt => bt !== bedType)
    );
  };

  const handleCityChange = (city, checked) => {
    setSelectedCities(prev =>
      checked ? [...prev, city] : prev.filter(c => c !== city)
    );
  };

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
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 min-h-screen pb-20'>
      <div className='flex flex-col items-start text-left mb-8'>
        <h1 className='font-sans font-bold text-2xl md:text-3xl text-gray-800'>
          {searchParams.get('destination') ? `Hotels in ${searchParams.get('destination')}` : 'Recommended Properties'}
        </h1>
        <p className='text-sm text-gray-500'>Showing {filteredHotels.length} properties</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Price Range</h3>
            {priceRanges.map(range => (
              <div key={range.label} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`price-${range.label}`}
                  checked={selectedPriceRanges.includes(range.label)}
                  onCheckedChange={(checked) => handlePriceRangeChange(range.label, checked)}
                />
                <Label htmlFor={`price-${range.label}`} className="text-sm">{range.label}</Label>
              </div>
            ))}
          </div>

          {/* Cities */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Cities</h3>
            {uniqueCities.map(city => (
              <div key={city} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`city-${city}`}
                  checked={selectedCities.includes(city)}
                  onCheckedChange={(checked) => handleCityChange(city, checked)}
                />
                <Label htmlFor={`city-${city}`} className="text-sm">{city}</Label>
              </div>
            ))}
          </div>

          {/* Facilities */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Facilities</h3>
            {uniqueAmenities.map(amenity => (
              <div key={amenity} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</Label>
              </div>
            ))}
          </div>

          {/* Room Types */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Room Types</h3>
            {uniqueRoomTypes.map(roomType => (
              <div key={roomType} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`roomtype-${roomType}`}
                  checked={selectedRoomTypes.includes(roomType)}
                  onCheckedChange={(checked) => handleRoomTypeChange(roomType, checked)}
                />
                <Label htmlFor={`roomtype-${roomType}`} className="text-sm">{roomType}</Label>
              </div>
            ))}
          </div>

          {/* Bed Types */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Bed Types</h3>
            {uniqueBedTypes.map(bedType => (
              <div key={bedType} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`bedtype-${bedType}`}
                  checked={selectedBedTypes.includes(bedType)}
                  onCheckedChange={(checked) => handleBedTypeChange(bedType, checked)}
                />
                <Label htmlFor={`bedtype-${bedType}`} className="text-sm">{bedType}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Hotel List */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col gap-4">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <HotelCardrow key={hotel._id} hotel={hotel} />
              ))
            ) : (
              <div className="bg-white p-10 rounded-xl text-center shadow-sm">
                <p className="text-gray-500 font-medium">No hotels found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllHotels;