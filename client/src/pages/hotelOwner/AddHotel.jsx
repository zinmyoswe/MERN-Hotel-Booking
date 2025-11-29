import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(3, 'Hotel name must be at least 3 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  price: z.coerce.number().min(1, 'Price must be at least 1'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.any(),
});

const AddHotel = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Hotel added successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('addHotel')}</h2>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input id="name" placeholder="e.g. Grand Hyatt" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. New York" {...register('city')} />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="e.g. USA" {...register('country')} />
              {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
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
                placeholder="e.g. A luxury hotel in the heart of the city."
                {...register('description')}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="image">Hotel Image</Label>
              <Input id="image" type="file" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit">{t('addHotel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;