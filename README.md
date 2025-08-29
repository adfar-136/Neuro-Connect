# 🧠 Neuro Connect - Mental Health Support Platform

A comprehensive mental health support platform designed for students, featuring AI-powered chat support, professional counseling sessions, educational content, and community features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Module Flow & Working](#module-flow--working)
- [AI Chat Integration](#ai-chat-integration)
- [Authentication & Security](#authentication--security)
- [File Upload System](#file-upload-system)
- [Real-time Communication](#real-time-communication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

Neuro Connect is a full-stack mental health support platform that connects students with professional counselors, provides AI-powered mental health support, and offers educational resources. The platform addresses the growing need for accessible mental health services in educational institutions.

### Key Objectives
- Provide 24/7 AI mental health support
- Connect students with verified professional counselors
- Offer educational content and resources
- Create a safe, anonymous support environment
- Facilitate real-time counseling sessions
- Support crisis intervention and emergency resources

## ✨ Features

### 🔐 User Management
- **Multi-role System**: Students, Doctors, and Administrators
- **Secure Authentication**: JWT-based authentication with role-based access
- **Profile Management**: Comprehensive user profiles with verification
- **Anonymous Sessions**: Students can choose to remain anonymous

### 🤖 AI Mental Health Chat
- **24/7 Support**: Always available AI companion
- **Context Awareness**: Maintains conversation history and context
- **Crisis Detection**: Automatically identifies crisis situations
- **Professional Guidance**: Encourages seeking professional help
- **Gemini AI Integration**: Powered by Google's latest AI model

### 👨‍⚕️ Professional Counseling
- **Verified Counselors**: Professional verification system
- **Session Booking**: Easy appointment scheduling
- **Real-time Chat**: Live counseling sessions
- **File Sharing**: Document and image sharing during sessions
- **Session Management**: Track and manage counseling history

### 📚 Educational Content
- **Mental Health Posts**: Educational articles and resources
- **Content Categories**: Awareness, tips, articles, and general content
- **Interactive Features**: Like, comment, and share posts
- **Author Verification**: Only verified professionals can create content

### 🎯 Admin Panel
- **User Management**: Comprehensive user oversight
- **System Monitoring**: Platform health and performance metrics
- **Content Moderation**: Manage posts and user-generated content
- **Analytics Dashboard**: Platform usage and growth metrics

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Socket.IO Client**: Real-time communication
- **Lucide React**: Beautiful icon library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: JSON Web Token authentication
- **Multer**: File upload handling
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

### AI & External Services
- **Google Gemini 2.0 Flash**: AI language model for mental health support
- **Real-time Chat**: WebSocket-based communication

## 📁 Project Structure

```
project-2/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   └── Navbar.jsx         # Navigation component
│   │   ├── context/                # React context providers
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── pages/                  # Application pages
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # User login
│   │   │   ├── Register.jsx       # User registration
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   ├── Doctors.jsx        # Doctor listing
│   │   │   ├── DoctorProfile.jsx  # Individual doctor profiles
│   │   │   ├── Sessions.jsx       # Session management
│   │   │   ├── StudentProfile.jsx # Student profile viewing
│   │   │   ├── Chat.jsx           # Real-time chat interface
│   │   │   ├── AIChat.jsx         # AI mental health chat
│   │   │   ├── Posts.jsx          # Educational content
│   │   │   └── AdminPanel.jsx     # Admin dashboard
│   │   ├── App.jsx                # Main application component
│   │   └── main.jsx               # Application entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   └── tailwind.config.js         # Tailwind CSS configuration
├── server/                         # Backend Node.js application
│   ├── models/                     # Database models
│   │   ├── User.js                # User model
│   │   ├── Post.js                # Post model
│   │   ├── Message.js             # Message model
│   │   └── Session.js             # Session model
│   ├── routes/                     # API route handlers
│   │   ├── auth.js                # Authentication routes
│   │   ├── users.js               # User management routes
│   │   ├── posts.js               # Content management routes
│   │   ├── sessions.js            # Session management routes
│   │   ├── chat.js                # Chat functionality routes
│   │   └── admin.js               # Admin panel routes
│   ├── middleware/                 # Custom middleware
│   │   └── auth.js                # Authentication middleware
│   ├── socket/                     # WebSocket handlers
│   │   └── socketHandler.js       # Real-time communication
│   ├── server/                     # File uploads directory
│   │   ├── uploads/
│   │   │   ├── chat/              # Chat file uploads
│   │   │   ├── documents/         # User document uploads
│   │   │   └── posts/             # Post image uploads
│   ├── server.js                   # Main server file
│   ├── seed.js                     # Database seeding script
│   └── package.json                # Backend dependencies
├── package.json                    # Root package.json
└── README.md                       # This file
```

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)
- **Git** (for cloning the repository)

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-2
```

### 2. Install Dependencies

#### Install Root Dependencies
```bash
npm install
```

#### Install Backend Dependencies
```bash
cd server
npm install
```

#### Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Environment Setup

#### Backend Environment
Create a `.env` file in the `server/` directory:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/neuroo
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
GEMINI_API_KEY=your-gemini-api-key
```

#### Frontend Environment
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```

### 4. Database Setup

#### Start MongoDB
```bash
# Start MongoDB service
mongod

# Or if using MongoDB Atlas, update the connection string in .env
```

#### Seed the Database
```bash
cd server
npm run seed
```

This will create:
- Admin user: `idrees@gmail.com` / `admin@123`
- 5 verified doctors
- 3 students
- 5 educational posts

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
cd server
npm run dev
```

The server will start on `http://localhost:8000`

### 2. Start the Frontend Application
```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:5173/admin (after login)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/doctors` - Get all verified doctors
- `GET /api/users/:userId` - Get specific user details

### Sessions
- `POST /api/sessions` - Create session request
- `GET /api/sessions/my-sessions` - Get user's sessions
- `PATCH /api/sessions/:sessionId/status` - Update session status

### Chat
- `POST /api/chat/:sessionId/message` - Send chat message
- `GET /api/chat/:sessionId/messages` - Get chat history

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/doctor/:doctorId` - Get posts by specific doctor
- `POST /api/posts` - Create new post (doctors only)
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/comment` - Comment on a post

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['student', 'doctor', 'admin'],
  specialization: String,        // For doctors
  qualifications: String,        // For doctors
  experience: Number,           // For doctors
  verificationStatus: String,   // For doctors
  isActive: Boolean,
  profileImage: String,
  documents: Array,             // For doctors
  timestamps: true
}
```

### Session Model
```javascript
{
  student: ObjectId,            // Reference to User
  doctor: ObjectId,             // Reference to User
  title: String,
  description: String,
  isAnonymous: Boolean,
  anonymousName: String,
  preferredDateTime: Date,
  status: String,               // pending, approved, rejected, completed
  chatRoom: String,
  doctorResponse: String,
  timestamps: true
}
```

### Message Model
```javascript
{
  sessionId: ObjectId,          // Reference to Session
  sender: ObjectId,             // Reference to User
  content: String,
  type: String,                 // text, image, file
  fileName: String,             // For file messages
  filePath: String,             // For file messages
  fileSize: Number,             // For file messages
  timestamps: true
}
```

### Post Model
```javascript
{
  title: String,
  content: String,
  author: ObjectId,             // Reference to User
  category: String,             // general, awareness, tips, article
  image: String,                // Optional image path
  likes: Array,                 // Array of user IDs
  comments: Array,              // Array of comment objects
  timestamps: true
}
```

## 🔄 Module Flow & Working

### 1. User Authentication Flow
```
User Registration → Email/Password Validation → Password Hashing → User Creation → JWT Token Generation → Login Success
```

### 2. Session Booking Flow
```
Student Browse Doctors → View Doctor Profile → Book Session → Session Request → Doctor Review → Accept/Reject → Chat Room Creation
```

### 3. Real-time Chat Flow
```
User Joins Session → Socket Connection → Message Sending → Real-time Broadcasting → Message Storage → Chat History
```

### 4. AI Chat Flow
```
User Input → Content Detection → Context Building → Gemini API Call → Response Generation → Context-Aware Reply
```

### 5. File Upload Flow
```
File Selection → Multer Processing → File Storage → Database Update → Real-time Broadcasting → File Display
```

## 🤖 AI Chat Integration

### Gemini API Integration
- **Model**: Gemini 2.0 Flash
- **Context Management**: Maintains conversation history
- **Content Filtering**: Mental health focus only
- **Crisis Detection**: Automatic crisis resource provision

### Content Detection System
```javascript
// Multi-layer detection for mental health relevance
1. Crisis Detection (suicide, self-harm)
2. Direct Keywords (depression, anxiety)
3. Emotional Indicators (feel, worried, stressed)
4. Life Situations (relationships, work, school)
5. Major Life Events (breakups, failures, losses)
6. Personal Struggles (overwhelmed, stuck)
7. Social Issues (lonely, bullied, rejected)
8. Question Patterns (how to, what should I do)
9. Behavioral Patterns (can't sleep, no motivation)
10. Broad Catch-all (personal statements)
```

### Context Management
- **Memory**: Last 10 messages maintained
- **Continuity**: AI builds on previous conversation
- **Personalization**: Responses tailored to ongoing situation
- **Emotional Awareness**: Connects current feelings to previous context

## 🔐 Authentication & Security

### JWT Implementation
- **Secret Key**: Configurable JWT secret
- **Expiration**: 24-hour token validity
- **Role-based Access**: Different permissions for different user types

### Password Security
- **Bcrypt Hashing**: 12-round salt hashing
- **Secure Storage**: Hashed passwords only
- **Validation**: Strong password requirements

### Route Protection
- **Authentication Middleware**: JWT verification
- **Authorization**: Role-based route access
- **Input Validation**: Request data sanitization

## 📁 File Upload System

### Multer Configuration
- **Storage**: Local file system
- **File Limits**: 5MB maximum file size
- **File Types**: Images (JPG, PNG, GIF) and documents
- **Directory Structure**: Organized by upload type

### Upload Directories
```
server/uploads/
├── chat/          # Chat file uploads
├── documents/     # User document uploads
└── posts/         # Post image uploads
```

### File Security
- **Type Validation**: Allowed file types only
- **Size Limits**: Prevents large file uploads
- **Path Sanitization**: Secure file paths
- **Access Control**: Authenticated users only

## 🌐 Real-time Communication

### Socket.IO Implementation
- **Connection Management**: User authentication and session joining
- **Room-based Chat**: Session-specific chat rooms
- **Real-time Broadcasting**: Instant message delivery
- **Typing Indicators**: User activity feedback

### WebSocket Events
- `join-session`: Join specific session room
- `new-message`: Send/receive messages
- `typing`: Show typing indicators
- `user-typing`: Broadcast typing status

### Message Broadcasting
- **Global Function**: `broadcastMessage` for file messages
- **Session Rooms**: Messages sent to session participants only
- **Error Handling**: Graceful fallback for failed broadcasts

## 🧪 Testing

### Manual Testing
1. **User Registration**: Test all user roles
2. **Authentication**: Login/logout functionality
3. **Session Booking**: Complete booking flow
4. **Real-time Chat**: Message sending and receiving
5. **File Uploads**: Image and document sharing
6. **AI Chat**: Mental health conversation testing
7. **Admin Panel**: User management and monitoring

### API Testing
```bash
# Test API endpoints
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🚀 Deployment

### Environment Variables
- Update all environment variables for production
- Use strong JWT secrets
- Configure production database URLs
- Set up proper CORS origins

### Database
- Use production MongoDB instance
- Set up proper indexes
- Configure backup strategies
- Monitor performance

### Security
- Enable HTTPS
- Set up proper CORS policies
- Implement rate limiting
- Add security headers

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use consistent formatting
- Add proper comments
- Follow React best practices
- Maintain security standards

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running
2. **Port Conflicts**: Check for port 8000 and 5173 availability
3. **File Uploads**: Verify upload directory permissions
4. **AI Chat**: Check Gemini API key configuration

### Getting Help
- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check MongoDB connection status

---

**Built with ❤️ for mental health support and student well-being**

*For more information, contact the development team or refer to the project documentation.*

