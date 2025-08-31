# Troubleshooting Guide

## Session Management Issues

### Problem: 500 Error when clicking "End Session"

**Symptoms:**
- Clicking "End Session" button results in 500 Internal Server Error
- Server logs show validation errors related to `endTime` field
- Existing sessions in database don't have required fields

**Root Cause:**
The Session model was updated to include new fields (`endTime`, `duration`) but existing sessions in the database don't have these fields, causing validation errors.

**Solution:**
Run the migration script to fix existing sessions:

```bash
cd server
npm run migrate
```

This script will:
1. Find all sessions missing `endTime` or `duration` fields
2. Set default duration to 60 minutes for missing values
3. Calculate `endTime` based on `preferredDateTime + duration`
4. Save the updated sessions

### Problem: 500 Error when creating anonymous sessions

**Symptoms:**
- Students get 500 error when trying to book sessions anonymously
- Error occurs specifically with anonymous session creation
- Regular (non-anonymous) sessions work fine

**Root Cause:**
The session creation logic wasn't properly handling anonymous sessions, especially when `anonymousName` field was empty or missing.

**Solution:**
The issue has been fixed in the latest update. The system now:
1. Always sets `anonymousName` when `isAnonymous` is true
2. Uses default "Anonymous Student" if no custom name is provided
3. Validates session data before saving
4. Ensures all required fields are properly set

**Verification:**
Test anonymous session creation:
```bash
cd server
npm run test:anonymous
```

### Problem: Sessions not showing duration or end time

**Symptoms:**
- Session cards don't display duration information
- End time is not shown
- Sessions appear to have no time limits

**Solution:**
1. Ensure the migration script has been run
2. Check that new sessions are created with duration field
3. Verify the Sessions component is properly displaying the fields

### Problem: Background job not expiring sessions

**Symptoms:**
- Sessions remain in "approved" status indefinitely
- No automatic expiration happening
- Server logs don't show expiration job running

**Solution:**
1. Check server logs for "Session expiration job started" message
2. Verify MongoDB connection is stable
3. Check that sessions have valid `endTime` values
4. Ensure server is running the background job

## Verification Steps

### 1. Check Session Data
```bash
# Connect to MongoDB and check session documents
use neuroo
db.sessions.findOne()
```

Look for these fields:
- `duration`: Should be a number (default: 60)
- `endTime`: Should be a date
- `status`: Should be one of: pending, approved, rejected, completed, cancelled, expired

### 2. Test Session Expiration
```bash
cd server
npm run test:expiration
```

This will create a test session and verify expiration functionality.

### 3. Test Anonymous Session Creation
```bash
cd server
npm run test:anonymous
```

This will test anonymous session creation and validation.

### 4. Check Server Logs
Look for these messages when starting the server:
- "MongoDB connected successfully"
- "Session expiration job started"
- "Auto-expiring X sessions" (every 5 minutes)

## Common Commands

```bash
# Fix existing sessions
npm run migrate

# Test expiration functionality
npm run test:expiration

# Test anonymous session creation
npm run test:anonymous

# Re-seed database with sample data
npm run seed

# Start development server
npm run dev
```

## Prevention

To avoid similar issues in the future:
1. Always run migrations when updating data models
2. Test new functionality with existing data
3. Use database migrations for schema changes
4. Validate data integrity after updates
5. Test edge cases like anonymous sessions thoroughly
