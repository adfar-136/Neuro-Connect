import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  MessageCircle, 
  Star, 
  Clock, 
  FileText, 
  Heart, 
  Plus,
  User,
  Mail,
  Award,
  MapPin
} from 'lucide-react';
import axios from 'axios';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    title: '',
    description: '',
    isAnonymous: false,
    anonymousName: '',
    preferredDateTime: ''
  });

  useEffect(() => {
    fetchDoctorData();
  }, [doctorId]);

  const fetchDoctorData = async () => {
    try {
      // Fetch doctor details
      const doctorResponse = await axios.get(`/api/users/${doctorId}`);
      setDoctor(doctorResponse.data);

      // Fetch doctor's posts
      const postsResponse = await axios.get(`/api/posts/doctor/${doctorId}`);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Failed to fetch doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = () => {
    if (user.role !== 'student') {
      alert('Only students can book sessions');
      return;
    }
    setShowBookingModal(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sessions', {
        ...bookingData,
        doctorId: doctor._id
      });

      alert('Session request sent successfully! The doctor will respond soon.');
      setShowBookingModal(false);
      setBookingData({
        title: '',
        description: '',
        isAnonymous: false,
        anonymousName: '',
        preferredDateTime: ''
      });
    } catch (error) {
      console.error('Failed to book session:', error);
      alert('Failed to book session. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor not found</h2>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/doctors')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-emerald-600">
                    {doctor.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                <p className="text-emerald-600 font-medium text-lg">{doctor.specialization}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-3 text-emerald-500" />
                  <span className="text-sm">{doctor.qualifications}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-emerald-500" />
                  <span className="text-sm">{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-5 w-5 mr-3 text-emerald-500" />
                  <span className="text-sm">Verified Professional</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-3 text-emerald-500" />
                  <span className="text-sm">{posts.length} posts</span>
                </div>
              </div>

              {user.role === 'student' && (
                <button
                  onClick={handleBookSession}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Session</span>
                </button>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Posts by Dr. {doctor.name}</h3>
              <p className="text-gray-600">Educational content and insights from this professional</p>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold">
                          {post.author?.name?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{post.author?.name}</h4>
                          <span className="text-sm text-gray-500">{post.author?.specialization}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'awareness' ? 'bg-blue-100 text-blue-800' :
                        post.category === 'tips' ? 'bg-green-100 text-green-800' :
                        post.category === 'article' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.category}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h5>
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                      {post.image && (
                        <img
                          src={`http://localhost:8000${post.image}`}
                          alt="Post"
                          className="mt-4 w-full h-64 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <div className="flex items-center space-x-6 py-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Heart className="h-5 w-5" />
                        <span>{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">This doctor hasn't shared any content yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Session with Dr. {doctor.name}
            </h2>

            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Brief title for your session"
                  value={bookingData.title}
                  onChange={(e) => setBookingData({ ...bookingData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Describe what you'd like to discuss..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={bookingData.preferredDateTime}
                  onChange={(e) => setBookingData({ ...bookingData, preferredDateTime: e.target.value })}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                  checked={bookingData.isAnonymous}
                  onChange={(e) => setBookingData({ ...bookingData, isAnonymous: e.target.checked })}
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Book anonymously (hide my identity)
                </label>
              </div>

              {bookingData.isAnonymous && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anonymous Name (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Anonymous Student"
                    value={bookingData.anonymousName}
                    onChange={(e) => setBookingData({ ...bookingData, anonymousName: e.target.value })}
                  />
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
