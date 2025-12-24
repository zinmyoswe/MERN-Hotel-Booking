import React, { useState } from 'react';
import { Building2, Home, Plane, Camera, Car, Package } from 'lucide-react';

const AgodaTabs = () => {
  const [activeTab, setActiveTab] = useState('hotels');

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: <Building2 size={20} /> },
    { id: 'homes', label: 'Homes & Apts', icon: <Home size={20} /> },
    { 
      id: 'packages', 
      label: 'Flight + Hotel', 
      icon: <Package size={20} />, 
      badge: 'Bundle & Save' 
    },
    { id: 'flights', label: 'Flights', icon: <Plane size={20} /> },
    { 
      id: 'activities', 
      label: 'Activities', 
      icon: <Camera size={20} />, 
      badge: 'New!' 
    },
    { id: 'transfers', label: 'Airport transfer', icon: <Car size={20} /> },
  ];

  return (
  <div id="Tabs-Container" 
    className="flex w-full md:w-max items-center justify-center rounded-t-xl bg-white/95 backdrop-blur-sm px-4" 
    style={{ zIndex: 20 }}>
    <div className="max-w-4xl mx-auto px-4">
      <ul role="tablist" className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
            <li
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-shrink-0 cursor-pointer pt-6 pb-4 group"
            >
              {/* Promotional Badge (Agoda Style) */}
              {tab.badge && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {tab.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 px-1">
                <span className={`transition-colors duration-200 ${
                  activeTab === tab.id ? 'text-[#5392F9]' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {tab.icon}
                </span>
                
                <h6 className={`text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-[#5392F9]' : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {tab.label}
                </h6>
              </div>

              {/* Active Underline */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5392F9] rounded-t-full" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgodaTabs;