import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import HotelCardrow from '@/components/HotelCardrow';
import { Loader2, SlidersHorizontal, ChevronRight, MapPin, Search } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';

const AllHotels = () => {
  const { axios } = useAppContext();
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- All Original Filter States Restored ---
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
        if (hotelsResponse.data.success) setHotels(hotelsResponse.data.hotels);
        if (roomsResponse.data.success) setRooms(roomsResponse.data.rooms);
      } catch (err) {
        toast.error('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axios]);

  // --- Unique Value Logic (Original Restored) ---
  const uniqueCities = useMemo(() => [...new Set(hotels.map(h => h.city))].sort(), [hotels]);
  
  const uniqueAmenities = useMemo(() => {
    const amenities = new Set();
    rooms.forEach(room => room.amenities.forEach(a => amenities.add(a)));
    return Array.from(amenities).sort();
  }, [rooms]);

  const uniqueRoomTypes = useMemo(() => [...new Set(rooms.map(r => r.roomType))].sort(), [rooms]);
  const uniqueBedTypes = useMemo(() => [...new Set(rooms.map(r => r.Bed))].sort(), [rooms]);

  const priceRanges = [
    { label: '$0 - $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: Infinity }
  ];

  // --- Filtering Logic (Original Restored) ---
  const filteredHotels = useMemo(() => {
    const destination = searchParams.get('destination')?.toLowerCase();
    const cityParam = searchParams.get('city')?.toLowerCase();

    let filtered = hotels;

    if (destination) filtered = filtered.filter(h => h.city.toLowerCase().includes(destination));
    if (cityParam) filtered = filtered.filter(h => h.city.toLowerCase().includes(cityParam));
    if (selectedCities.length > 0) filtered = filtered.filter(h => selectedCities.includes(h.city));

    filtered = filtered.filter(hotel => {
      const hotelRooms = rooms.filter(room => room.hotel._id === hotel._id);
      
      if (selectedPriceRanges.length > 0) {
        const hasMatch = hotelRooms.some(room => selectedPriceRanges.some(label => {
          const range = priceRanges.find(r => r.label === label);
          return range && room.pricePerNight >= range.min && room.pricePerNight <= range.max;
        }));
        if (!hasMatch) return false;
      }

      if (selectedAmenities.length > 0) {
        const hasMatch = hotelRooms.some(room => selectedAmenities.every(a => room.amenities.includes(a)));
        if (!hasMatch) return false;
      }

      if (selectedRoomTypes.length > 0) {
        const hasMatch = hotelRooms.some(room => selectedRoomTypes.includes(room.roomType));
        if (!hasMatch) return false;
      }

      if (selectedBedTypes.length > 0) {
        const hasMatch = hotelRooms.some(room => selectedBedTypes.includes(room.Bed));
        if (!hasMatch) return false;
      }

      return true;
    });

    return filtered;
  }, [hotels, rooms, searchParams, selectedPriceRanges, selectedAmenities, selectedRoomTypes, selectedBedTypes, selectedCities]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#5392F9]" />
        <p className="mt-4 text-gray-500 font-medium">Loading great deals...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Search Result Summary Bar */}
      <div className="pt-28 pb-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400 mb-3">
            <span>Home</span> <ChevronRight size={10} />
            <span>Search Results</span> <ChevronRight size={10} />
            <span className="text-[#5392F9] font-bold">{searchParams.get('destination') || 'All Properties'}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2A2A2E] flex items-center gap-2">
                {searchParams.get('destination') ? `Hotels in ${searchParams.get('destination')}` : 'Top Recommended Properties'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-[#E1F0FF] text-[#006CE4] text-xs font-bold px-2 py-0.5 rounded">
                  {filteredHotels.length} properties found
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Filters - Sticky and Styled like Agoda */}
          <aside className="w-full lg:w-64 flex-shrink-0 max-sm:hidden">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-700 uppercase">Filter by</span>
                  <SlidersHorizontal size={14} className="text-gray-400" />
                </div>

                <div className="divide-y divide-gray-100">
                  <FilterGroup 
                    title="Price Range" 
                    options={priceRanges.map(r => r.label)}
                    selected={selectedPriceRanges}
                    onChange={(val, checked) => setSelectedPriceRanges(prev => checked ? [...prev, val] : prev.filter(i => i !== val))}
                  />
                  
                  <FilterGroup 
                    title="Popular Cities" 
                    options={uniqueCities}
                    selected={selectedCities}
                    onChange={(val, checked) => setSelectedCities(prev => checked ? [...prev, val] : prev.filter(i => i !== val))}
                  />

                  <FilterGroup 
                    title="Room Facilities" 
                    options={uniqueAmenities}
                    selected={selectedAmenities}
                    onChange={(val, checked) => setSelectedAmenities(prev => checked ? [...prev, val] : prev.filter(i => i !== val))}
                  />

                  <FilterGroup 
                    title="Room Type" 
                    options={uniqueRoomTypes}
                    selected={selectedRoomTypes}
                    onChange={(val, checked) => setSelectedRoomTypes(prev => checked ? [...prev, val] : prev.filter(i => i !== val))}
                  />

                  <FilterGroup 
                    title="Bed Configuration" 
                    options={uniqueBedTypes}
                    selected={selectedBedTypes}
                    onChange={(val, checked) => setSelectedBedTypes(prev => checked ? [...prev, val] : prev.filter(i => i !== val))}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1">
            <div className="flex flex-col gap-4">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <HotelCardrow key={hotel._id} hotel={hotel} />
                ))
              ) : (
                <div className="bg-white p-20 rounded-lg text-center border border-gray-200 shadow-sm">
                  <div className="flex justify-center mb-4">
                    <Search size={48} className="text-gray-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">No matching results</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters to find more properties.</p>
                  <button 
                    onClick={() => {
                      setSelectedPriceRanges([]);
                      setSelectedAmenities([]);
                      setSelectedCities([]);
                      setSelectedRoomTypes([]);
                      setSelectedBedTypes([]);
                    }}
                    className="text-[#5392F9] font-bold border border-[#5392F9] px-6 py-2 rounded hover:bg-[#F0F7FF] transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean filter sections
const FilterGroup = ({ title, options, selected, onChange }) => (
  <div className="p-4">
    <h3 className="text-[12px] font-bold text-gray-800 uppercase mb-3 tracking-tight">{title}</h3>
    <div className="space-y-2.5">
      {options.length > 0 ? options.map((option) => (
        <div key={option} className="flex items-center group cursor-pointer">
          <Checkbox
            id={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => onChange(option, checked)}
            className="h-4 w-4 border-gray-300 rounded data-[state=checked]:bg-[#5392F9] data-[state=checked]:border-[#5392F9]"
          />
          <Label 
            htmlFor={option} 
            className="ml-2.5 text-sm text-gray-600 group-hover:text-[#5392F9] cursor-pointer font-normal leading-tight"
          >
            {option}
          </Label>
        </div>
      )) : <span className="text-xs text-gray-400 italic">None available</span>}
    </div>
  </div>
);

export default AllHotels;