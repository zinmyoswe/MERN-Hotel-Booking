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
          addRoom: 'Add Room',
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
          addRoom: 'เพิ่มห้องพัก',
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
          addRoom: '添加房间',
          revenue: '收入',
          bookings: '预订',
          rating: '评分',
          revenueAnalytics: '收入分析',
        },
      },
    },
  });

export default i18n;
