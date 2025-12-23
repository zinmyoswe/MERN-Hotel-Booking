import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          dashboard: 'Dashboard',
          hotels: 'Hotels',
          rooms: 'Rooms',
          addHotel: 'Add Hotel',
          editHotel: 'Edit Hotel',
          addRoom: 'Add Room',
          nearbyPlaces: 'Nearby Places',
          highlights: 'Highlights',
          facilities: 'Facilities',
          staycations: 'Staycations',
          distance: 'Distance',
          revenue: 'Revenue',
          bookings: 'Bookings',
          rating: 'Rating',
          revenueAnalytics: 'Revenue Analytics',
        },
      },
      th: {
        translation: {
          dashboard: 'แดชบอร์ด',
          hotels: 'โรงแรม',
          rooms: 'ห้องพัก',
          addHotel: 'เพิ่มโรงแรม',
          editHotel: 'แก้ไขโรงแรม',
          addRoom: 'เพิ่มห้องพัก',
          nearbyPlaces: 'สถานที่ใกล้เคียง',
          highlights: 'ไฮไลท์',
          facilities: 'สิ่งอำนวยความสะดวก',
          staycations: 'สเตย์เคชั่น',
          distance: 'ระยะทาง',
          revenue: 'รายได้',
          bookings: 'การจอง',
          rating: 'คะแนน',
          revenueAnalytics: 'การวิเคราะห์รายได้',
        },
      },
      cn: {
        translation: {
          dashboard: '仪表板',
          hotels: '酒店',
          rooms: '房间',
          addHotel: '添加酒店',
          editHotel: '编辑酒店',
          addRoom: '添加房间',
          nearbyPlaces: '附近地点',
          highlights: '亮点',
          facilities: '设施',
          staycations: '度假',
          distance: '距离',
          revenue: '收入',
          bookings: '预订',
          rating: '评分',
          revenueAnalytics: '收入分析',
        },
      },
    },
  });

export default i18n;
