import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom' ;
import { useAppContext } from '@/context/AppContext';

const RecommendedHotels = () => {

    const {rooms, searchedCities} = useAppContext();
    const [recommended, setRecommended] = useState([]);

    const filterHotels = () => {
        const filteredHotels = rooms.slice().filter(room => searchedCities.includes(room.hotel.city)
        );
        setRecommended(filteredHotels);
    }

    useEffect(() => {
        filterHotels();
    }, [rooms, searchedCities]);




  return recommended.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

        <Title title='Recommended Hotels' subTitle='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium fuga quam voluptate quia laboriosam impedit pariatur numquam magnam eum facilis, maiores, id aut eius corrupti voluptatum ad eos ipsa molestias?'/>
        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {recommended.slice(0, 4).filter(room => room.hotel).map((room) => (
                <HotelCard key={room._id} hotel={room.hotel} />
            ))}
        </div>

       
    </div>
  )
}

export default RecommendedHotels