document.addEventListener('DOMContentLoaded', function() {
    setupHeaderUserDisplay();
    setupSearchFunctionality();
    setupUploadFunctionality();
    checkAuthentication();
});

// Check if user is authenticated
function checkAuthentication() {
    var isLoggedIn = false;
    try {
        isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
    } catch (e) {
        console.log('Error checking authentication:', e);
    }
    
    if (!isLoggedIn) {
        // Redirect to sign in if not logged in
        window.location.href = 'signin.html';
        return;
    }
}

// Setup header user display
function setupHeaderUserDisplay() {
    var userChip = document.getElementById('nt-user');
    var usernameEl = document.getElementById('nt-username');
    
    // User data
    var isLoggedIn = false;
    var currentUser = '';
    var currentAvatar = '';
    
    try {
        isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
        currentUser = localStorage.getItem('nt_username') || '';
        currentAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
    } catch (e) {
        console.log('Error loading user data:', e);
    }
    
    // Show logged in user in header
    if (isLoggedIn && userChip && usernameEl) {
        usernameEl.textContent = currentUser;
        userChip.style.display = 'inline-flex';
        
        // Update avatar with saved image
        var headerAvatar = document.querySelector('.nt-user__pfp');
        if (headerAvatar) {
            headerAvatar.src = currentAvatar;
        }
        
        // Hide sign in/up buttons
        var signinBtn = document.querySelector('.nt-btn--primary');
        var signupBtn = document.querySelector('.nt-btn--outline');
        if (signinBtn) signinBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
    } else {
        // Show sign in/up buttons
        if (userChip) userChip.style.display = 'none';
        
        var headerSignIn = document.querySelector('.nt-btn--primary');
        var headerSignUp = document.querySelector('.nt-btn--outline');
        if (headerSignIn) {
            headerSignIn.style.display = 'inline-block';
            headerSignIn.onclick = function() {
                window.location.href = 'signin.html';
            };
        }
        if (headerSignUp) {
            headerSignUp.style.display = 'inline-block';
            headerSignUp.onclick = function() {
                window.location.href = 'signup.html';
            };
        }
    }
}

// Setup search functionality
function setupSearchFunctionality() {
    var searchForm = document.getElementById('nt-search-form');
    var searchInput = document.getElementById('nt-search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var query = searchInput.value.trim();
            if (query) {
                window.location.href = 'results.html?q=' + encodeURIComponent(query);
            }
        });
    }
}

// Setup upload functionality
function setupUploadFunctionality() {
    var iconContainer = document.getElementById('upload-icon-container');
    var videoInput = document.getElementById('video-file-input');
    var thumbnailInput = document.getElementById('thumbnail-file-input');
    var uploadTitle = document.getElementById('upload-title');
    var editPanel = document.getElementById('edit-panel');
    var videoPreview = document.getElementById('video-preview');
    var titleInput = document.getElementById('video-title-input');
    var descriptionInput = document.getElementById('video-description-input');
    var submitBtn = document.getElementById('upload-submit-btn');
    
    var selectedVideoFile = null;
    var selectedThumbnailFile = null;
    var thumbnailDataUrl = null;
    
    // Setup click handler for video upload
    var videoIconItem = iconContainer ? iconContainer.querySelector('.upload-icon-item') : null;
    var thumbnailIconItem = document.querySelector('.thumbnail-icon-item');
    
    // Video file selection
    if (videoIconItem && videoInput) {
        videoIconItem.addEventListener('click', function() {
            videoInput.click();
        });
        
        videoInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file && file.type === 'video/mp4') {
                selectedVideoFile = file;
                showEditPanel(file);
            } else {
                alert('Please select a valid MP4 video file.');
            }
        });
    }
    
    // Thumbnail file selection (in edit panel)
    if (thumbnailIconItem && thumbnailInput) {
        thumbnailIconItem.addEventListener('click', function() {
            thumbnailInput.click();
        });
        
        thumbnailInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
                selectedThumbnailFile = file;
                
                // Convert to data URL for preview
                var reader = new FileReader();
                reader.onload = function(event) {
                    thumbnailDataUrl = event.target.result;
                    updateThumbnailLabel();
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid PNG or JPG image file.');
            }
        });
    }
    
    // Update thumbnail label after selection
    function updateThumbnailLabel() {
        if (thumbnailIconItem) {
            var thumbLabel = thumbnailIconItem.querySelector('.thumbnail-icon-label');
            if (thumbLabel) {
                thumbLabel.textContent = selectedThumbnailFile ? '✓ Thumbnail Selected' : 'Select Thumbnail';
                thumbLabel.style.color = selectedThumbnailFile ? '#0751CF' : '#717171';
            }
            
            // Update border color
            if (selectedThumbnailFile) {
                thumbnailIconItem.style.borderColor = '#0751CF';
                thumbnailIconItem.style.backgroundColor = '#F0F8FF';
            }
        }
    }
    
    // Show edit panel after files selection
    function showEditPanel(videoFile) {
        if (uploadTitle) uploadTitle.textContent = '¡Edit the Video!';
        if (iconContainer) iconContainer.style.display = 'none';
        if (editPanel) editPanel.style.display = 'block';
        
        // Create video preview
        if (videoPreview) {
            var videoURL = URL.createObjectURL(videoFile);
            videoPreview.src = videoURL;
        }
    }
    
    // Submit upload
    if (submitBtn) {
        // Remove any existing event listeners to prevent duplicates
        var newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        submitBtn = newSubmitBtn;
        
        var isUploading = false; // Flag to prevent multiple uploads
        
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isUploading) {
                console.log('Upload already in progress, ignoring click');
                return;
            }
            
            console.log('Upload button clicked');
            
            var title = titleInput ? titleInput.value.trim() : '';
            var description = descriptionInput ? descriptionInput.value.trim() : '';
            
            console.log('Title:', title);
            console.log('Selected video file:', selectedVideoFile);
            console.log('Selected thumbnail file:', selectedThumbnailFile);
            
            if (!title) {
                alert('Please enter a title for your video.');
                return;
            }
            
            if (!selectedVideoFile) {
                alert('Please select a video file.');
                return;
            }
            
            if (!selectedThumbnailFile) {
                alert('Please select a thumbnail image.');
                return;
            }
            
            // Set uploading flag and disable button
            isUploading = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            
            uploadVideo(selectedVideoFile, selectedThumbnailFile, title, description);
        });
    }
}

// Upload video function
function uploadVideo(videoFile, thumbnailFile, title, description) {
    console.log('uploadVideo function called');
    
    try {
        // Get current user data
        var currentUser = localStorage.getItem('nt_username') || 'Anonymous';
        var currentAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
        var currentEmail = localStorage.getItem('nt_email') || '';
        
        console.log('Current user:', currentUser);
        
        // Create video object with unique ID
        var videoId = 'user_' + Date.now();
        var videoData = {
            id: videoId,
            src: videoId, // Use video ID as src for user videos
            title: title,
            uploaded: 'Uploaded just now',
            desc: description,
            thumbnail: null, // Will be set below
            uploader: {
                name: currentUser,
                avatar: currentAvatar,
                channelId: currentUser.toLowerCase().replace(/\s+/g, ''),
                email: currentEmail
            },
            likes: 0,
            dislikes: 0,
            isUserVideo: true
        };
        
        console.log('Video data created:', videoData);
        
        // Process thumbnail
        var thumbnailReader = new FileReader();
        thumbnailReader.onload = function(e) {
            console.log('Thumbnail processed');
            var thumbnailDataUrl = e.target.result;
            videoData.thumbnail = thumbnailDataUrl;
            
            // Process video file first
            var videoReader = new FileReader();
            videoReader.onload = function(e) {
                console.log('Video file processed');
                var videoBlob = e.target.result;
                
                // Store video file data
                var videoFiles = JSON.parse(localStorage.getItem('nt_video_files') || '{}');
                videoFiles[videoId] = videoBlob;
                localStorage.setItem('nt_video_files', JSON.stringify(videoFiles));
                console.log('Video file saved with ID:', videoId);
                
                // Check for duplicates before saving
                var userVideos = JSON.parse(localStorage.getItem('nt_user_videos') || '[]');
                var existingVideo = userVideos.find(function(v) { return v.id === videoId; });
                
                if (!existingVideo) {
                    // Save video to user's videos list
                    userVideos.unshift(videoData); // Add to beginning
                    localStorage.setItem('nt_user_videos', JSON.stringify(userVideos));
                    console.log('Saved to user videos:', userVideos.length, 'videos');
                    
                    // Add to global videos list (for index.html)
                    var globalVideos = JSON.parse(localStorage.getItem('nt_global_videos') || '[]');
                    var existingGlobalVideo = globalVideos.find(function(v) { return v.id === videoId; });
                    
                    if (!existingGlobalVideo) {
                        globalVideos.unshift(videoData);
                        localStorage.setItem('nt_global_videos', JSON.stringify(globalVideos));
                        console.log('Saved to global videos:', globalVideos.length, 'videos');
                    }
                    
                    // Trigger storage events for other tabs
                    try {
                        window.dispatchEvent(new StorageEvent('storage', {
                            key: 'nt_user_videos',
                            newValue: JSON.stringify(userVideos)
                        }));
                        
                        window.dispatchEvent(new StorageEvent('storage', {
                            key: 'nt_global_videos',
                            newValue: JSON.stringify(globalVideos)
                        }));
                        console.log('Storage events dispatched');
                    } catch (storageError) {
                        console.log('Storage event error:', storageError);
                    }
                }
                
                // Small delay to ensure localStorage is written
                setTimeout(function() {
                    console.log('Redirecting to me.html');
                    window.location.href = 'me.html';
                }, 100);
            };
            
            videoReader.onerror = function(error) {
                console.error('Video reader error:', error);
                alert('Error processing video file.');
            };
            
            videoReader.readAsDataURL(videoFile);
        };
        
        thumbnailReader.onerror = function(error) {
            console.error('Thumbnail reader error:', error);
            alert('Error processing thumbnail file.');
        };
        
        thumbnailReader.readAsDataURL(thumbnailFile);
        
    } catch (e) {
        console.error('Error uploading video:', e);
        alert('Error uploading video: ' + e.message);
        
        // Re-enable the button if there's an error
        var submitBtn = document.getElementById('upload-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Upload';
        }
    }
}

// Tab functionality (basic, no content switching)
var tabWhat = document.getElementById('nt-tab-what');
var tabFollowing = document.getElementById('nt-tab-following');

if (tabWhat) {
    tabWhat.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

if (tabFollowing) {
    tabFollowing.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// Right-side action buttons
var uploadBtn = document.getElementById('nt-upload-btn');
var settingsBtn = document.getElementById('nt-settings-btn');

if (uploadBtn) {
    uploadBtn.addEventListener('click', function() {
        // Already on upload page
        window.location.reload();
    });
}

if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
        window.location.href = 'settings.html';
    });
}

// Listen for storage changes
window.addEventListener('storage', function(e) {
    if (e.key === 'nt_username' || e.key === 'nt_avatar' || e.key === 'nt_logged_in') {
        setupHeaderUserDisplay();
    }
});