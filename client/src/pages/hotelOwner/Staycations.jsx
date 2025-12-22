import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Plus, X, Umbrella } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Staycations = () => {
  const { axios, getToken } = useAppContext();
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [availableStaycations, setAvailableStaycations] = useState({});
  const [selectedStaycations, setSelectedStaycations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchAvailableStaycations();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchHotelStaycations();
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

  const fetchAvailableStaycations = async () => {
    try {
      const { data } = await axios.get('/api/staycations/available');
      if (data.success) {
        setAvailableStaycations(data.staycations);
      }
    } catch (error) {
      toast.error('Failed to fetch available staycations');
    }
  };

  const fetchHotelStaycations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/staycations/${selectedHotel}`);
      if (data.success) {
        setSelectedStaycations(data.staycations);
      }
    } catch (error) {
      toast.error('Failed to fetch hotel staycations');
    } finally {
      setLoading(false);
    }
  };

  const addStaycation = async (activityName, staycationType) => {
    try {
      // Check if already selected
      const exists = selectedStaycations.find(s => s.name === activityName);
      if (exists) {
        toast.error('Staycation activity already added');
        return;
      }

      const { data } = await axios.post('/api/staycations', {
        name: activityName,
        staycationtype: staycationType,
        hotelId: selectedHotel
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Staycation activity added successfully');
        fetchHotelStaycations();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add staycation activity');
    }
  };

  const removeStaycation = async (staycationId) => {
    try {
      const { data } = await axios.delete(`/api/staycations/${staycationId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Staycation activity removed successfully');
        fetchHotelStaycations();
      }
    } catch (error) {
      toast.error('Failed to remove staycation activity');
    }
  };

  const getProcessedStaycationName = (name) => {
    if (name.includes('[24-hour]')) {
      return name.replace('[24-hour]', '24-hour');
    }
    return name;
  };

  const isSelected = (activityName) => {
    return selectedStaycations.some(s => s.name === activityName);
  };

  const getSelectedByType = (type) => {
    return selectedStaycations.filter(s => s.staycationtype === type);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('staycations')}</h1>
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
        {/* Available Staycations */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Available Staycation Activities</h2>
            <p className="text-sm text-gray-600">Click to add activities to your hotel</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-6">
              {Object.entries(availableStaycations).map(([type, data]) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={data.icon} alt={type} className="w-8 h-8" />
                    <h3 className="font-semibold text-lg">{type}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {data.activities.map((activity, index) => (
                      <div
                        key={index}
                        className={`p-2 border rounded cursor-pointer transition-all ${
                          isSelected(activity)
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                        onClick={() => addStaycation(activity, type)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {getProcessedStaycationName(activity)}
                          </span>
                          {isSelected(activity) && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center ml-auto">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Staycations */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Selected Staycation Activities</h2>
            <p className="text-sm text-gray-600">Activities for the selected hotel</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : selectedStaycations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No staycation activities selected. Choose from available activities.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(availableStaycations).map(([type, data]) => {
                  const typeActivities = getSelectedByType(type);
                  if (typeActivities.length === 0) return null;

                  return (
                    <div key={type} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={data.icon} alt={type} className="w-6 h-6" />
                        <h3 className="font-semibold">{type}</h3>
                      </div>
                      <div className="space-y-2">
                        {typeActivities.map((staycation) => (
                          <div key={staycation._id} className="p-2 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium flex-1">
                                {getProcessedStaycationName(staycation.name)}
                              </span>
                              <button
                                onClick={() => removeStaycation(staycation._id)}
                                className="w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
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

export default Staycations;