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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from 'react-hot-toast';

const hotels = [
  {
    name: 'Grand Hyatt',
    city: 'New York',
    type: 'Luxury',
  },
  {
    name: 'Hilton Garden Inn',
    city: 'London',
    type: 'Business',
  },
  {
    name: 'Marriott Marquis',
    city: 'Bangkok',
    type: 'Suite',
  },
];

const ListHotel = () => {
  const { t } = useTranslation();

  const handleDelete = () => {
    toast.success('Hotel deleted successfully!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('hotels')}</h2>
        <Button asChild>
          <Link to="/owner/add-hotel">
            <Plus className="mr-2 h-4 w-4" /> {t('addHotel')}
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-md shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel, index) => (
              <TableRow key={index}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.city}</TableCell>
                <TableCell>{hotel.type}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the hotel.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListHotel;