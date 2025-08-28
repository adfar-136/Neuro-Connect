import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all active doctors
router.get('/doctors', authenticate, async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor',
      isActive: true,
      verificationStatus: 'approved'
    }).select('name specialization qualifications experience profileImage');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor by ID
router.get('/doctors/:doctorId', authenticate, async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.doctorId,
      role: 'doctor',
      isActive: true,
      verificationStatus: 'approved'
    }).select('name specialization qualifications experience profileImage');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;