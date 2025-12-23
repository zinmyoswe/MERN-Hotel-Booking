import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FlightActivitiesPromotion = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const flightPromos = [
    { id: 1, img: "https://cdn6.agoda.net/images/emailmarketing/activities/EOY_Sale/Homepage_Banner/Generic/Web/en-us.png", link: "https://www.agoda.com/c/ActivityEndOfYearSale?cid=1908888" },
    { id: 2, img: "https://cdn6.agoda.net/images/emailmarketing/activities/EOY_Sale/Homepage_Banner/HKDL/web/en-us.png", link: "https://www.agoda.com/activities/detail?activityId=1489667&cid=1908888" },
    { id: 3, img: "https://cdn6.agoda.net/images/blt2/wcFlightsKTCUnionpay2025/HP/Web/en-us.png", link: "http://www.agoda.com/ktcunionpayflight?cid=1941892" },
    { id: 4, img: "https://cdn6.agoda.net/images/EmailMarketing/activities/hp_banner/web/en-us.png", link: "http://www.agoda.com/promotion/redeem?cinfo=20250501_541681&returnUrl=%2F%3Fcid%3D1915785" },
    { id: 5, img: "https://cdn6.agoda.net/images/WebCampaign/ChinaAir15AugNew_20250901/HP/desk/en-us.png", link: "http://www.agoda.com/ChinaAir15off?cid=1943566&languageid=1&origin=TH" },
    { id: 6, img: "https://cdn6.agoda.net/images/blt2/wcFlightsEvergreen2025/Web/5pct/en-us.png", link: "http://www.agoda.com/flights?cid=1904159" },
    { id: 7, img: "https://cdn6.agoda.net/images/WebCampaign/pulse_globalcampaign_fromasiatotheworld/home_banner_web2/en-us.png", link: "http://www.agoda.com/FromAsiaToTheWorld_2025?cid=1925130" },
    { id: 8, img: "https://cdn6.agoda.net/images/WebCampaign/20251203_jp_newlistings2025/home_banner_web/en-us.png", link: "http://www.agoda.com/NewListingsHotDealsJP?cid=1925155" },
    { id: 9, img: "https://cdn6.agoda.net/images/WebCampaign/20250404_jp_visitjapan/home_banner_web/en-us.png", link: "http://www.agoda.com/VisitJapan?cid=1914509" },
    { id: 10, img: "https://cdn6.agoda.net/images/WebCampaign/20251201_my_visitmalaysia/home_banner_web/en-us.png", link: "http://www.agoda.com/VisitMalaysiaMY?cid=1925109" }
  ];

  const itemsPerView = 3;
  const maxIndex = flightPromos.length - itemsPerView;

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Flights & Activities Promotions</h2>
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
              {flightPromos.map((promo) => (
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
                      alt={`Activity Promotion ${promo.id}`} 
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

export default FlightActivitiesPromotion;