import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(3, 'Room title must be at least 3 characters'),
  hotel: z.string().min(1, 'Please select a hotel'),
  price: z.coerce.number().min(1, 'Price must be at least 1'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.any(),
});

const AddRoom = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Room added successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('addRoom')}</h2>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Room Title</Label>
              <Input id="title" placeholder="e.g. Deluxe Room" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotel">Hotel</Label>
              <Controller
                name="hotel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="hotel">
                      <SelectValue placeholder="Select a hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grand-hyatt">Grand Hyatt</SelectItem>
                      <SelectItem value="hilton-garden-inn">Hilton Garden Inn</SelectItem>
                      <SelectItem value="marriott-marquis">Marriott Marquis</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.hotel && <p className="text-red-500 text-sm">{errors.hotel.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price per night</Label>
              <Input id="price" type="number" placeholder="e.g. 100" {...register('price')} />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows="4"
                className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g. A spacious room with a king-sized bed."
                {...register('description')}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="image">Room Image</Label>
              <Input id="image" type="file" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit">{t('addRoom')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;