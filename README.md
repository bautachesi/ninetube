# Ninetube 🎥

A YouTube-like video platform built with vanilla HTML, CSS, and JavaScript, featuring a Flask backend for authentication and user management.

## Features ✨

- **User Authentication**: Real login/signup system with Flask backend
- **Video Upload**: Upload videos with custom thumbnails
- **Video Management**: Like/dislike, comment system, watch history
- **User Profiles**: Customizable avatars, channel management
- **Settings**: Multi-language support, privacy settings
- **Responsive Design**: YouTube 2014-inspired interface
- **Real-time Updates**: Cross-tab synchronization
- **Search Functionality**: Find videos and channels

## Tech Stack 🛠️

### Frontend
- **HTML5/CSS3**: Semantic markup and modern styling
- **Vanilla JavaScript**: No frameworks, pure JS
- **LocalStorage**: Client-side data persistence
- **FileReader API**: File upload handling

### Backend
- **Flask 2.3.3**: Python web framework
- **Flask-CORS 4.0.0**: Cross-origin resource sharing
- **Werkzeug 2.3.7**: WSGI utilities
- **JSON**: File-based data storage

## Quick Start 🚀

### Prerequisites
- Python 3.7+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ninetube.git
   cd ninetube
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask backend** (Terminal 1)
   ```bash
   python app.py
   ```
   Backend runs on `http://localhost:5000`

4. **Start the frontend server** (Terminal 2)
   ```bash
   python -m http.server 8000
   ```
   Frontend runs on `http://localhost:8000`

5. **Open your browser**
   Navigate to `http://localhost:8000`

## Project Structure 📁

```
ninetube/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── index.html            # Homepage
├── video.html            # Video player page
├── upload.html           # Video upload page
├── settings.html         # User settings
├── profile.html          # User profiles
├── history.html          # Watch history
├── liked.html            # Liked videos
├── about.html            # About page
├── help.html             # Help center
├── report.html           # Report page
├── signin.html           # Login page
├── signup.html           # Registration page
├── *.css                 # Stylesheets
├── *-script.js           # JavaScript modules
├── assets/               # Images and media
└── README.md            # This file
```

## Usage 💡

### Getting Started
1. **Create Account**: Click "Sign up" to register
2. **Upload Videos**: Use the Upload button to share content
3. **Watch Videos**: Browse and enjoy content
4. **Interact**: Like, comment, and subscribe to channels

### Key Features
- **Video Upload**: Supports MP4 format with custom thumbnails
- **Real Authentication**: Secure login system with session management
- **Watch History**: Automatically tracks viewed videos
- **Multi-language**: English, Spanish, French, Russian support
- **Cross-tab Sync**: Changes sync across browser tabs

## API Endpoints 🔌

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/check-auth` - Check authentication status

### User Management
- `POST /api/update-settings` - Update user settings
- `GET /api/user-profile` - Get user profile data

## Development 👨‍💻

### File Organization
Each page has three associated files:
- `page.html` - Structure and markup
- `page-styles.css` - Page-specific styling
- `page-script.js` - Page functionality

### Design Principles
- **YouTube 2014 Style**: Classic, clean interface
- **No Animations**: Instantaneous transitions
- **Consistent Colors**: `#0034FF` primary blue
- **Responsive**: Works on all screen sizes

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Deployment 🚀

### Render Deployment
1. Connect your GitHub repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python app.py`
4. Deploy and enjoy!

## Screenshots 📸

*Add screenshots of your application here*

## Acknowledgments 🙏

- Inspired by YouTube's 2014 interface design
- Built with modern web technologies
- Focused on performance and user experience

---

**Ninetube** - *Bringing back the classic video sharing experience* 🎬