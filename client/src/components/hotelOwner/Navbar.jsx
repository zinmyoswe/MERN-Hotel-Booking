import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  return (
    // Light header with a subtle shadow and light bottom border
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-md">
      
      {/* --- Left Section: Mobile Menu and Search --- */}
      <div className="flex items-center space-x-6">
        
        {/* Mobile Menu Button */}
        {/* Hidden on desktop, visible on small screens */}
        <button className="text-gray-600 focus:outline-none md:hidden p-1 rounded hover:bg-gray-100 transition duration-150">
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            className="w-48 sm:w-64 pl-10 pr-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
            type="text" 
            placeholder="Search..." 
          />
        </div>
      </div>
      
      {/* --- Right Section: Icons and User Button --- */}
      <div className="flex items-center space-x-4">
        
        {/* Notification Bell */}
        <button 
          className="relative p-2 text-gray-600 rounded-full hover:text-indigo-600 hover:bg-gray-100 transition duration-150 focus:outline-none"
        >
          <Bell className="w-6 h-6" />
          {/* Optional: Notification indicator dot */}
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </button>
        
        {/* User Profile Button (Clerk) */}
        <div className="relative">
          <UserButton 
            appearance={{
              elements: {
                // Subtle border color that fits the light theme
                userButtonAvatarBox: "w-9 h-9 border-2 border-indigo-400 hover:border-indigo-600 transition duration-150",
              }
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;