import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PropertiesRecommend = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const propertyPromos = [
    { id: 1, img: "https://cdn6.agoda.net/images/WebCampaign/20250729_th_flagshipstoreaccor_2/home_banner_web/en-us.png", link: "http://www.agoda.com/FlagshipAccorThailand?cid=1924914" },
    { id: 2, img: "https://cdn6.agoda.net/images/WebCampaign/20251116_Onyx_TH/home_banner_web/en-us.png", link: "http://www.agoda.com/flagship_onyx?cid=1925027" },
    { id: 3, img: "https://cdn6.agoda.net/images/WebCampaign/Banyan_TH_20251031/home_banner_web/en-us.png", link: "http://www.agoda.com/flagship_banyangroup?cid=1925140" },
    { id: 4, img: "https://cdn6.agoda.net/images/WebCampaign/20250903_th_absolute/home_banner_web/en-us.png", link: "http://www.agoda.com/flagship_absolute?cid=1925068" },
    { id: 5, img: "https://cdn6.agoda.net/images/WebCampaign/Urcove_CN_20251111/home_banner_web/en-us.png", link: "http://www.agoda.com/flagship_urcovebyhyatt?cid=1925145" }
  ];

  // On desktop we show 3, so max index is (5 items - 3 visible) = 2 steps
  const itemsPerView = 3;
  const maxIndex = propertyPromos.length - itemsPerView;

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Properties we think you'll like</h2>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl rounded-full p-3 border border-gray-100 transition-all duration-300 ${
              currentIndex === 0 ? 'opacity-0 invisible' : 'opacity-100 hover:scale-110'
            }`}
          >
            <ChevronLeft size={24} className="text-blue-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl rounded-full p-3 border border-gray-100 transition-all duration-300 ${
              currentIndex >= maxIndex ? 'opacity-0 invisible' : 'opacity-100 hover:scale-110'
            }`}
          >
            <ChevronRight size={24} className="text-blue-600" />
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {propertyPromos.map((promo) => (
                <div 
                  key={promo.id} 
                  className="min-w-[100%] sm:min-w-[50%] lg:min-w-[33.333%] p-3"
                >
                  <a 
                    href={promo.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <img 
                      src={promo.img} 
                      alt={`Property recommendation ${promo.id}`} 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center mt-8 hidden">
            <div className="h-1 w-48 bg-gray-200 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
                style={{ 
                  width: `${(100 / (maxIndex + 1))}%`,
                  transform: `translateX(${currentIndex * 100}%)` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesRecommend;