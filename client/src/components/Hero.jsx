import React from 'react'
import { assets, cities } from '../assets/assets'
import { UsersRound } from 'lucide-react'




const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center px-6
    md:px-16 lg:px-24 xl:px-32 text-white
    bg-[url("/src/assets/bg-Trip-homepage.png")] bg-no-repeat bg-cover h-[55vh] md:h-[65vh] lg:h-[65vh]'>
       
        <h1 class="text-3xl mt-4 md:mt-24  uppercase  md:text-3xl font-medium max-w-2xl text-center">
        See the world for less
        </h1>


        {/* form */}
       <form className='bg-white mt-4 md:mt-24 text-gray-800 rounded-xl p-3 md:p-4 flex flex-col md:flex-row max-md:items-start md:items-center gap-2 md:gap-4 max-md:mx-auto shadow-2xl'>

    {/* Destination Input - Styled for Prominence */}
    <div className='flex-grow'>
        <div className='flex items-center gap-2 mb-1'>
            <img src={assets.calenderIcon} alt='Destination Icon' className='h-5 text-indigo-500' />
            <label htmlFor="destinationInput" className='font-bold text-base'>Destination</label>
        </div>
        <input list='destinations' id="destinationInput" type="text" className="w-full rounded bg-gray-50 px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150 placeholder-gray-400" placeholder="e.g. Bangkok, Thailand" required />
        <datalist id='destinations'>
            {cities.map((city, index) => (
                <option value={city} key={index} />
            ))}
        </datalist>
    </div>

    {/* Check In Input */}
    <div className='md:w-1/5'>
        <div className='flex items-center gap-2 mb-1'>
            <img src={assets.calenderIcon} alt="Check In Icon" className='h-5 text-indigo-500' />
            <label htmlFor="checkIn" className='font-bold text-sm'>Check in</label>
        </div>
        <input id="checkIn" type="date" className="w-full rounded bg-gray-50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150" />
    </div>

    {/* Check Out Input */}
    <div className='md:w-1/5'>
        <div className='flex items-center gap-2 mb-1'>
            <img src={assets.calenderIcon} alt="Check Out Icon" className='h-5 text-indigo-500' />
            <label htmlFor="checkOut" className='font-bold text-sm'>Check out</label>
        </div>
        <input id="checkOut" type="date" className="w-full rounded bg-gray-50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150" />
    </div>

    {/* Guests Input */}
    <div className='md:w-1/6'>
    <div className='flex items-center gap-2 mb-1'>
        <UsersRound className='w-6 text-gray-500'/>
        
        <label htmlFor="guests" className='font-bold text-sm'>Guests</label>
        </div>
        <input min={1} max={10} id="guests" type="number" className="w-full rounded bg-gray-50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150 placeholder-gray-400" placeholder="1" />
    </div>

    {/* Search Button - Styled with Agoda's Primary Color and Shadow */}
    <button className='flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 md:py-2 px-5 text-white font-bold cursor-pointer transition duration-200 shadow-md hover:shadow-lg max-md:w-full mt-4 max-md:mt-2' >
        <img src={assets.searchIcon} alt="Search Icon" className='h-6 md:h-6 mr-1' />
        <span className='text-lg'>Search</span>
    </button>
</form> 
    </div>
  )
}

export default Hero