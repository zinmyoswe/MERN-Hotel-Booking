import React from 'react';
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

const rooms = [
  {
    title: 'Deluxe Room',
    hotel: 'Grand Hyatt',
    price: 200,
  },
  {
    title: 'Single Room',
    hotel: 'Hilton Garden Inn',
    price: 150,
  },
  {
    title: 'Suite',
    hotel: 'Marriott Marquis',
    price: 300,
  },
];

const ListRoom = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('rooms')}</h2>
        <Button asChild>
          <Link to="/hotel-owner/add-room">
            <Plus className="mr-2 h-4 w-4" /> {t('addRoom')}
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-md shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell>{room.title}</TableCell>
                <TableCell>{room.hotel}</TableCell>
                <TableCell>${room.price}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
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