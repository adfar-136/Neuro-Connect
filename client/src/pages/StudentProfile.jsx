import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Shield, 
  Eye, 
  EyeOff,
  MessageCircle,
  FileText
} from 'lucide-react';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const StudentProfile = () => {
  const { studentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullProfile, setShowFullProfile] = useState(false);

  useEffect(() => {
    if (user.role !== 'doctor') {
      navigate('/dashboard');
      return;
    }
    fetchStudentData();
  }, [studentId, user.role]);

  const fetchStudentData = async () => {
    try {
              const response = await axios.get(buildApiUrl(`api/users/${studentId}`));
      setStudent(response.data);
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student not found</h2>
          <button
            onClick={() => navigate('/sessions')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/sessions')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-emerald-100">Student</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Anonymous Status Warning */}
            {student.isAnonymous && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Anonymous Session</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  This student has chosen to remain anonymous. Limited profile information is available.
                </p>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {student.isAnonymous ? 'Anonymous Student' : student.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {student.isAnonymous ? 'Hidden for privacy' : student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${student.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className={`font-medium ${student.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p className="font-medium text-gray-900">
                      {new Date(student.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            {student.isAnonymous && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Privacy Information</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  This student has chosen to remain anonymous for their session. 
                  You can still provide professional support while respecting their privacy choice.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/sessions')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Back to Sessions</span>
              </button>
              
              {!student.isAnonymous && (
                <button
                  onClick={() => setShowFullProfile(!showFullProfile)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {showFullProfile ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showFullProfile ? 'Hide Details' : 'Show More Details'}</span>
                </button>
              )}
            </div>

            {/* Additional Details (if not anonymous and expanded) */}
            {showFullProfile && !student.isAnonymous && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-sm text-gray-500">Profile Image</p>
                        <p className="font-medium text-gray-900">
                          {student.profileImage ? 'Available' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-sm text-gray-500">Registration Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(student.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
