import React, { useState } from 'react';
import { Car } from 'lucide-react';
import './AgodaTabs.css';


const AgodaTabs = () => {
  const [activeTab, setActiveTab] = useState('hotels');

  const tabs = [
    { 
      id: 'hotels', 
      label: 'Hotels', 
      icon: "https://cdn6.agoda.net/cdn-design-system/icons/20bcd7d9.svg" 
    },
    { 
      id: 'homes', 
      label: 'Homes & Apts', 
      icon: "https://cdn6.agoda.net/cdn-design-system/icons/283db69b.svg" 
    },
    { 
      id: 'packages', 
      label: 'Flight + Hotel', 
      icon: "https://cdn6.agoda.net/cdn-design-system/icons/5e4b4a43.svg", 
      badge: 'Bundle & Save' 
    },
    { 
      id: 'flights', 
      label: 'Flights', 
      icon: "https://cdn6.agoda.net/cdn-design-system/icons/59659f8c.svg" 
    },
    { 
      id: 'activities', 
      label: 'Activities', 
      icon: "https://cdn6.agoda.net/cdn-design-system/icons/affa53e7.svg", 
      badge: 'New!' 
    },
    { 
      id: 'transfers', 
      label: 'Airport transfer', 
      icon: "https://cdn6.agoda.net/cdn-design-system/icons/05a6498b.svg",
    },
  ];

  return (
    <div id="Tabs-Container" 
      className="agodatabzin flex w-full md:w-max items-center justify-center rounded-t-xl bg-white/95 backdrop-blur-sm px-4" 
      >
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
              {/* Promotional Badge */}
              {tab.badge && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-[#E12D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {tab.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 px-1">
                {/* Icon Container */}
                <div className={`w-7 h-7 flex items-center justify-center transition-opacity duration-200 ${
                  activeTab === tab.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                }`}>
                  {tab.icon ? (
                    <img 
                      src={tab.icon} 
                      alt={tab.label} 
                      className="w-full h-full object-contain"
                      /* Simple CSS filter to match Agoda Blue when active */
                      style={activeTab === tab.id ? { filter: 'invert(48%) sepia(85%) saturate(1633%) hue-rotate(195deg) brightness(101%) contrast(97%)' } : {}}
                    />
                  ) : (
                    <span className={activeTab === tab.id ? 'text-[#5392F9]' : 'text-gray-400'}>
                      {tab.lucideIcon}
                    </span>
                  )}
                </div>
                
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