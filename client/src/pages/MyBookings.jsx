import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
    const { axios, getToken, user } = useAppContext();
    const [bookings, setBookings] = useState([]);

    const fetchUserBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            if (data.success) {
                window.location.href = data.url;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user])

    return (
        <div className='bg-[#f8f9fa] min-h-screen py-20 md:py-28 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='max-w-6xl mx-auto'>
                <Title title='My Bookings' subTitle='Manage your upcoming and past trips' align='left' />

                <div className='flex flex-col gap-6 mt-10'>
                    {bookings.length > 0 ? bookings.map((booking) => (
                        <div key={booking._id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300'>
                            <div className='flex flex-col md:flex-row'>
                                
                                {/* Image Section */}
                                <div className='md:w-72 h-48 md:h-auto overflow-hidden'>
                                    <img
                                        src={booking.room.images && (Array.isArray(booking.room.images[0]) ? booking.room.images[0][1] : booking.room.images[0])}
                                        alt="hotel"
                                        className='w-full h-[270px] object-cover transition-transform duration-500 hover:scale-110'
                                    />
                                </div>

                                {/* Content Section */}
                                <div className='flex-1 p-5 flex flex-col justify-between'>
                                    <div>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='text-xl font-bold text-gray-800 leading-tight'>
                                                    {booking.hotel.name}
                                                </h3>
                                                <p className='text-sm text-blue-500 font-semibold mb-2'>{booking.room.roomType} - {booking.room.RoomView}</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='text-xs text-gray-400 uppercase font-bold tracking-wider'>Total Price</p>
                                                <p className='text-3xl font-semibold  text-red-500'>${booking.totalPrice}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
                                            <img src={assets.locationIcon} className='w-4 h-4' alt="" />
                                            <span>{booking.hotel.address}, {booking.hotel.city}, {booking.hotel.country}</span>
                                        </div>

                                        <div className='flex flex-wrap items-center gap-4 mt-4'>
                                            <div className='bg-gray-50 p-2 rounded-lg border border-gray-100'>
                                                <p className='text-[10px] uppercase text-gray-400 font-bold'>Check-In</p>
                                                <p className='text-sm font-medium text-gray-700'>{new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <div className='h-4 w-[1px] bg-gray-300 hidden sm:block'></div>
                                            <div className='bg-gray-50 p-2 rounded-lg border border-gray-100'>
                                                <p className='text-[10px] uppercase text-gray-400 font-bold'>Check-Out</p>
                                                <p className='text-sm font-medium text-gray-700'>{new Date(booking.checkOutDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Section */}
                                    <div className='mt-6 flex flex-row items-center justify-between border-t pt-4'>
                                        <div className='flex items-center gap-2'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${booking.isPaid ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                                                {booking.isPaid ? "● Confirmed" : "● Pending Payment"}
                                            </span>
                                            <span className='flex items-center gap-1 text-xs text-gray-500'>
                                                <img src={assets.guestsIcon} className='w-3 h-3' alt="" />
                                                {booking.guests} Guests
                                            </span>
                                        </div>

                                        {!booking.isPaid && (
                                            <button
                                                onClick={() => handlePayment(booking._id)}
                                                className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 cursor-pointer'
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className='text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200'>
                           <p className='text-gray-500'>You have no bookings yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyBookings