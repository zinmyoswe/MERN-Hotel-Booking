import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Promotion = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const promos = [
    { id: 1, img: "https://cdn6.agoda.net/images/WebCampaign/20241212_ss_christmassale/home_banner_web/en-us.png", link: "http://www.agoda.com/ChristmasSale?cid=1914443" },
    { id: 2, img: "https://cdn6.agoda.net/images/WebCampaign/dealspagebanner_hp_web/en-us.png", link: "http://www.agoda.com/deals?cid=1916891" },
    { id: 3, img: "https://cdn6.agoda.net/images/WebCampaign/wcMM20230312/home_banner_web3/en-us.png", link: "http://www.agoda.com/MidMonthSale?cid=1901260" },
    { id: 4, img: "https://cdn6.agoda.net/images/WebCampaign/pulse_globalcampaign_fromasiatotheworld/home_banner_web2/en-us.png", link: "http://www.agoda.com/FromAsiaToTheWorld_2025?cid=1925130" },
    { id: 5, img: "https://cdn6.agoda.net/images/WebCampaign/20251203_jp_newlistings2025/home_banner_web/en-us.png", link: "http://www.agoda.com/NewListingsHotDealsJP?cid=1925155" },
    { id: 6, img: "https://cdn6.agoda.net/images/WebCampaign/20250404_jp_visitjapan/home_banner_web/en-us.png", link: "http://www.agoda.com/VisitJapan?cid=1914509" },
    { id: 7, img: "https://cdn6.agoda.net/images/WebCampaign/20251201_my_visitmalaysia/home_banner_web/en-us.png", link: "http://www.agoda.com/VisitMalaysiaMY?cid=1925109" },
    { id: 8, img: "https://cdn6.agoda.net/images/WebCampaign/20250401_mv_peakdays/home_banner_web/en-us.png", link: "http://www.agoda.com/PeakDaysMV?cid=1924940" },
    { id: 9, img: "https://cdn6.agoda.net/images/WebCampaign/20250806_my_visitpenang/home_banner_web/en-us.png", link: "http://www.agoda.com/VisitPenangMY?cid=1925031" },
    { id: 10, img: "https://cdn6.agoda.net/images/WebCampaign/20250806_my_visitjohor/home_banner_web/en-us.png", link: "http://www.agoda.com/VisitJohorMY?cid=1925030" },
    { id: 11, img: "https://cdn6.agoda.net/images/WebCampaign/20251028_vn_jingle/home_banner_web/en-us.png", link: "http://www.agoda.com/JingleDealsQ4VN?cid=1925131" },
    { id: 12, img: "https://cdn6.agoda.net/images/WebCampaign/20250811_th_oyo/home_banner_web/en-us.png", link: "http://www.agoda.com/OyoTH?cid=1925038" },
    { id: 13, img: "https://cdn6.agoda.net/images/WebCampaign/20250528_vn_acq/home_banner_web/en-us.png", link: "http://www.agoda.com/NewListingsHotDeals_VN?cid=1924978" },
    { id: 14, img: "https://cdn6.agoda.net/images/WebCampaign/20250327_cn_festiveseries/home_banner_web/en-us.png", link: "http://www.agoda.com/FestiveSeriesCN?cid=1924931" },
    { id: 15, img: "https://cdn6.agoda.net/images/WebCampaign/20251204_jp_candeo/home_banner_web/en-us.png", link: "http://www.agoda.com/CandeoJP2?cid=1901283" },
    { id: 16, img: "https://cdn6.agoda.net/images/WebCampaign/pulse_globalcampaign_prestigesavings_ka/home_banner_web/en-us.png", link: "http://www.agoda.com/PrestigeSavingsKA?cid=1914577" },
    { id: 17, img: "https://cdn6.agoda.net/images/WebCampaign/pulse_globalcampaign_midnightmadness/home_banner_web2/en-us.png", link: "http://www.agoda.com/MidnightMadnessNoonDash?cid=1914474" },
    { id: 18, img: "https://cdn6.agoda.net/images/WebCampaign/20251027_id_wonderfulindo/home_banner_web/en-us.png", link: "http://www.agoda.com/WonderfulID?cid=1914531" },
    { id: 19, img: "https://cdn6.agoda.net/images/WebCampaign/20250925_eu_asiatoeurope/home_banner_web/en-us.png", link: "http://www.agoda.com/AsiatoEuropeEU?cid=1925111" },
    { id: 20, img: "https://cdn6.agoda.net/images/WebCampaign/20251010_th_bestwestern/home_banner_web/en-us.png", link: "http://www.agoda.com/BestWesternTH?cid=1901283" },
    { id: 21, img: "https://cdn6.agoda.net/images/WebCampaign/20250821_global_agoda_plus/home_banner_web/en-us.png", link: "http://www.agoda.com/AgodaPlusExclusive?cid=1925047" },
    { id: 22, img: "https://cdn6.agoda.net/images/WebCampaign/wcNO20230101/home_banner_web3/en-us.png", link: "http://www.agoda.com/NightOwlSale?cid=1901202" },
    { id: 23, img: "https://cdn6.agoda.net/images/WebCampaign/pulse_globalcampaign_bookearlypayless/home_banner_web3/en-us.png", link: "http://www.agoda.com/BookEarlyPayless?cid=1914396" },
    { id: 24, img: "https://cdn6.agoda.net/images/WebCampaign/wcSL20231001/home_banner_web2/en-us.png", link: "http://www.agoda.com/StayLongerforLess?cid=1914395" }
  ];

  const itemsPerView = 3; 
  const maxIndex = promos.length - itemsPerView;

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
          <h2 className="text-2xl font-bold text-gray-800">Accommodation Promotions</h2>
          <a href="/deals" className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            View all <ChevronRight size={20} />
          </a>
        </div>

        <div className="relative">
          {/* Arrows */}
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
              {promos.map((promo) => (
                <div key={promo.id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[33.333%] p-3">
                  <a 
                    href={promo.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <img 
                      src={promo.img} 
                      alt={`Promotion ${promo.id}`} 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar Indicator */}
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

export default Promotion;