import express from 'express';
import User from '../models/User.js';
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

// Get platform statistics
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const activeDoctors = await User.countDocuments({ role: 'doctor', isActive: true });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', verificationStatus: 'pending' });

    res.json({
      totalUsers,
      totalStudents,
      totalDoctors,
      activeDoctors,
      pendingDoctors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;