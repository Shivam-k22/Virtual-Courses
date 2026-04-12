import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { 
  Users, 
  BookOpen, 
  Star, 
  ShoppingCart, 
  DollarSign, 
  Loader2, 
  RefreshCw,
  TrendingUp,
  UserCheck,
  Video,
  Award,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/admin/dashboard-stats`, {
        params: { period: timeRange },
        withCredentials: true
      });
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 text-sm shadow-lg">
          <p className="text-blue-500 font-semibold">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-gray-700">
              {p.name}: {p.name === 'Revenue' ? `₹${p.value.toLocaleString()}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Stat Card Component (without trend)
  const StatCard = ({ title, value, icon: Icon, color, period }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value?.toLocaleString() || 0}</p>
          {period && period !== 'all' && (
            <p className="text-xs text-gray-400 mt-2">in last {period}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const pieData = [
    { name: 'Students', value: stats?.totalStudents || 0, color: '#3B82F6' },
    { name: 'Educators', value: stats?.totalEducators || 0, color: '#10B981' },
    { name: 'Admins', value: stats?.totalUsers - (stats?.totalStudents + stats?.totalEducators) || 0, color: '#F59E0B' }
  ];

  const revenueData = stats?.monthlyData || [
    { name: 'Jan', revenue: 0, orders: 0 },
    { name: 'Feb', revenue: 0, orders: 0 },
    { name: 'Mar', revenue: 0, orders: 0 },
    { name: 'Apr', revenue: stats?.totalRevenue || 0, orders: stats?.totalOrders || 0 },
    { name: 'May', revenue: 0, orders: 0 },
    { name: 'Jun', revenue: 0, orders: 0 },
  ];

  const getPeriodLabel = () => {
    switch(timeRange) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'year': return 'Last 12 Months';
      default: return 'All Time';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Overview of platform statistics • <span className="font-medium text-blue-600">{getPeriodLabel()}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid - 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          period={timeRange !== 'all' ? timeRange : null}
        />
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses}
          icon={BookOpen}
          color="bg-gradient-to-br from-green-500 to-green-600"
          period={timeRange !== 'all' ? timeRange : null}
        />
        <StatCard
          title="Total Lectures"
          value={stats?.totalLectures}
          icon={Video}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          period={timeRange !== 'all' ? timeRange : null}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          period={timeRange !== 'all' ? timeRange : null}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders}
          icon={ShoppingCart}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          period={timeRange !== 'all' ? timeRange : null}
        />
        <StatCard
          title="Total Reviews"
          value={stats?.totalReviews}
          icon={Star}
          color="bg-gradient-to-br from-pink-500 to-pink-600"
          period={timeRange !== 'all' ? timeRange : null}
        />
      </div>

      {/* Charts Section - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500 mt-1">
                {timeRange === 'all' ? 'Monthly trends' : `Trends for ${getPeriodLabel()}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-500">Revenue (₹)</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500">Orders</span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
            <p className="text-sm text-gray-500 mt-1">
              {timeRange === 'all' ? 'All time' : `New users in ${getPeriodLabel()}`}
            </p>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="w-8 h-8 text-white/80" />
            <span className="text-white/60 text-xs uppercase tracking-wider">
              {timeRange === 'all' ? 'Total Active' : 'New Active'}
            </span>
          </div>
          <p className="text-4xl font-bold">{stats?.totalStudents || 0}</p>
          <p className="text-blue-100 text-sm mt-2">
            {timeRange === 'all' ? 'Total Students' : 'New Students'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-white/80" />
            <span className="text-white/60 text-xs uppercase tracking-wider">
              {timeRange === 'all' ? 'Total Educators' : 'New Educators'}
            </span>
          </div>
          <p className="text-4xl font-bold">{stats?.totalEducators || 0}</p>
          <p className="text-green-100 text-sm mt-2">
            {timeRange === 'all' ? 'Total Educators' : 'New Educators'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-white/80" />
            <span className="text-white/60 text-xs uppercase tracking-wider">Engagement</span>
          </div>
          <p className="text-4xl font-bold">
            {stats?.totalCourses > 0 ? Math.round((stats?.totalStudents / stats?.totalCourses) * 100) : 0}%
          </p>
          <p className="text-purple-100 text-sm mt-2">Students per Course</p>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Latest {timeRange !== 'all' ? `in ${getPeriodLabel()}` : 'registered users'}
                </p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.recentUsers?.length > 0 ? (
              stats.recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      user.role === 'admin' ? 'bg-red-500' :
                      user.role === 'educator' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'educator' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No users found in this period
              </div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Latest {timeRange !== 'all' ? `in ${getPeriodLabel()}` : 'added courses'}
                </p>
              </div>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.recentCourses?.length > 0 ? (
              stats.recentCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500">By {course.creator?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No courses found in this period
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;