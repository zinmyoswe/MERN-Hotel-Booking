import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import AllHotels from './pages/AllHotels';
import AllFlights from './pages/AllFlights';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar /> }
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/hotels' element={<AllHotels />} />
          <Route path='/hotels/:id' element={<HotelDetails />} />
          <Route path='/flights' element={<AllFlights />} />
          <Route path='/my-bookings' element={<MyBookings />} />
        </Routes>
      </div>
      
    </div>
  )
}

export default App