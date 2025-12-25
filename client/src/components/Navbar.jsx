
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import {assets} from '../assets/assets.js';
import { BookCheck, ChevronDown, LogIn, Search } from 'lucide-react';
import { useClerk,UserButton  } from "@clerk/clerk-react";
import { useAppContext } from '@/context/AppContext.jsx';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels & Homes', path: '/hotels' },
        // { name: 'Flights', path: '/flights' },
    ];

    

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showTransport, setShowTransport] = useState(false);

    const {openSignIn} = useClerk()
    const {openSignUp} = useClerk()
    const { signOut } = useClerk();
    const location = useLocation()

    const {user, navigate, isOwner, setShowHotelRegister} = useAppContext();

    useEffect(() => {

        if(location.pathname !== '/'){
            setIsScrolled(true);
            return;
        }else{
            setIsScrolled(false)
        }
        setIsScrolled(prev => location.pathname !== '/' ? true: prev);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (
        
         
            <nav className={`fixed top-0 left-0 bg-white w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-24 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-2" : "py-3 md:py-2"}`}>
                
                <div className='md:hidden lg:hidden'>
                <Link to='/'>
                    <img src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg" alt="logo"
                    className={`h-[37px]  ${isScrolled && ""}`} />
                </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {/* Logo */}
                <Link to='/'>
                    <img src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg" alt="logo"
                    className={`h-[37px] mr-16 ${isScrolled && ""}`} />
                </Link>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col text-[17px] gap-0.5 ${isScrolled ? "text-gray-800" : "text-black"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-white" : "bg-black"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}

{/* 🔽 Transport Dropdown */}
<div className="relative group">
    <button
        className={`flex items-center mb-1 gap-1 cursor-pointer ${
            isScrolled ? "text-gray-800" : "text-black"
        }`}
    >
        Transport
        <span className="text-xs transition-transform group-hover:rotate-180">
            <ChevronDown />
        </span>
    </button>

    {/* Dropdown */}
    <div
        className="absolute top-full left-0 pt-3 opacity-0 invisible 
                   group-hover:opacity-100 group-hover:visible
                   transition-all duration-200 z-[1000]"
    >
        <div className="w-56 bg-white shadow-lg rounded-lg border overflow-hidden">
            <a href="/flights" className="block px-4 py-2 hover:bg-gray-100">
                Flights
            </a>
            <a href="https://agoda.12go.asia/en?utm_source=desktop&utm_medium=-999&utm_campaign=header_transp_buses_link" className="block px-4 py-2 hover:bg-gray-100">
                Buses
            </a>
            <a href="http://agoda.12go.asia/en?utm_source=desktop&utm_medium=-999&utm_campaign=header_transp_trains_link" className="block px-4 py-2 hover:bg-gray-100">
                Trains
            </a>
            <a href="https://agoda.12go.asia/en?utm_source=desktop&utm_medium=-999&utm_campaign=header_transp_ferries_link" className="block px-4 py-2 hover:bg-gray-100">
                Ferries
            </a>
            <a href="https://agoda.mozio.com/en-us?pickup_datetime=01%2F01%2F2026%2012%3A00%20AM&mode=one_way&num_passengers=1&currency=THB&ref=agoda&utm_campaign=desktop_header_transp_taxi_link" className="block px-4 py-2 hover:bg-gray-100">
                Airport transfer
            </a>
            <a href="https://www.booking.com/cars/index.html?integrationType=deeplink&preflang=us&prefcurrency=THB&selected_currency=THB&aid=2431168&label=desktop-header_transp_cars_link%2Cutm_source%3Ddesktop%2Cutm_medium%3D-999%2Cutm_campaign%3Dheader_transp_cars_link" className="block px-4 py-2 hover:bg-gray-100">
                Car rentals
            </a>
        </div>
    </div>
</div>



                    {user && (
                        <button 
                        onClick={() => isOwner ? navigate('/owner') : setShowHotelRegister(true)}
                        className={`border-2 border-gray-400 hover:bg-indigo-100 hover:border-primary 
                    px-8 py-4 text-sm font-light rounded-full cursor-pointer
                    ${isScrolled ? 'text-indigo-500' : 'text-primary'} transition-all`}>
                        {isOwner ? 'Dashboard' : 'List Your Hotel'}
                    </button>
                    )
                    }   
                    
                </div>

                {/* Desktop Right */}
<div className="hidden md:flex items-center gap-4">
    <img src='https://cdn6.agoda.net/images/mobile/flag-us@2x.png' alt=''  className='w-8 mx-6'/>
    { !user ? (
        <>
            {/* Sign In Button */}
            <button 
                onClick={() => openSignIn()} 
                className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer 
                    ${isScrolled ? "bg-white text-indigo-500" : "bg-white text-primary"}`}
            >
                Sign In
            </button>

            {/* Create Account Button */}
            <button 
                onClick={() => openSignUp()} 
                className={`border-2 border-gray-400 hover:bg-indigo-100 hover:border-primary 
                    px-8 py-4 text-sm font-light rounded-full cursor-pointer
                    ${isScrolled ? 'text-indigo-500' : 'text-primary'} transition-all`}
            >
                Create account
            </button>
        </>
            ) : (
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action
                            label="My Bookings"
                            labelIcon={<BookCheck width={15} />}
                            onClick={() => navigate('/my-bookings')}
                        />
                    </UserButton.MenuItems>
                </UserButton>
            )}
        </div>


                {/* Mobile Menu Button */}
                <div className="flex items-center gap-7 md:hidden">
                     {/* MOBILE Auth Buttons */}
                {!user ? (
                    <>
                        <button
                            onClick={() => { setIsMenuOpen(false); openSignIn(); }}
                            className=" text-gray-400 px-4 py-2 rounded-full">
                            <LogIn />
                        </button>

                     
                    </>
                ) : (
                    <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action
                            label="My Bookings"
                            labelIcon={<BookCheck width={15} />}
                            onClick={() => navigate('/my-bookings')}
                        />
                    </UserButton.MenuItems>
                </UserButton>
                )}
                    <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                       <img src={assets.closeIcon} alt="close-menu" className='h-6.5'/>
                    </button>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}

                   

                    {user && (
                        <button onClick={() => isOwner ? navigate('/owner') : setShowHotelRegister(true)}
                        className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                        {isOwner ? 'Dashboard' : 'List Your Hotel'}
                    </button>
                    )
                    }   
                    

                {!user ? (
                    <>
                        <button
                            onClick={() => { setIsMenuOpen(false); openSignIn(); }}
                            className=" text-gray-400 px-4 py-2 rounded-full">
                           SignIn
                        </button>

                        <button
                            onClick={() => { setIsMenuOpen(false); openSignUp(); }}
                            className=" text-gray-400 px-4 py-2 rounded-full">
                            Create Account
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => { setIsMenuOpen(false); signOut(); }}
                        className=" text-primary px-4 py-2 rounded-full"
                    >
                        Logout
                    </button>
                )}

                   
                </div>
            </nav>
    );
}

export default Navbar