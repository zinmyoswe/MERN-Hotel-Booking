import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, BedDouble, Plus, Languages, ChevronLeft, ChevronRight, HousePlus, PackagePlus, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define the menu items
const menuItems = [
  { path: '/owner/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/owner/list-hotel', icon: Building, labelKey: 'hotels' },
  { path: '/owner/list-room', icon: BedDouble, labelKey: 'rooms' },
  { path: '/owner/add-hotel', icon: HousePlus, labelKey: 'addHotel' },
  { path: '/owner/add-room', icon: PackagePlus, labelKey: 'addRoom' },
  { path: '/owner/nearby-places', icon: MapPin, labelKey: 'nearbyPlaces' },
  { path: '/owner/highlights', icon: Star, labelKey: 'highlights' },
];

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation(); // To determine the active link
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Base class for links
  const baseLinkClasses = "flex items-center py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ease-in-out font-medium";
  // Active class for the currently selected link
  const activeLinkClasses = "bg-blue-50 text-blue-600 border-r-4 border-blue-500";
  // Language button classes
  const baseLangBtnClasses = "px-2 py-1 rounded-md text-sm transition-colors duration-200";

  return (
    <div 
      className={`relative bg-white text-black h-screen shadow-2xl ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col`}
    >
      
      {/* --- Collapse Button --- */}
      <button 
        onClick={toggleSidebar} 
        className="absolute -right-3 top-6 bg-blue-500 text-white p-1.5 rounded-full shadow-lg z-10 hover:bg-blue-600 transition-colors duration-200"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* --- Logo/Title Area --- */}
      <div className="flex items-center justify-center h-16 border-b border-gray-100 p-4">
        <Link to='/'>
        <img src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg" alt="logo"
        className='h-8'/>
        </Link>
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex-grow mt-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <item.icon size={20} className={`${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
              <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- Language Switcher --- */}
      <div className="w-full border-t border-gray-100 p-4">
        <div className={`flex items-center justify-start ${isCollapsed ? 'flex-col space-y-2' : 'space-x-2'}`}>
          <Languages size={20} className="text-gray-500" />
          <div className={`${isCollapsed ? 'hidden' : 'flex space-x-2'}`}>
            {['en', 'th', 'cn'].map((lang) => (
              <button 
                key={lang}
                onClick={() => handleLanguageChange(lang)} 
                className={`${baseLangBtnClasses} ${i18n.language === lang 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;