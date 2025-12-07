import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom' ;
import { useAppContext } from '@/context/AppContext';

const RecommendedHotels = () => {

    const {rooms, searchedCities} = useAppContext();
    const [recommended, setRecommended] = useState([]);

    const filterHotels = () => {
        const filteredHotels = rooms.filter((room) => {
            return searchedCities.includes(room.hotel.city);
        });
        setRecommended(filteredHotels);
    }



  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

        <Title title='Featured Destination' subTitle='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium fuga quam voluptate quia laboriosam impedit pariatur numquam magnam eum facilis, maiores, id aut eius corrupti voluptatum ad eos ipsa molestias?'/>
        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {rooms.slice(0,4).map((room, index) => (
                <HotelCard key={room._id} room={room} index={index} />
            ))}
        </div>

        <button onClick={() => {navigate('/hotels')}}  className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50
        transition-all cursor-pointer'>
            View All Destinations
        </button>
    </div>
  )
}

export default RecommendedHotels