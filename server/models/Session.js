import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  anonymousName: {
    type: String,
    default: 'Anonymous Student'
  },
  preferredDateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  chatRoom: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    default: ''
  },
  doctorResponse: {
    type: String,
    default: ''
  },
  responseDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate unique chat room ID when session is approved
sessionSchema.pre('save', function(next) {
  if (this.status === 'approved' && !this.chatRoom) {
    this.chatRoom = `chat_${this._id}_${Date.now()}`;
  }
  next();
});

export default mongoose.model('Session', sessionSchema);