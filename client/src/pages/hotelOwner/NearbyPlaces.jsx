import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, MapPin, Home, ShoppingBag, Locate, Hotel, PersonStanding } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NearbyPlaces = () => {
  const { axios, getToken } = useAppContext();
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    icon: 'location icon',
    type: 'Walkable places'
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchNearbyPlaces();
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

  const fetchNearbyPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/nearby-places/${selectedHotel}`);
      if (data.success) {
        setNearbyPlaces(data.nearbyPlaces);
      }
    } catch (error) {
      toast.error('Failed to fetch nearby places');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, hotelId: selectedHotel };
      if (editingPlace) {
        const { data } = await axios.put(`/api/nearby-places/${editingPlace._id}`, formData, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });
        if (data.success) {
          toast.success('Nearby place updated successfully');
          fetchNearbyPlaces();
          resetForm();
        }
      } else {
        const { data } = await axios.post('/api/nearby-places', payload, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });
        if (data.success) {
          toast.success('Nearby place added successfully');
          fetchNearbyPlaces();
          resetForm();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      distance: place.distance,
      icon: place.icon,
      type: place.type
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this nearby place?')) return;
    try {
      const { data } = await axios.delete(`/api/nearby-places/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        toast.success('Nearby place deleted successfully');
        fetchNearbyPlaces();
      }
    } catch (error) {
      toast.error('Failed to delete nearby place');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      distance: '',
      icon: 'location icon',
      type: 'Walkable places'
    });
    setEditingPlace(null);
    setShowForm(false);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('nearbyPlaces')}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Nearby Place
        </button>
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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">
            {editingPlace ? 'Edit Nearby Place' : 'Add Nearby Place'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                <input
                  type="text"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  placeholder="e.g., 60 m, 2.2 km"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="houseicon">House Icon</option>
                  <option value="shopping icon">Shopping Icon</option>
                  <option value="location icon">Location Icon</option>
                  <option value="Hotel icon">Hotel Icon</option>
                  <option value="Entertainment icon">Entertainment Icon</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Walkable places">Walkable places</option>
                  <option value="Popular landmarks">Popular landmarks</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editingPlace ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nearby Places List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Nearby Places for Selected Hotel</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : nearbyPlaces.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No nearby places added yet. Click "Add Nearby Place" to get started.
          </div>
        ) : (
          <div className="divide-y">
            {nearbyPlaces.map((place) => (
              <div key={place._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {getIconDisplay(place.icon)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{place.name}</p>
                    <p className="text-sm text-gray-500">{place.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">{place.distance}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(place)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(place._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyPlaces;