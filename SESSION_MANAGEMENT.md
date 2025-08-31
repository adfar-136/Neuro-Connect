# Session Management Features

## Overview
The Neuro Connect platform now includes comprehensive session management with automatic expiration and manual ending capabilities.

## New Features

### 1. Session Duration & Auto-Expiration
- **Duration Field**: Each session now has a configurable duration (15-180 minutes, default: 60 minutes)
- **End Time Calculation**: Automatically calculated as `preferredDateTime + duration`
- **Auto-Expiration**: Sessions automatically expire after their end time
- **Background Job**: Runs every 5 minutes to check and expire overdue sessions

### 2. Session Status Updates
- **New Status**: Added `expired` status for automatically expired sessions
- **Status Flow**: `pending` → `approved` → `completed` or `expired`

### 3. Manual Session Ending
- **Doctor Control**: Doctors can manually end sessions before expiration
- **Feedback System**: Comprehensive feedback collection including:
  - Final feedback for students
  - Session rating (1-5 stars)
  - Additional session notes

### 4. Enhanced UI
- **Duration Display**: Shows session duration and end time
- **Expiration Indicators**: Visual indicators for expired sessions
- **End Session Button**: Prominent button for doctors to end sessions
- **Feedback Display**: Shows completed session feedback and ratings

## Technical Implementation

### Database Schema Updates
```javascript
// New fields in Session model
duration: Number,           // Duration in minutes (15-180, default: 60)
endTime: Date,             // Calculated end time
sessionEndedAt: Date,      // When session was ended
finalFeedback: String,     // Doctor's final feedback
sessionRating: Number,     // Session rating (1-5)
sessionNotes: String       // Additional session notes
```

### API Endpoints
- `POST /api/sessions/:sessionId/end` - End session with feedback
- `GET /api/sessions/expired` - Get expired sessions
- `POST /api/sessions/auto-expire` - Manually trigger expiration check

### Background Job
- **Frequency**: Every 5 minutes
- **Function**: Checks for expired sessions and updates their status
- **Notifications**: Emits socket events for expired sessions

## Usage Examples

### Creating a Session with Duration
```javascript
const sessionData = {
  doctorId: 'doctor_id',
  title: 'Anxiety Management',
  description: 'Help with exam anxiety',
  preferredDateTime: new Date('2024-01-15T10:00:00Z'),
  duration: 90  // 90 minutes
};
```

### Ending a Session
```javascript
const endSessionData = {
  feedback: 'Great progress! Continue with breathing exercises.',
  rating: 5,
  notes: 'Student ready for follow-up in 2 weeks.'
};

await axios.post(`/api/sessions/${sessionId}/end`, endSessionData);
```

### Checking Session Expiration
```javascript
const session = await Session.findById(sessionId);
if (session.isExpired()) {
  console.log('Session has expired');
}
```

## Testing

### Run Session Expiration Test
```bash
cd server
npm run test:expiration
```

### Test Auto-Expiration
1. Create a session with short duration (e.g., 1 minute)
2. Wait for expiration
3. Check status changes to 'expired'

## Benefits

1. **Better Resource Management**: Sessions don't remain open indefinitely
2. **Improved User Experience**: Clear session boundaries and feedback
3. **Professional Standards**: Structured session ending with feedback
4. **Automation**: Reduces manual intervention for expired sessions
5. **Data Quality**: Comprehensive session completion tracking

## Future Enhancements

- Session rescheduling within time limits
- Automated reminders before expiration
- Session analytics and reporting
- Integration with calendar systems
- Bulk session management for doctors
