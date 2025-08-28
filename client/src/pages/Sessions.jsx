import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MessageCircle, CheckCircle, XCircle, User, Eye } from 'lucide-react';
import axios from 'axios';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [doctorResponse, setDoctorResponse] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions/my-sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionResponse = async (sessionId, status) => {
    try {
      await axios.patch(`/api/sessions/${sessionId}/status`, {
        status,
        doctorResponse
      });

      setSessions(sessions.map(session =>
        session._id === sessionId 
          ? { ...session, status, doctorResponse, responseDate: new Date() }
          : session
      ));

      setSelectedSession(null);
      setDoctorResponse('');
    } catch (error) {
      console.error('Failed to update session status:', error);
    }
  };

  const openChat = (session) => {
    if (session.status === 'approved' && session.chatRoom) {
      navigate(`/chat/${session._id}`);
    }
  };

  const viewStudentProfile = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'student' ? 'My Sessions' : 'Session Requests'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'student' 
              ? 'Manage your counselling sessions'
              : 'Review and respond to student requests'
            }
          </p>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {user.role === 'student' ? (
                            `Dr. ${session.doctor?.name}`
                          ) : (
                            session.isAnonymous ? session.anonymousName : session.student?.name
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {new Date(session.preferredDateTime).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{session.description}</p>

                    {session.doctorResponse && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-800 mb-2">Doctor's Response:</h4>
                        <p className="text-blue-700 text-sm">{session.doctorResponse}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      {user.role === 'doctor' && session.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setSelectedSession(session)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Respond
                          </button>
                          
                          {!session.isAnonymous && (
                            <button
                              onClick={() => viewStudentProfile(session.student._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Profile</span>
                            </button>
                          )}
                        </>
                      )}

                      {session.status === 'approved' && (
                        <button
                          onClick={() => openChat(session)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Open Chat</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-600">
                {user.role === 'student' ? 
                  'Book your first session with a counsellor to get started.' :
                  'No session requests at this time.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Doctor Response Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Respond to Session Request
              </h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{selectedSession.title}</h3>
                <p className="text-sm text-gray-600">
                  by {selectedSession.isAnonymous ? selectedSession.anonymousName : selectedSession.student?.name}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (Optional)
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Add a message to your response..."
                  value={doctorResponse}
                  onChange={(e) => setDoctorResponse(e.target.value)}
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSessionResponse(selectedSession._id, 'rejected')}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleSessionResponse(selectedSession._id, 'approved')}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;