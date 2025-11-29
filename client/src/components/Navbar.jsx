
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {assets} from '../assets/assets.js';
import { BookCheck, LogIn, Search } from 'lucide-react';
import { useClerk, useUser, UserButton  } from "@clerk/clerk-react";

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Flights', path: '/flights' },
        { name: 'About', path: '/' },
    ];

    

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {user} = useUser()
    const {openSignIn} = useClerk()
    const {openSignUp} = useClerk()
    const { signOut } = useClerk();
    const navigate = useNavigate()
    const location = useLocation()

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

                {/* Logo */}
                <Link to='/'>
                    <img src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg" alt="logo"
                    className={`h-8 ${isScrolled && ""}`} />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-800" : "text-black"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-white" : "bg-black"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}

                    {user &&
                        <button onClick={() => navigate('/owner')}
                        className={`border-2 border-gray-400 hover:bg-indigo-100 hover:border-primary 
                    px-8 py-4 text-sm font-light rounded-full cursor-pointer
                    ${isScrolled ? 'text-indigo-500' : 'text-primary'} transition-all`}>
                        Dashboard
                    </button>
                    }   
                    
                </div>

                {/* Desktop Right */}
<div className="hidden md:flex items-center gap-4">
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

                    {user && 
                        <button onClick={() => navigate('/owner')} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                        Dashboard
                        </button>
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