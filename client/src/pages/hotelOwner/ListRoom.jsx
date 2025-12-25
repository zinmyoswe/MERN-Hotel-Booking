import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash, FileEdit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';


const ListRoom = () => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState([])
  const {axios, getToken, user} = useAppContext();

  //Fetch rooms of the Hotel Owner
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms/owner', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if(data.success){
         setRooms(data.rooms);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  //Toggle Avaialability of Room
  const toggleAvailability = async (roomId) => {
    const {data} = await axios.post('/api/rooms/toggle-availability', {roomId}, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    if(data.success){
      toast.success(data.message);
      fetchRooms();
    }
    else{
      toast.error(data.message);
    }
  }

  useEffect(() => {
    if(user){
      fetchRooms();
    }
  }, [user])


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('rooms')}</h2>
        <Button asChild>
          <Link to="/owner/add-room">
            <Plus className="mr-2 h-4 w-4" /> {t('addRoom')}
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-md shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Room View</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell>
                  <img 
                src={room.images && (Array.isArray(room.images[0]) ? room.images[0][1] : room.images[0])} 
                alt="" 
                className='w-36 h-36 object-cover' />
                </TableCell>
                
                <TableCell>{room.roomType}</TableCell>
                <TableCell>{room.RoomView}</TableCell>
                <TableCell>{room.hotel.name}</TableCell>
                <TableCell>${room.pricePerNight}</TableCell>
                <TableCell>{room.quantity || 1}</TableCell>
                <TableCell>
                  {room.discountType ? (
                    <span className={`text-xs px-2 py-1 rounded ${
                      room.discountType === 'price_dropped' ? 'bg-green-100 text-green-800' :
                      room.discountType === 'mega_sale' ? 'bg-red-100 text-red-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {room.discountType === 'price_dropped' && `-${room.discountPercentage}%`}
                      {room.discountType === 'mega_sale' && 'MEGA SALE'}
                      {room.discountType === 'price_increased' && `+${room.discountPercentage}%`}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">No discount</span>
                  )}
                </TableCell>
                <TableCell>{room.hotel.city}, {room.hotel.country}</TableCell>
                
                <TableCell>
                  <Switch
                    checked={room.isAvailable}
                    onCheckedChange={() => toggleAvailability(room._id)}
                  />
                </TableCell>
                <TableCell>
                  <Link to={`/owner/edit-room/${room._id}`}>
                    <Button variant="ghost" size="icon">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListRoom;