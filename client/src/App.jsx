import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AllHotels from './pages/AllHotels';
import AllFlights from './pages/AllFlights';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';
import HotelRegister from './components/HotelRegister';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import ListHotel from './pages/hotelOwner/ListHotel';
import ListRoom from './pages/hotelOwner/ListRoom';
import AddHotel from './pages/hotelOwner/AddHotel';
import AddRoom from './pages/hotelOwner/AddRoom';
import EditHotel from './pages/hotelOwner/EditHotel';
import NearbyPlaces from './pages/hotelOwner/NearbyPlaces';
import Highlights from './pages/hotelOwner/Highlights';
import Facilities from './pages/hotelOwner/Facilities';
import Staycations from './pages/hotelOwner/Staycations';
import Distance from './pages/hotelOwner/Distance';
import {Toaster} from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import Footer2 from './components/Footer2';
import Footer1 from './components/Footer1';

const App = () => {
  const isOwnerPath = useLocation().pathname.startsWith('/owner');
  const {showHotelRegister} = useAppContext();

  return (
    <div>
      <Toaster position="top-center" />
      {!isOwnerPath && <Navbar />}
      {showHotelRegister && <HotelRegister />}

      <div className={!isOwnerPath ? 'min-h-[70vh]' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<AllHotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/flights" element={<AllFlights />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="list-hotel" element={<ListHotel />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="add-hotel" element={<AddHotel />} />
            <Route path="edit-hotel/:id" element={<EditHotel />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="nearby-places" element={<NearbyPlaces />} />
            <Route path="highlights" element={<Highlights />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="staycations" element={<Staycations />} />
            <Route path="distance" element={<Distance />} />
          </Route>
        </Routes>

        {!isOwnerPath && <Footer1 />}
        {!isOwnerPath && <Footer2 />}
      </div>
    </div>
  );
};

export default App;