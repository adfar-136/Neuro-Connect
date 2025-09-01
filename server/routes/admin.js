import express from 'express';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Post from '../models/Post.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all pending doctors
router.get('/doctors/pending', authenticate, authorize('admin'), async (req, res) => {
  try {
    const pendingDoctors = await User.find({
      role: 'doctor',
      verificationStatus: 'pending'
    }).select('-password');

    res.json(pendingDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all doctors
router.get('/doctors', authenticate, authorize('admin'), async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor'
    }).select('-password');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get comprehensive platform statistics
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const activeDoctors = await User.countDocuments({ role: 'doctor', isActive: true });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', verificationStatus: 'pending' });
    const verifiedDoctors = await User.countDocuments({ role: 'doctor', verificationStatus: 'approved' });

    // Session statistics
    const totalSessions = await Session.countDocuments();
    const pendingSessions = await Session.countDocuments({ status: 'pending' });
    const approvedSessions = await Session.countDocuments({ status: 'approved' });
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const expiredSessions = await Session.countDocuments({ status: 'expired' });
    const rejectedSessions = await Session.countDocuments({ status: 'rejected' });

    // Post statistics
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ isActive: true });
    const draftPosts = await Post.countDocuments({ isActive: false });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newSessionsThisWeek = await Session.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newPostsThisWeek = await Post.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        doctors: totalDoctors,
        activeDoctors,
        pendingDoctors,
        verifiedDoctors
      },
      sessions: {
        total: totalSessions,
        pending: pendingSessions,
        approved: approvedSessions,
        completed: completedSessions,
        expired: expiredSessions,
        rejected: rejectedSessions
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts
      },
      weeklyGrowth: {
        newUsers: newUsersThisWeek,
        newSessions: newSessionsThisWeek,
        newPosts: newPostsThisWeek
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor performance analytics
router.get('/analytics/doctors', authenticate, authorize('admin'), async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email specialization isActive verificationStatus');
    
    const doctorStats = await Promise.all(doctors.map(async (doctor) => {
      const totalSessions = await Session.countDocuments({ doctor: doctor._id });
      const completedSessions = await Session.countDocuments({ 
        doctor: doctor._id, 
        status: 'completed' 
      });
      const pendingSessions = await Session.countDocuments({ 
        doctor: doctor._id, 
        status: 'pending' 
      });
      const approvedSessions = await Session.countDocuments({ 
        doctor: doctor._id, 
        status: 'approved' 
      });

      // Calculate average session duration
      const sessions = await Session.find({ 
        doctor: doctor._id, 
        duration: { $exists: true } 
      }).select('duration');
      
      const avgDuration = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / sessions.length 
        : 0;

      return {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        isActive: doctor.isActive,
        verificationStatus: doctor.verificationStatus,
        stats: {
          totalSessions,
          completedSessions,
          pendingSessions,
          approvedSessions,
          avgDuration: Math.round(avgDuration)
        }
      };
    }));

    res.json(doctorStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get session analytics over time
router.get('/analytics/sessions', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let days;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      default: days = 7;
    }

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Get sessions created in the period
    const sessions = await Session.find({
      createdAt: { $gte: startDate }
    }).select('createdAt status duration');

    // Group by date
    const dailyStats = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = {
        total: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        expired: 0,
        rejected: 0,
        avgDuration: 0
      };
    }

    // Calculate daily statistics
    sessions.forEach(session => {
      const dateKey = session.createdAt.toISOString().split('T')[0];
      if (dailyStats[dateKey]) {
        dailyStats[dateKey].total++;
        dailyStats[dateKey][session.status]++;
        if (session.duration) {
          dailyStats[dateKey].avgDuration += session.duration;
        }
      }
    });

    // Calculate average duration for each day
    Object.keys(dailyStats).forEach(date => {
      if (dailyStats[date].total > 0) {
        dailyStats[date].avgDuration = Math.round(dailyStats[date].avgDuration / dailyStats[date].total);
      }
    });

    res.json({
      period,
      days,
      dailyStats,
      totalSessions: sessions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user growth analytics
router.get('/analytics/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let days;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      default: days = 30;
    }

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Get users created in the period
    const users = await User.find({
      createdAt: { $gte: startDate }
    }).select('createdAt role');

    // Group by date and role
    const dailyStats = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = {
        total: 0,
        students: 0,
        doctors: 0,
        admins: 0
      };
    }

    // Calculate daily statistics
    users.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0];
      if (dailyStats[dateKey]) {
        dailyStats[dateKey].total++;
        dailyStats[dateKey][user.role + 's']++;
      }
    });

    res.json({
      period,
      days,
      dailyStats,
      totalUsers: users.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify doctor
router.patch('/doctors/:doctorId/verify', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    const doctor = await User.findById(req.params.doctorId);
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.verificationStatus = status;
    doctor.verificationDate = new Date();
    doctor.verifiedBy = req.user._id;
    
    if (status === 'approved') {
      doctor.isActive = true;
    }

    await doctor.save();

    res.json({
      message: `Doctor ${status} successfully`,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        verificationStatus: doctor.verificationStatus,
        isActive: doctor.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all posts for admin management
router.get('/posts', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by status (isActive)
    if (status && status !== 'all') {
      if (status === 'published') {
        query.isActive = true;
      } else if (status === 'draft') {
        query.isActive = false;
      }
    }
    
    const skip = (page - 1) * limit;
    
    const posts = await Post.find(query)
      .populate('author', 'name email specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      hasNextPage: page * limit < totalPosts,
      hasPrevPage: page > 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;