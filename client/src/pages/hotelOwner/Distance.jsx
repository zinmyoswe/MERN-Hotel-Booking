import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Plus, X, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Distance = () => {
  const { axios, getToken } = useAppContext();
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [mainDistance, setMainDistance] = useState('');
  const [subDistances, setSubDistances] = useState(['']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchHotelDistance();
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

  const fetchHotelDistance = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/distances/${selectedHotel}`);
      if (data.success && data.distance) {
        setMainDistance(data.distance.mainDistance);
        setSubDistances(data.distance.subDistances.length > 0 ? data.distance.subDistances : ['']);
      } else {
        // Reset form for new distance
        setMainDistance('');
        setSubDistances(['']);
      }
    } catch (error) {
      toast.error('Failed to fetch hotel distance');
      setMainDistance('');
      setSubDistances(['']);
    } finally {
      setLoading(false);
    }
  };

  const addSubDistance = () => {
    setSubDistances([...subDistances, '']);
  };

  const removeSubDistance = (index) => {
    if (subDistances.length > 1) {
      const newSubDistances = subDistances.filter((_, i) => i !== index);
      setSubDistances(newSubDistances);
    }
  };

  const updateSubDistance = (index, value) => {
    const newSubDistances = [...subDistances];
    newSubDistances[index] = value;
    setSubDistances(newSubDistances);
  };

  const saveDistance = async () => {
    if (!mainDistance.trim()) {
      toast.error('Main distance is required');
      return;
    }

    // Filter out empty sub distances
    const filteredSubDistances = subDistances.filter(distance => distance.trim() !== '');

    try {
      const { data } = await axios.post(`/api/distances/${selectedHotel}`, {
        mainDistance: mainDistance.trim(),
        subDistances: filteredSubDistances
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Distance information saved successfully');
        fetchHotelDistance(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save distance information');
    }
  };

  const deleteDistance = async () => {
    try {
      const { data } = await axios.delete(`/api/distances/${selectedHotel}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Distance information deleted successfully');
        setMainDistance('');
        setSubDistances(['']);
      }
    } catch (error) {
      toast.error('Failed to delete distance information');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Distance Information</h1>
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

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            Distance Information
          </h2>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-6">
              {/* Main Distance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Main Distance (e.g., "0.7 km to center")
                </label>
                <input
                  type="text"
                  value={mainDistance}
                  onChange={(e) => setMainDistance(e.target.value)}
                  placeholder="Enter main distance information"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sub Distances */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Distances
                  </label>
                  <button
                    onClick={addSubDistance}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={16} />
                    Add Distance
                  </button>
                </div>

                {subDistances.map((distance, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={distance}
                      onChange={(e) => updateSubDistance(index, e.target.value)}
                      placeholder={`Distance ${index + 1} (e.g., "779 m from Saint Louis BTS Station")`}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {subDistances.length > 1 && (
                      <button
                        onClick={() => removeSubDistance(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={saveDistance}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Distance Information
                </button>
                {(mainDistance || subDistances.some(d => d.trim())) && (
                  <button
                    onClick={deleteDistance}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {(mainDistance || subDistances.some(d => d.trim())) && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                📍 {hotels.find(h => h._id === selectedHotel)?.address || 'Hotel Address'}, {hotels.find(h => h._id === selectedHotel)?.city || 'City'}
              </div>
              <div className="space-y-1">
                {mainDistance && (
                  <div className="text-sm text-gray-700 font-medium">📍 {mainDistance}</div>
                )}
                {subDistances.filter(d => d.trim()).map((distance, index) => (
                  <div key={index} className="text-sm text-gray-600">📍 {distance}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distance;