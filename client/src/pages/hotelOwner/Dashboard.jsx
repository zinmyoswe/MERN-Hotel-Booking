import React from 'react';
import { Hotel, Wallet, BookOpen, Star, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
// The import for 'react-i18next' has been removed to resolve the build error.

// --- Dummy Data Definitions ---

// Data for Bar Chart (Monthly Revenue)
const monthlyRevenueData = [
  { name: 'Jan', Revenue: 4000, Target: 4500 },
  { name: 'Feb', Revenue: 3000, Target: 4500 },
  { name: 'Mar', Revenue: 5000, Target: 4500 },
  { name: 'Apr', Revenue: 4500, Target: 4500 },
  { name: 'May', Revenue: 6000, Target: 4500 },
  { name: 'Jun', Revenue: 5500, Target: 4500 },
];

// Data for Pie/Donut Chart (Booking Status Distribution)
const bookingStatusData = [
  { name: 'Confirmed', value: 350, color: 'hsl(203, 91%, 67%)' }, // Light Blue
  { name: 'Pending', value: 150, color: 'hsl(143, 75%, 53%)' }, // Green
  { name: 'Cancelled', value: 50, color: 'hsl(0, 75%, 65%)' }, // Red
  { name: 'Checked Out', value: 200, color: 'hsl(240, 75%, 60%)' }, // Violet
];

// Data for Line Chart (Quarterly Occupancy Rate)
const occupancyData = [
  { name: 'Q1', 'Occupancy Rate (%)': 75, Target: 80 },
  { name: 'Q2', 'Occupancy Rate (%)': 82, Target: 80 },
  { name: 'Q3', 'Occupancy Rate (%)': 78, Target: 80 },
  { name: 'Q4', 'Occupancy Rate (%)': 90, Target: 80 },
];

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-80">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {payload.map((p, index) => (
          <p key={index} className={`text-sm ${p.color ? '' : 'text-gray-600'}`}>
            <span style={{ color: p.color || p.fill }} className="font-bold mr-1">•</span>
            {`${p.name}: `}
            <span className="font-medium">{p.value}</span>
            {p.unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Component ---
const Dashboard = () => {
  // Mock translation function to resolve the build error caused by react-i18next dependency
  const t = (key) => {
      const translations = {
          'Dashboard Overview': 'Dashboard Overview',
          'hotels': 'Hotels',
          'revenue': 'Revenue',
          'bookings': 'Bookings',
          'rating': 'Rating',
          '10% increase': '10% increase',
          '2.5% above target': '2.5% above target',
          '50 new this week': '50 new this week',
          'Excellent service': 'Excellent service',
          'Monthly Revenue Analysis': 'Monthly Revenue Analysis',
          'Quarterly Occupancy Rate': 'Quarterly Occupancy Rate',
          'Booking Status Distribution (Donut)': 'Booking Status Distribution (Donut)',
          'Booking Status Distribution (Pie': 'Booking Status Distribution (Pie)',
      };
      // Return the translated value or the key itself as a fallback
      return translations[key] || key;
  };

  // Color variables for card icons based on a fresh palette
  const iconColors = {
    hotels: 'bg-sky-500',
    revenue: 'bg-emerald-500',
    bookings: 'bg-indigo-500',
    rating: 'bg-amber-500',
  };

  const dashboardStats = [
    { title: t('hotels'), value: '10', icon: Hotel, colorClass: iconColors.hotels, detail: t('10% increase') },
    { title: t('revenue'), value: '$50,000', icon: Wallet, colorClass: iconColors.revenue, detail: t('2.5% above target') },
    { title: t('bookings'), value: '1,000', icon: BookOpen, colorClass: iconColors.bookings, detail: t('50 new this week') },
    { title: t('rating'), value: '4.5', icon: Star, colorClass: iconColors.rating, detail: t('Excellent service') },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen rounded-md shadow-md">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{t('Dashboard Overview')}</h1>

      {/* --- 1. Stats Cards Grid (Enhanced Design) --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100"
          >
            <div className={`p-4 rounded-full text-white ${stat.colorClass} shadow-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <h4 className="text-3xl font-bold text-gray-800">{stat.value}</h4>
              <div className="text-sm font-medium text-gray-500">{stat.title}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- 2. Charts Grid (Responsive 2-Column Layout) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === Bar Chart (Monthly Revenue) === */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('Monthly Revenue Analysis')}</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip unit='$' />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Revenue" fill="hsl(203, 85%, 55%)" radius={[4, 4, 0, 0]} /> {/* Primary blue */}
              <Bar dataKey="Target" fill="hsl(143, 75%, 75%)" radius={[4, 4, 0, 0]} opacity={0.6} /> {/* Light Green */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* === Line Chart (Occupancy Rate) === */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('Quarterly Occupancy Rate')}</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={occupancyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis domain={[0, 100]} stroke="#6b7280" unit="%" />
              <Tooltip content={<CustomTooltip unit='%' />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="Occupancy Rate (%)" 
                stroke="hsl(203, 91%, 67%)" 
                strokeWidth={3} 
                dot={{ r: 6, fill: 'hsl(203, 91%, 67%)', stroke: '#fff', strokeWidth: 2 }} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Target" 
                stroke="hsl(0, 75%, 65%)" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* === Donut Chart (Booking Status - Outer Radius) === */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('Booking Status Distribution (Donut)')}</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60} // Donut inner radius
                outerRadius={100} // Donut outer radius
                fill="#8884d8"
                paddingAngle={5}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* === Pie Chart (Booking Status - Solid Pie) === */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('Booking Status Distribution (Pie')}</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100} // Solid Pie outer radius
                fill="#82ca9d"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;