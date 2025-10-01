from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import hashlib
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'ninetube_secret_key_2024'
CORS(app, supports_credentials=True)

# Database file paths
USERS_DB = 'users.json'
VIDEOS_DB = 'videos.json'
COMMENTS_DB = 'comments.json'

# Initialize database files if they don't exist
def init_databases():
    if not os.path.exists(USERS_DB):
        with open(USERS_DB, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(VIDEOS_DB):
        with open(VIDEOS_DB, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(COMMENTS_DB):
        with open(COMMENTS_DB, 'w') as f:
            json.dump([], f)

# Helper functions
def load_users():
    try:
        with open(USERS_DB, 'r') as f:
            return json.load(f)
    except:
        return []

def save_users(users):
    with open(USERS_DB, 'w') as f:
        json.dump(users, f, indent=2)

def load_videos():
    try:
        with open(VIDEOS_DB, 'r') as f:
            return json.load(f)
    except:
        return []

def save_videos(videos):
    with open(VIDEOS_DB, 'w') as f:
        json.dump(videos, f, indent=2)

def load_comments():
    try:
        with open(COMMENTS_DB, 'r') as f:
            return json.load(f)
    except:
        return []

def save_comments(comments):
    with open(COMMENTS_DB, 'w') as f:
        json.dump(comments, f, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

# Authentication routes
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validation
        if not username or not email or not password:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if len(username) < 3:
            return jsonify({'success': False, 'message': 'Username must be at least 3 characters'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        users = load_users()
        
        # Check if user already exists
        for user in users:
            if user['username'].lower() == username.lower():
                return jsonify({'success': False, 'message': 'Username already exists'}), 400
            if user['email'].lower() == email.lower():
                return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        # Create new user
        new_user = {
            'id': str(uuid.uuid4()),
            'username': username,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat(),
            'profile_picture': 'default-avatar.png',
            'subscribers': 0,
            'private_account': False,
            'settings': {
                'dark_mode': False,
                'language': 'English'
            }
        }
        
        users.append(new_user)
        save_users(users)
        
        # Set session
        session['user_id'] = new_user['id']
        session['username'] = new_user['username']
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully',
            'user': {
                'id': new_user['id'],
                'username': new_user['username'],
                'email': new_user['email'],
                'profile_picture': new_user['profile_picture'],
                'subscribers': new_user['subscribers']
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Server error'}), 500

@app.route('/api/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required'}), 400
        
        users = load_users()
        
        # Find user
        user = None
        for u in users:
            if u['username'].lower() == username.lower() or u['email'].lower() == username.lower():
                user = u
                break
        
        if not user or not verify_password(password, user['password']):
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
        
        # Set session
        session['user_id'] = user['id']
        session['username'] = user['username']
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'profile_picture': user['profile_picture'],
                'subscribers': user['subscribers'],
                'settings': user['settings']
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Server error'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        users = load_users()
        user = next((u for u in users if u['id'] == session['user_id']), None)
        if user:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'profile_picture': user['profile_picture'],
                    'subscribers': user['subscribers'],
                    'settings': user['settings']
                }
            })
    return jsonify({'authenticated': False})

# User settings routes
@app.route('/api/update-settings', methods=['POST'])
def update_settings():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    try:
        data = request.get_json()
        users = load_users()
        
        # Find and update user
        for i, user in enumerate(users):
            if user['id'] == session['user_id']:
                if 'dark_mode' in data:
                    users[i]['settings']['dark_mode'] = data['dark_mode']
                if 'language' in data:
                    users[i]['settings']['language'] = data['language']
                if 'private_account' in data:
                    users[i]['private_account'] = data['private_account']
                
                save_users(users)
                return jsonify({'success': True, 'message': 'Settings updated'})
        
        return jsonify({'success': False, 'message': 'User not found'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Video routes
@app.route('/api/videos', methods=['GET'])
def get_videos():
    videos = load_videos()
    return jsonify({'videos': videos})

@app.route('/api/upload-video', methods=['POST'])
def upload_video():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    try:
        data = request.get_json()
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        
        if not title:
            return jsonify({'success': False, 'message': 'Title is required'}), 400
        
        videos = load_videos()
        
        new_video = {
            'id': str(uuid.uuid4()),
            'title': title,
            'description': description,
            'uploader': session['username'],
            'uploader_id': session['user_id'],
            'upload_date': datetime.now().isoformat(),
            'views': 0,
            'likes': 0,
            'dislikes': 0,
            'thumbnail': 'default-thumbnail.jpg',
            'video_file': f"user_video_{len(videos) + 1}.mp4"
        }
        
        videos.append(new_video)
        save_videos(videos)
        
        return jsonify({
            'success': True,
            'message': 'Video uploaded successfully',
            'video': new_video
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Comment routes
@app.route('/api/comments/<video_id>', methods=['GET'])
def get_comments(video_id):
    comments = load_comments()
    video_comments = [c for c in comments if c['video_id'] == video_id]
    return jsonify({'comments': video_comments})

@app.route('/api/add-comment', methods=['POST'])
def add_comment():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    try:
        data = request.get_json()
        video_id = data.get('video_id')
        content = data.get('content', '').strip()
        
        if not content:
            return jsonify({'success': False, 'message': 'Comment cannot be empty'}), 400
        
        comments = load_comments()
        
        new_comment = {
            'id': str(uuid.uuid4()),
            'video_id': video_id,
            'user_id': session['user_id'],
            'username': session['username'],
            'content': content,
            'timestamp': datetime.now().isoformat(),
            'likes': 0,
            'dislikes': 0
        }
        
        comments.append(new_comment)
        save_comments(comments)
        
        return jsonify({
            'success': True,
            'message': 'Comment added',
            'comment': new_comment
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Server error'}), 500

if __name__ == '__main__':
    init_databases()
    app.run(debug=True, host='0.0.0.0', port=5000)