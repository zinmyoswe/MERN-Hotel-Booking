import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import { Loader2 } from "lucide-react";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');

  const roomViewOptions = [
    'City View', 'Sea View', 'Ocean View', 'River View', 'Lake View',
    'Mountain View', 'Garden View', 'Pool View', 'Landmark View', 'Park View',
    'Partial Sea/City View', 'Forest View',
  ];

  const roomTypeOptions = [
    'Single Room', 'Double Room', 'Twin Room', '2-Bedroom Double', '1 King Room',
    'King Room', 'Triple Room', 'Quad Room',
    'Deluxe Room', 'Deluxe Twin Room', 'Grand Deluxe Room', 'Superior Room',
    'Executive Room', 'Premier Room', 'Family Room', 'Connecting Rooms',
    'Dormitory Room (Hostel / shared)',
  ];

  const bedOptions = [
    'Single Bed', 'Double Bed', 'Queen Bed', 'King Bed', 'Twin Beds',
    'Bunk Bed', 'Sofa Bed', 'Extra Bed',
  ];

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    quantity: 1,
    isAvailable: true,
    RoomView: '',
    Adults: '',
    Bed: '',
    SquareFeet: '',
    discountType: '',
    discountPercentage: '',
    originalPrice: '',
    amenities: {
      'Free Wi-Fi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Swimming Pool': false,
      'Fitness Center': false,
      'Air Conditioning': false,
      'Parking': false,
      'Pet Friendly': false,
    },
  });

  const onInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const onSelectChangeHandler = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const onAmenityChangeHandler = (amenity) => {
    setInputs((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);

        // Fetch hotels
        const hotelsResponse = await axios.get('/api/hotels/owner', {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });
        if (hotelsResponse.data.success) {
          setHotels(hotelsResponse.data.hotels);
        }

        // Fetch room data
        const roomResponse = await axios.get(`/api/rooms/${id}`);
        if (roomResponse.data.success) {
          const room = roomResponse.data.room;

          // Set form data
          setInputs({
            roomType: room.roomType,
            pricePerNight: room.pricePerNight.toString(),
            quantity: room.quantity || 1,
            isAvailable: room.isAvailable,
            RoomView: room.RoomView,
            Adults: room.Adults,
            Bed: room.Bed,
            SquareFeet: room.SquareFeet,
            discountType: room.discountType || '',
            discountPercentage: room.discountPercentage ? room.discountPercentage.toString() : '',
            originalPrice: room.originalPrice ? room.originalPrice.toString() : '',
            amenities: {
              'Free Wi-Fi': room.amenities.includes('Free Wi-Fi'),
              'Free Breakfast': room.amenities.includes('Free Breakfast'),
              'Room Service': room.amenities.includes('Room Service'),
              'Swimming Pool': room.amenities.includes('Swimming Pool'),
              'Fitness Center': room.amenities.includes('Fitness Center'),
              'Air Conditioning': room.amenities.includes('Air Conditioning'),
              'Parking': room.amenities.includes('Parking'),
              'Pet Friendly': room.amenities.includes('Pet Friendly'),
            },
          });

          setSelectedHotel(room.hotel._id);
          setExistingImages(room.images || []);
        }
      } catch (error) {
        toast.error('Failed to fetch room data');
        console.error(error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validate discount fields
    if (inputs.discountType) {
      if ((inputs.discountType === 'price_dropped' || inputs.discountType === 'price_increased') && !inputs.discountPercentage) {
        toast.error('Please enter discount percentage for price changes');
        return;
      }
      if (!inputs.originalPrice) {
        toast.error('Please enter original price for discount calculation');
        return;
      }
    }
    
    if (
      !selectedHotel ||
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.quantity ||
      !inputs.RoomView ||
      !inputs.Adults ||
      !inputs.Bed ||
      !inputs.SquareFeet
    ) {
      toast.error('Please fill all the fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('hotel', selectedHotel);
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);
      formData.append('quantity', inputs.quantity);
      formData.append('isAvailable', inputs.isAvailable);
      formData.append('RoomView', inputs.RoomView);
      formData.append('Adults', inputs.Adults);
      formData.append('Bed', inputs.Bed);
      formData.append('SquareFeet', inputs.SquareFeet);
      if (inputs.discountType) {
        formData.append('discountType', inputs.discountType);
        formData.append('discountPercentage', inputs.discountPercentage);
        formData.append('originalPrice', inputs.originalPrice);
      }

      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append('amenities', JSON.stringify(amenities));

      // Only append new images if they were selected
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const { data } = await axios.put(`/api/rooms/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        toast.success('Room updated successfully');
        navigate('/owner/list-room');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading room data...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotel Selection */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hotel">Select Hotel</Label>
              <Select onValueChange={setSelectedHotel} value={selectedHotel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select onValueChange={(value) => onSelectChangeHandler('roomType', value)} value={inputs.roomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypeOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerNight">Price per night</Label>
              <Input
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                placeholder="eg.100"
                value={inputs.pricePerNight}
                onChange={onInputChangeHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={inputs.quantity}
                onChange={onInputChangeHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type (Optional)</Label>
              <Select onValueChange={(value) => onSelectChangeHandler('discountType', value)} value={inputs.discountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_dropped">Price has dropped</SelectItem>
                  <SelectItem value="mega_sale">MEGA SALE</SelectItem>
                  <SelectItem value="price_increased">Price has increased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(inputs.discountType === 'price_dropped' || inputs.discountType === 'price_increased') && (
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="1"
                  max="99"
                  placeholder="e.g. 20"
                  value={inputs.discountPercentage}
                  onChange={onInputChangeHandler}
                />
              </div>
            )}
            {inputs.discountType && (
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={inputs.originalPrice}
                  onChange={onInputChangeHandler}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="RoomView">Room View</Label>
              <Select onValueChange={(value) => onSelectChangeHandler('RoomView', value)} value={inputs.RoomView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Room View" />
                </SelectTrigger>
                <SelectContent>
                  {roomViewOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Adults">Adults</Label>
              <Input
                id="Adults"
                name="Adults"
                type="number"
                placeholder="e.g. 2"
                value={inputs.Adults}
                onChange={onInputChangeHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Bed">Bed</Label>
              <Select onValueChange={(value) => onSelectChangeHandler('Bed', value)} value={inputs.Bed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Bed Type" />
                </SelectTrigger>
                <SelectContent>
                  {bedOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="SquareFeet">Square Feet</Label>
              <Input
                id="SquareFeet"
                name="SquareFeet"
                type="number"
                placeholder="e.g. 300"
                value={inputs.SquareFeet}
                onChange={onInputChangeHandler}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(inputs.amenities).map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={inputs.amenities[amenity]}
                      onCheckedChange={() => onAmenityChangeHandler(amenity)}
                    />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Current Images</Label>
              {existingImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {existingImages.map((image, index) => (
                    <img key={index} src={image} alt={`current ${index}`} className="w-full h-auto rounded-md" />
                  ))}
                </div>
              )}

              <Label htmlFor="images">Update Images (optional)</Label>
              <div className='grid grid-cols-1 gap-4'>
                <Input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="col-span-4"
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`preview ${index}`} className="w-full h-auto rounded-md" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Room...
                </span>
              ) : (
                'Update Room'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/owner/list-room')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;