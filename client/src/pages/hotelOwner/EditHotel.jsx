import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from "lucide-react";
import { useParams } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(3, 'Hotel name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contact: z.string().min(10, 'Contact must be at least 10 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  zipcode: z.string().min(5, 'Zipcode must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  mapUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  hotelMainImage: z.any().optional(),
  hotelSubImages: z.any().optional(),
});

const EditHotel = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setHotel(result.hotel);
          // Pre-populate form
          Object.keys(result.hotel).forEach(key => {
            if (key !== '_id' && key !== 'owner' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
              setValue(key, result.hotel[key]);
            }
          });
        } else {
          toast.error(result.message || 'Failed to fetch hotel.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching the hotel.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, getToken, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = await getToken();
      const formData = new FormData();

      Object.keys(data).forEach(key => {
        if ((key === 'hotelMainImage' || key === 'hotelSubImages') && data[key]?.length > 0) {
          Array.from(data[key]).forEach(file => {
            formData.append(key, file);
          });
        } else if (key !== 'hotelMainImage' && key !== 'hotelSubImages') {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Hotel updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update hotel.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the hotel.');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (!hotel) {
    return <div>Hotel not found.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('editHotel')}</h2>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input id="name" placeholder="e.g. Grand Hyatt" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 123 Main St" {...register('address')} />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" placeholder="e.g. +1234567890" {...register('contact')} />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. New York" {...register('city')} />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="e.g. NY" {...register('state')} />
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="e.g. USA" {...register('country')} />
              {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input id="zipcode" placeholder="e.g. 10001" {...register('zipcode')} />
              {errors.zipcode && <p className="text-red-500 text-sm">{errors.zipcode.message}</p>}
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
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" placeholder="e.g. https://www.youtube.com/watch?v=video" {...register('videoUrl')} />
              {errors.videoUrl && <p className="text-red-500 text-sm">{errors.videoUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapUrl">Map URL</Label>
              <Input id="mapUrl" placeholder="e.g. https://maps.google.com/..." {...register('mapUrl')} />
              {errors.mapUrl && <p className="text-red-500 text-sm">{errors.mapUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotelMainImage">Main Image (optional)</Label>
              <Input id="hotelMainImage" type="file" {...register('hotelMainImage')} />
              {errors.hotelMainImage && <p className="text-red-500 text-sm">{errors.hotelMainImage.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotelSubImages">Sub Images (optional)</Label>
              <Input id="hotelSubImages" type="file" multiple {...register('hotelSubImages')} />
              {errors.hotelSubImages && <p className="text-red-500 text-sm">{errors.hotelSubImages.message}</p>}
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Hotel...
                </span>
              ) : (
                t('editHotel')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;