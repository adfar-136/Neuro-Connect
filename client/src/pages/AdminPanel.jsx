import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  FileText, 
  MessageCircle, 
  Calendar, 
  Activity, 
  Shield, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Clock as ClockIcon,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  PieChart,
  LineChart,
  Target,
  Zap,
  Users as UsersIcon,
  CalendarDays,
  MessageSquare,
  FileText as FileTextIcon,
  X
} from 'lucide-react';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const AdminPanel = () => {
  const [stats, setStats] = useState({});

  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [doctorAnalytics, setDoctorAnalytics] = useState([]);
  const [sessionAnalytics, setSessionAnalytics] = useState({});
  const [userAnalytics, setUserAnalytics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [analyticsPeriod]);

  const fetchAdminData = async () => {
    try {
      const [
        statsResponse, 
        usersResponse,
        postsResponse,
        doctorAnalyticsResponse,
        sessionAnalyticsResponse,
        userAnalyticsResponse
      ] = await Promise.all([
        axios.get(buildApiUrl('api/admin/stats')),
        axios.get(buildApiUrl('api/admin/users')),
        axios.get(buildApiUrl('api/admin/posts')),
        axios.get(buildApiUrl('api/admin/analytics/doctors')),
        axios.get(buildApiUrl(`api/admin/analytics/sessions?period=${analyticsPeriod}`)),
        axios.get(buildApiUrl(`api/admin/analytics/users?period=${analyticsPeriod}`))
      ]);

      // Ensure all data is properly formatted and safe for rendering
      setStats(statsResponse.data || {});
      setAllUsers(usersResponse.data || []);
      setAllPosts(postsResponse.data?.posts || []);
      setDoctorAnalytics(doctorAnalyticsResponse.data || []);
      setSessionAnalytics(sessionAnalyticsResponse.data || {});
      setUserAnalytics(userAnalyticsResponse.data || {});
      
      // Generate mock recent activity data
      setRecentActivity([
        {
          id: 1,
          type: 'doctor_verified',
          user: 'Dr. Sarah Johnson',
          action: 'was verified and activated',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: UserCheck
        },
        {
          id: 2,
          type: 'new_registration',
          user: 'Dr. Michael Chen',
          action: 'registered and awaiting verification',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: UserX
        },
        {
          id: 3,
          type: 'session_created',
          user: 'Alex Smith',
          action: 'created a new therapy session',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          icon: Calendar
        },
        {
          id: 4,
          type: 'message_sent',
          user: 'Dr. Emily Rodriguez',
          action: 'sent a message in session',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          icon: MessageCircle
        }
      ]);



      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };



  const handleDeleteUser = async (userId) => {
    try {
              await axios.delete(buildApiUrl(`api/admin/users/${userId}`));
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'view':
          // Find the user and show profile modal
          const user = allUsers.find(u => u._id === userId);
          if (user) {
            setSelectedUser(user);
            setShowProfileModal(true);
          }
          break;

        case 'delete':
          // Show delete confirmation modal
          const userToDelete = allUsers.find(u => u._id === userId);
          if (userToDelete) {
            setUserToDelete(userToDelete);
            setShowDeleteModal(true);
          }
          break;
        case 'verify':
          // Verify doctor
          await axios.patch(buildApiUrl(`api/admin/doctors/${userId}/verify`), { status: 'approved' });
          fetchAdminData(); // Refresh data
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };



  const safeRenderValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object' && value instanceof Date) return value.toLocaleString();
    return String(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage the Neuro Connect platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'posts', label: 'Posts', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.users?.total || 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span>+{stats.weeklyGrowth?.newUsers || 0} this week</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.users?.activeDoctors || 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{stats.users?.pendingDoctors || 0} pending verification</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.sessions?.total || 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>{stats.sessions?.completed || 0} completed</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.posts?.total || 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 text-blue-500 mr-1" />
                  <span>{stats.posts?.published || 0} published</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <activity.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}



        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.role !== 'admin').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.role === 'student').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.role === 'doctor').length}</p>
                  </div>
                </div>
              </div>
              

            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="doctor">Doctors</option>
                  </select>

                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers
                      .filter(user => user.role !== 'admin') // Exclude admin users
                      .filter(user => {
                        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesRole = filterRole === 'all' || user.role === filterRole;
                        return matchesSearch && matchesRole;
                      })
                      .map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-emerald-600">
                                  {user.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'doctor' ? 
                                (user.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                 user.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                 'bg-red-100 text-red-800') :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'doctor' ? user.verificationStatus || 'pending' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleUserAction(user._id, 'view')}
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                              View
                            </button>

                            {user.role === 'doctor' && user.verificationStatus === 'pending' && (
                              <button 
                                onClick={() => handleUserAction(user._id, 'verify')}
                                className="text-orange-600 hover:text-orange-900 mr-3"
                              >
                                Verify
                              </button>
                            )}
                            <button 
                              onClick={() => handleUserAction(user._id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty State */}
              {allUsers
                .filter(user => user.role !== 'admin') // Exclude admin users
                .filter(user => {
                  const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesRole = filterRole === 'all' || user.role === filterRole;
                  return matchesSearch && matchesRole;
                }).length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterRole !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'No users have been registered yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Analytics Period</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={analyticsPeriod}
                    onChange={(e) => setAnalyticsPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (isExportingPDF) return;
                      
                      try {
                        setIsExportingPDF(true);
                        const token = localStorage.getItem('token');
                        if (!token) {
                          alert('Please log in to export PDF');
                          return;
                        }

                        console.log('Starting PDF export...');
                        const response = await fetch(buildApiUrl('api/admin/analytics/doctors/pdf'), {
                          method: 'GET',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                          },
                        });

                        console.log('Response status:', response.status);
                        console.log('Response headers:', response.headers);

                        if (response.ok) {
                          const blob = await response.blob();
                          console.log('PDF blob size:', blob.size);
                          
                          if (blob.size === 0) {
                            alert('Generated PDF is empty. Please try again.');
                            return;
                          }

                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `doctor-analytics-${new Date().toISOString().split('T')[0]}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                          
                          console.log('PDF downloaded successfully');
                        } else {
                          const errorText = await response.text();
                          console.error('Failed to generate PDF:', response.status, errorText);
                          
                          if (response.status === 401) {
                            alert('Authentication failed. Please log in again.');
                          } else if (response.status === 403) {
                            alert('Access denied. Admin privileges required.');
                          } else {
                            alert(`Failed to generate PDF (${response.status}). Please try again.`);
                          }
                        }
                      } catch (error) {
                        console.error('Error generating PDF:', error);
                        alert('Network error. Please check your connection and try again.');
                      } finally {
                        setIsExportingPDF(false);
                      }
                    }}
                    disabled={isExportingPDF}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      isExportingPDF 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    } text-white`}
                  >
                    {isExportingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Doctor Performance */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Doctor Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctorAnalytics.slice(0, 6).map((doctor) => (
                    <div key={doctor.id} className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">{doctor.name}</h5>
                      <div className="space-y-1 text-sm">
                        <p>Total Sessions: {doctor.stats.totalSessions}</p>
                        <p>Completed: {doctor.stats.completedSessions}</p>
                        <p>Pending: {doctor.stats.pendingSessions}</p>
                        <p>Avg Duration: {doctor.stats.avgDuration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Statistics */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Session Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{sessionAnalytics?.totalSessions || 0}</p>
                    <p className="text-sm text-blue-800">Total Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{sessionAnalytics?.dailyStats ? Object.values(sessionAnalytics.dailyStats).reduce((sum, day) => sum + (day?.completed || 0), 0) : 0}</p>
                    <p className="text-sm text-green-800">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{sessionAnalytics?.dailyStats ? Object.values(sessionAnalytics.dailyStats).reduce((sum, day) => sum + (day?.pending || 0), 0) : 0}</p>
                    <p className="text-sm text-yellow-800">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{sessionAnalytics?.dailyStats ? Object.values(sessionAnalytics.dailyStats).reduce((sum, day) => sum + (day?.expired || 0), 0) : 0}</p>
                    <p className="text-sm text-red-800">Expired</p>
                  </div>
                </div>
              </div>

              {/* User Growth */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">User Growth</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{userAnalytics.totalUsers || 0}</p>
                    <p className="text-sm text-purple-800">New Users</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">{userAnalytics.dailyStats ? Object.values(userAnalytics.dailyStats).reduce((sum, day) => sum + day.students, 0) : 0}</p>
                    <p className="text-sm text-indigo-800">Students</p>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <p className="text-2xl font-bold text-teal-600">{userAnalytics.dailyStats ? Object.values(userAnalytics.dailyStats).reduce((sum, day) => sum + day.doctors, 0) : 0}</p>
                    <p className="text-sm text-teal-800">Doctors</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">{userAnalytics.dailyStats ? Object.values(userAnalytics.dailyStats).reduce((sum, day) => sum + day.admins, 0) : 0}</p>
                    <p className="text-sm text-pink-800">Admins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">

            {/* Posts Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{allPosts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">{allPosts.filter(post => post.isActive).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Draft</p>
                    <p className="text-2xl font-bold text-gray-900">{allPosts.filter(post => !post.isActive).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{allPosts.filter(post => {
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return new Date(post.createdAt) >= weekAgo;
                    }).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Management */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Posts Management</h3>
                <div className="flex items-center space-x-3">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Posts List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allPosts
                      .filter(post => {
                        const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            post.content?.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = filterRole === 'all' || 
                          (filterRole === 'published' && post.isActive) ||
                          (filterRole === 'draft' && !post.isActive);
                        return matchesSearch && matchesStatus;
                      })
                      .map((post) => (
                        <tr key={post._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                <div className="text-sm text-gray-500">
                                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{post.author?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{post.author?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.isActive ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-emerald-600 hover:text-emerald-900 mr-3">
                              View
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterRole !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No posts have been created yet.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile View Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* User Header */}
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-emerald-600">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name || 'Unknown'}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      selectedUser.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedUser.role}
                    </span>
                    {selectedUser.role === 'doctor' && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedUser.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.verificationStatus || 'pending'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{selectedUser.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium capitalize">{selectedUser.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">
                          {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          selectedUser.role === 'doctor' ? 
                            (selectedUser.verificationStatus === 'approved' ? 'text-green-600' :
                             selectedUser.verificationStatus === 'pending' ? 'text-yellow-600' :
                             'text-red-600') :
                          'text-green-600'
                        }`}>
                          {selectedUser.role === 'doctor' ? 
                            (selectedUser.verificationStatus === 'approved' ? 'Verified' :
                             selectedUser.verificationStatus === 'pending' ? 'Pending Verification' :
                             'Rejected') :
                            'Active'
                          }
                        </span>
                      </div>
                      {selectedUser.role === 'doctor' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active:</span>
                            <span className={`font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedUser.isActive ? 'Yes' : 'No'}
                            </span>
                          </div>
                          {selectedUser.verificationDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Verified On:</span>
                              <span className="font-medium">
                                {new Date(selectedUser.verificationDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Specific Information */}
              {selectedUser.role === 'doctor' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Specialization:</span>
                      <p className="font-medium">{selectedUser.specialization || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <p className="font-medium">{selectedUser.experience ? `${selectedUser.experience} years` : 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Qualifications:</span>
                      <p className="font-medium">{selectedUser.qualifications || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">License Number:</span>
                      <p className="font-medium">{selectedUser.licenseNumber || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedUser.role === 'doctor' && selectedUser.verificationStatus === 'pending' && (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser._id, 'verify');
                      setShowProfileModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Verify Doctor
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-600">Delete User</h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">
                      {userToDelete.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{userToDelete.name || 'Unknown'}</h3>
                    <p className="text-gray-600">{userToDelete.email}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userToDelete.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {userToDelete.role}
                    </span>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm text-red-700">
                      <p className="font-medium">This action cannot be undone.</p>
                      <p className="mt-1">
                        This will permanently delete the {userToDelete.role} and all associated data including:
                        {userToDelete.role === 'doctor' ? ' posts, sessions, and profile information.' : ' sessions and profile information.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(userToDelete._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;