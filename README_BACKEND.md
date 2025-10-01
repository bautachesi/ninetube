# Ninetube Dual Server Setup

## Quick Start

### Option 1: Automatic (Recommended)
**Double-click `start_both_servers.bat`** - This starts both servers automatically

### Option 2: Manual Setup
1. **Start Flask Backend API:**
   - Double-click `start_server.bat`
   - Or run manually: `python app.py`
   - Backend runs on: **http://localhost:5000**

2. **Start Frontend Server:**
   - Double-click `start_frontend.bat` 
   - Or run manually: `python -m http.server 8000`
   - Frontend runs on: **http://localhost:8000**

3. **Access the website:** http://localhost:8000

## Architecture

**Dual Server System:**
- **Flask Backend (Port 5000):** Handles API requests, authentication, database
- **Python HTTP Server (Port 8000):** Serves HTML, CSS, JS static files

**Why Two Servers?**
- Separation of concerns: API logic vs static file serving
- Prevents CORS issues between frontend and backend
- Better development workflow and debugging

3. **Database files created automatically:**
   - `users.json` - User accounts and profiles
   - `videos.json` - Video metadata
   - `comments.json` - Comments and interactions

## Features

### Authentication System
- **Real user registration** with validation
- **Secure login** with password hashing (SHA-256)
- **Session management** with Flask sessions
- **Cross-origin support** for frontend integration

### API Endpoints

#### Authentication
- `POST /api/signup` - Create new account
- `POST /api/signin` - User login
- `POST /api/logout` - User logout  
- `GET /api/check-auth` - Check authentication status

#### User Settings
- `POST /api/update-settings` - Update user preferences
  - Dark mode toggle
  - Private account toggle
  - Language selection

#### Videos (Future)
- `GET /api/videos` - Get all videos
- `POST /api/upload-video` - Upload new video

#### Comments (Future)
- `GET /api/comments/<video_id>` - Get video comments
- `POST /api/add-comment` - Add new comment

## Database Structure

### users.json
```json
{
  "id": "unique-uuid",
  "username": "user123",
  "email": "user@example.com", 
  "password": "hashed-password",
  "created_at": "2024-01-01T00:00:00",
  "profile_picture": "default-avatar.png",
  "subscribers": 0,
  "private_account": false,
  "settings": {
    "dark_mode": false,
    "language": "English"
  }
}
```

## Security Features
- Password hashing with SHA-256
- Session-based authentication
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Error handling and proper HTTP status codes

## Frontend Integration
The frontend now makes real HTTP requests to the backend instead of using localStorage for authentication. The system maintains backward compatibility with existing localStorage usage for other features.