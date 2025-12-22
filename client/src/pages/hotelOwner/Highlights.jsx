import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Plus, X, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Highlights = () => {
  const { axios, getToken } = useAppContext();
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [availableHighlights, setAvailableHighlights] = useState([]);
  const [selectedHighlights, setSelectedHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customValues, setCustomValues] = useState({}); // Store custom values for customizable highlights

  useEffect(() => {
    fetchHotels();
    fetchAvailableHighlights();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchHotelHighlights();
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

  const fetchAvailableHighlights = async () => {
    try {
      const { data } = await axios.get('/api/highlights/available');
      if (data.success) {
        setAvailableHighlights(data.highlights);
      }
    } catch (error) {
      toast.error('Failed to fetch available highlights');
    }
  };

  const fetchHotelHighlights = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/highlights/${selectedHotel}`);
      if (data.success) {
        setSelectedHighlights(data.highlights);
      }
    } catch (error) {
      toast.error('Failed to fetch hotel highlights');
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = async (highlight, customValue = null) => {
    try {
      // Check if already selected
      const exists = selectedHighlights.find(h => h.name === highlight.name);
      if (exists) {
        toast.error('Highlight already added');
        return;
      }

      // If highlight is customizable and no custom value provided, prompt for it
      if (highlight.isCustomizable && !customValue) {
        const value = prompt(`Enter custom value for "${highlight.name}":`, '320');
        if (!value || value.trim() === '') {
          return; // User cancelled or entered empty value
        }
        customValue = value.trim();
      }

      const { data } = await axios.post('/api/highlights', {
        ...highlight,
        hotelId: selectedHotel,
        customValue: customValue || ''
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Highlight added successfully');
        fetchHotelHighlights();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add highlight');
    }
  };

  const removeHighlight = async (highlightId) => {
    try {
      const { data } = await axios.delete(`/api/highlights/${highlightId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success('Highlight removed successfully');
        fetchHotelHighlights();
      }
    } catch (error) {
      toast.error('Failed to remove highlight');
    }
  };

  const getProcessedName = (name, hotel) => {
    if (name.includes('[City]')) {
      return name.replace('[City]', hotel?.city || 'City');
    }
    if (name.includes('[Bangkok]')) {
      return name.replace('[Bangkok]', hotel?.city || 'Bangkok');
    }
    return name;
  };

  const getProcessedHighlightName = (highlight, hotel) => {
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

  const isSelected = (highlight) => {
    return selectedHighlights.some(h => h.name === highlight.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('highlights')}</h1>
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
        {/* Available Highlights */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Available Highlights</h2>
            <p className="text-sm text-gray-600">Click to add highlights to your hotel</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
              {availableHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected(highlight)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => addHighlight(highlight)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      highlight.isGreenIcon ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <img
                        src={highlight.highlighticonurl}
                        alt={highlight.name}
                        className={`w-5 h-5 ${highlight.isGreenIcon ? 'filter brightness-0 saturate-100' : ''}`}
                        style={highlight.isGreenIcon ? { filter: 'brightness(0) saturate(100%) invert(21%) sepia(96%) saturate(1234%) hue-rotate(87deg) brightness(95%) contrast(105%)' } : {}}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {getProcessedName(highlight.name, hotels.find(h => h._id === selectedHotel))}
                      </p>
                    </div>
                    {isSelected(highlight) && (
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

        {/* Selected Highlights */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Selected Highlights</h2>
            <p className="text-sm text-gray-600">Highlights for the selected hotel</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : selectedHighlights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No highlights selected. Choose from available highlights.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {selectedHighlights.map((highlight) => {
                  const hotel = hotels.find(h => h._id === selectedHotel);
                  return (
                    <div key={highlight._id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          highlight.isGreenIcon ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <img
                            src={highlight.highlighticonurl}
                            alt={highlight.name}
                            className={`w-5 h-5 ${highlight.isGreenIcon ? 'filter brightness-0 saturate-100' : ''}`}
                            style={highlight.isGreenIcon ? { filter: 'brightness(0) saturate(100%) invert(21%) sepia(96%) saturate(1234%) hue-rotate(87deg) brightness(95%) contrast(105%)' } : {}}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {getProcessedHighlightName(highlight, hotel)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeHighlight(highlight._id)}
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

export default Highlights;