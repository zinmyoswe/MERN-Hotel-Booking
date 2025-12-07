import React, { useState, useEffect } from 'react';
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

const AddRoom = () => {
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const roomViewOptions = [
    'City View', 'Sea View', 'Ocean View', 'River View', 'Lake View',
    'Mountain View', 'Garden View', 'Pool View', 'Landmark View',
    'Partial Sea/City View',
  ];

  const roomTypeOptions = [
    'Single Room', 'Double Room', 'Twin Room', 'Triple Room', 'Quad Room',
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
    isAvailable: true,
    RoomView: '',
    Adults: '',
    Bed: '',
    SquareFeet: '',
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
  }

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.RoomView ||
      !inputs.Adults ||
      !inputs.Bed ||
      !inputs.SquareFeet ||
      images.length === 0
    ) {
      toast.error('Please fill all the fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);
      formData.append('isAvailable', inputs.isAvailable);
      formData.append('RoomView', inputs.RoomView);
      formData.append('Adults', inputs.Adults);
      formData.append('Bed', inputs.Bed);
      formData.append('SquareFeet', inputs.SquareFeet);

      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append('amenities', JSON.stringify(amenities));

      images.forEach((image) => {
        formData.append('images', image);
      });

      const { data } = await axios.post('/api/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: '',
          pricePerNight: '',
          isAvailable: true,
          RoomView: '',
          Adults: '',
          Bed: '',
          SquareFeet: '',
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
        setImages([]);
        setImagePreviews([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Room</h2>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="images">Room Images</Label>
              <div className='grid grid-cols-1 gap-4'>
                <Input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="col-span-4"
                />
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`preview ${index}`} className="w-full h-auto rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
