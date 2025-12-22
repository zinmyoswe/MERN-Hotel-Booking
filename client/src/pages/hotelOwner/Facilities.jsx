import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Plus, X, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Facilities = () => {
  const { axios, getToken } = useAppContext();
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchAvailableFacilities();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchHotelFacilities();
    }
  }, [selectedHotel]);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get('/api/hotels/owner', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setHotels(data.hotels);
        if (data.hotels.length > 0) {
          setSelectedHotel(data.hotels[0]._id);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch hotels');
    }
  };

  const fetchAvailableFacilities = async () => {
    try {
      const { data } = await axios.get('/api/facilities/available');
      if (data.success) {
        setAvailableFacilities(data.facilities);
      }
    } catch (error) {
      toast.error('Failed to fetch available facilities');
    }
  };

  const fetchHotelFacilities = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/facilities/${selectedHotel}`);
      if (data.success) {
        setSelectedFacilities(data.facilities);
      }
    } catch (error) {
      toast.error('Failed to fetch hotel facilities');
    } finally {
      setLoading(false);
    }
  };

  const addFacility = async (facilityName) => {
    try {
      // Check if already selected
      const exists = selectedFacilities.find(f => f.name === facilityName);
      if (exists) {
        toast.error('Facility already added');
        return;
      }

      const { data } = await axios.post('/api/facilities', {
        name: facilityName,
        hotelId: selectedHotel
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Facility added successfully');
        fetchHotelFacilities();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add facility');
    }
  };

  const removeFacility = async (facilityId) => {
    try {
      const { data } = await axios.delete(`/api/facilities/${facilityId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Facility removed successfully');
        fetchHotelFacilities();
      }
    } catch (error) {
      toast.error('Failed to remove facility');
    }
  };

  const getProcessedFacilityName = (name, hotel) => {
    if (name.includes('[24-hour]')) {
      return name.replace('[24-hour]', '24-hour');
    }
    return name;
  };

  const isSelected = (facilityName) => {
    return selectedFacilities.some(f => f.name === facilityName);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('facilities')}</h1>
      </div>

      {/* Hotel Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Hotel</label>
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          {hotels.map(hotel => (
            <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Facilities */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Available Facilities</h2>
            <p className="text-sm text-gray-600">Click to add facilities to your hotel</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
              {availableFacilities.map((facility, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected(facility)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => addFacility(facility)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {getProcessedFacilityName(facility, hotels.find(h => h._id === selectedHotel))}
                      </p>
                    </div>
                    {isSelected(facility) && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Facilities */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Selected Facilities</h2>
            <p className="text-sm text-gray-600">Facilities for the selected hotel</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : selectedFacilities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No facilities selected. Choose from available facilities.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {selectedFacilities.map((facility) => {
                  const hotel = hotels.find(h => h._id === selectedHotel);
                  return (
                    <div key={facility._id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {getProcessedFacilityName(facility.name, hotel)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFacility(facility._id)}
                          className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;