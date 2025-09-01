import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, Paperclip, Image, ArrowLeft, User, MessageCircle } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const removeDuplicateMessages = (messages) => {
    const seen = new Set();
    return messages.filter(message => {
      const key = `${message.content}_${message.sender._id}_${message.createdAt}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    // Remove duplicate messages whenever messages change
    setMessages(prev => removeDuplicateMessages(prev));
  }, [messages.length]);

  useEffect(() => {
    // Handle ESC key to close image modal
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showImageModal) {
        setShowImageModal(false);
        setSelectedImage(null);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showImageModal]);

  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    console.log('Current user:', user);
    console.log('User ID:', user.id, 'User _id:', user._id);

    const newSocket = io('http://localhost:8000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
      setError('');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Connection failed. Please refresh the page.');
      setSocketConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    setSocket(newSocket);

    // Fetch session details and messages
    fetchSessionData();

    // Socket event listeners
    newSocket.on('joined-session', (data) => {
      console.log('Joined session:', data.sessionId);
    });

    newSocket.on('new-message', (message) => {
      console.log('New message received:', message);
      
      // Log file information for debugging
      if (message.type !== 'text') {
        console.log('File message details:', {
          type: message.type,
          filePath: message.filePath,
          fileName: message.fileName,
          fullUrl: `http://localhost:8000${message.filePath}`
        });
      }
      
      // Check if this message already exists to prevent duplicates
      setMessages(prev => {
        const messageExists = prev.some(msg => 
          msg._id === message._id || 
          (msg.isTemp && msg.content === message.content && msg.sender._id === message.sender._id)
        );
        
        if (messageExists) {
          // Replace temp message with real message or skip if already exists
          return prev.map(msg => 
            msg.isTemp && msg.content === message.content && msg.sender._id === message.sender._id 
              ? message 
              : msg
          );
        } else {
          // Add new message
          return [...prev, message];
        }
      });
    });

    newSocket.on('message-sent', (message) => {
      console.log('Message sent confirmation:', message);
      // The temporary message will be replaced by the new-message event
      // This is just for confirmation logging
    });

    newSocket.on('user-typing', (data) => {
      if (data.userId !== user.id) {
        setTyping(`${data.userName} is typing...`);
      }
    });

    newSocket.on('user-stop-typing', (data) => {
      if (data.userId !== user.id) {
        setTyping('');
      }
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message || 'An error occurred');
      
      // Remove temporary messages on error
      setMessages(prev => prev.filter(msg => !msg.isTemp));
    });

    // Join session room
    newSocket.emit('join-session', sessionId);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [sessionId, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSessionData = async () => {
    try {
      // Fetch session details
      const sessionResponse = await axios.get('/api/sessions/my-sessions');
      const currentSession = sessionResponse.data.find(s => s._id === sessionId);
      
      if (!currentSession) {
        setError('Session not found');
        setLoading(false);
        return;
      }
      
      setSession(currentSession);

      // Fetch messages
      const messagesResponse = await axios.get(`/api/chat/${sessionId}`);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
      setError('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !socketConnected) {
      if (!socketConnected) {
        setError('Connection lost. Please refresh the page.');
      }
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage('');

    // Create a temporary message with a unique ID for optimistic update
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      content: messageContent,
      sender: { _id: user.id, name: user.name, profileImage: user.profileImage },
      type: 'text',
      createdAt: new Date().toISOString(),
      isTemp: true
    };
    
    // Add temporary message to UI
    setMessages(prev => [...prev, tempMessage]);

    // Set a timeout to remove the temporary message if it's not replaced
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    }, 5000); // 5 seconds timeout

    socket.emit('send-message', {
      sessionId,
      content: messageContent,
      type: 'text'
    });

    socket.emit('stop-typing', { sessionId });
  };

  const handleTyping = () => {
    if (socket && socketConnected) {
      socket.emit('typing', { sessionId });
      
      // Clear typing after 2 seconds
      setTimeout(() => {
        socket.emit('stop-typing', { sessionId });
      }, 2000);
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Add file to uploading state
      setUploadingFiles(prev => new Set(prev).add(file.name));
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('content', `Shared ${type === 'image' ? 'image' : 'file'}: ${file.name}`);

      const response = await axios.post(`/api/chat/${sessionId}/message`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('File upload response:', response.data);
      
      // Remove file from uploading state
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.name);
        return newSet;
      });
      
      // The message will be broadcasted via socket, so we don't need to add it manually
    } catch (error) {
      console.error('Failed to upload file:', error);
      setError(`Failed to upload file: ${error.response?.data?.message || error.message}`);
      
      // Remove file from uploading state on error
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.name);
        return newSet;
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/sessions')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/sessions')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">
              {user.role === 'student' ? 
                `Dr. ${session.doctor?.name}` : 
                (session.isAnonymous ? session.anonymousName : session.student?.name)
              }
            </h2>
            <p className="text-sm text-gray-600">{session.title}</p>
            {!socketConnected && (
              <p className="text-xs text-red-500 mt-1">⚠️ Connection lost</p>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 p-3 mx-6 mt-2 rounded text-xs text-gray-600">
          <p>Debug: User ID: {user.id || user._id} | Session: {sessionId}</p>
          <p>Messages: {messages.length} | Socket: {socketConnected ? 'Connected' : 'Disconnected'}</p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate = index === 0 || 
              formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);
            
            // Ensure consistent user ID comparison
            const isOwnMessage = message.sender._id === user.id || message.sender._id === user._id;
            
            return (
              <div key={message._id}>
                {showDate && (
                  <div className="text-center mb-4">
                    <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    {message.type === 'text' ? (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    ) : message.type === 'image' ? (
                      <div className="space-y-2">
                        <img
                          src={`http://localhost:8000${message.filePath}`}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setSelectedImage(message);
                            setShowImageModal(true);
                          }}
                          onError={(e) => {
                            console.error('Image load error for:', message.filePath);
                            console.error('Full image URL:', `http://localhost:8000${message.filePath}`);
                            console.error('Message data:', message);
                            e.target.style.display = 'none';
                            // Show error message
                            e.target.nextSibling.textContent = `Failed to load image: ${message.fileName || 'Unknown file'}`;
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', message.filePath);
                          }}
                        />
                        {message.fileName && (
                          <p className="text-xs opacity-75">{message.fileName}</p>
                        )}
                      </div>
                    ) : message.type === 'file' ? (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.fileName}</p>
                          {message.fileSize && (
                            <p className="text-xs text-gray-500">
                              {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                        <a
                          href={`http://localhost:8000${message.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                          download
                        >
                          Download
                        </a>
                      </div>
                    ) : null}
                    <p className={`text-xs mt-2 ${
                      isOwnMessage ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
              <p className="text-sm text-gray-500 italic">{typing}</p>
            </div>
          </div>
        )}
        
        {/* Uploading files indicator */}
        {uploadingFiles.size > 0 && (
          <div className="flex justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <p className="text-sm text-blue-700">
                  Uploading {uploadingFiles.size} file{uploadingFiles.size > 1 ? 's' : ''}...
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white shadow-lg border-t border-gray-200 p-6">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const isImage = file.type.startsWith('image/');
                handleFileUpload(file, isImage ? 'image' : 'file');
              }
            }}
          />
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-full px-6 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              disabled={!socketConnected}
            />
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim() || !socketConnected}
            className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Download button */}
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `http://localhost:8000${selectedImage.filePath}`;
                link.download = selectedImage.fileName || 'image';
                link.click();
              }}
              className="absolute top-4 right-16 text-white hover:text-gray-300 transition-colors z-10"
              title="Download image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={`http://localhost:8000${selectedImage.filePath}`}
              alt={selectedImage.fileName || "Full size image"}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <p className="text-sm font-medium">{selectedImage.fileName}</p>
              <p className="text-xs opacity-75">
                Click outside or press ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };
  
  export default Chat;