import express from 'express';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create session request (students only)
router.post('/', authenticate, authorize('student'), async (req, res) => {
  try {
    const { doctorId, title, description, isAnonymous, anonymousName, preferredDateTime } = req.body;

    // Check if doctor exists and is active
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor' || !doctor.isActive) {
      return res.status(404).json({ message: 'Doctor not found or not available' });
    }

    const sessionData = {
      student: req.user._id,
      doctor: doctorId,
      title,
      description,
      isAnonymous: isAnonymous || false,
      preferredDateTime: new Date(preferredDateTime)
    };

    if (isAnonymous && anonymousName) {
      sessionData.anonymousName = anonymousName;
    }

    const session = new Session(sessionData);
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('student', 'name email')
      .populate('doctor', 'name specialization');

    res.status(201).json({
      message: 'Session request created successfully',
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's sessions
router.get('/my-sessions', authenticate, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const sessions = await Session.find(query)
      .populate('student', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update session status (doctors only)
router.patch('/:sessionId/status', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { status, doctorResponse } = req.body;
    
    const session = await Session.findOne({
      _id: req.params.sessionId,
      doctor: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = status;
    session.responseDate = new Date();
    
    if (doctorResponse) {
      session.doctorResponse = doctorResponse;
    }

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('student', 'name email')
      .populate('doctor', 'name specialization');

    res.json({
      message: 'Session status updated successfully',
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;