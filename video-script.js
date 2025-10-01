document.addEventListener('DOMContentLoaded', function () {
  // User authentication state
  var isLoggedIn = false;
  var currentUser = '';
  var currentAvatar = '';
  
  try {
    isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
    currentUser = localStorage.getItem('nt_username') || 'me';
    currentAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
  } catch (e) {
    console.log('Error loading user data:', e);
  }

  // Update header with current user info
  var userChip = document.getElementById('nt-user');
  var usernameEl = document.getElementById('nt-username');
  
  if (isLoggedIn && userChip && usernameEl) {
    usernameEl.textContent = currentUser;
    userChip.href = 'me.html';
    userChip.style.display = 'inline-flex';
    
    // Update avatar
    var headerAvatar = document.querySelector('.nt-user__pfp');
    if (headerAvatar) {
      headerAvatar.src = currentAvatar;
    }
    
    // Hide sign in/up buttons
    var signinBtn = document.querySelector('.nt-btn--primary');
    var signupBtn = document.querySelector('.nt-btn--outline');
    if (signinBtn) signinBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
  }
  // Basic header behaviors re-used
  var menuBtn = document.getElementById('nt-menu-btn');
  var sidebar = document.getElementById('nt-sidebar');
  var uploadBtn = document.getElementById('nt-upload-btn');
  var settingsBtn = document.getElementById('nt-settings-btn');
  var isLoggedIn = false;

  function computeSidebarTop() {
    var header = document.querySelector('.nt-header');
    var sub = document.querySelector('.nt-subheader');
    var top = 0;
    if (header) top += header.offsetHeight;
    if (sub) top += sub.offsetHeight;
    document.documentElement.style.setProperty('--sidebar-top', top + 'px');
  }
  computeSidebarTop();
  window.addEventListener('resize', computeSidebarTop);

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function () {
      var isOpen = sidebar.classList.toggle('nt-sidebar--open');
      sidebar.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('sidebar-open', isOpen);
    });
    // open by default
    sidebar.classList.add('nt-sidebar--open');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sidebar-open');
  }

  function navigateOrSignIn(preferred) {
    if (isLoggedIn) { window.location.href = preferred; } else { window.location.href = 'signin.html'; }
  }
  if (uploadBtn) uploadBtn.addEventListener('click', function () { navigateOrSignIn('upload.html'); });
  if (settingsBtn) settingsBtn.addEventListener('click', function () { navigateOrSignIn('settings.html'); });

  var likeBtn = document.getElementById('vt-like');
  var dislikeBtn = document.getElementById('vt-dislike');
  var favBtn = document.getElementById('vt-fav');
  var likeCount = document.getElementById('vt-like-count');
  var dislikeCount = document.getElementById('vt-dislike-count');

  var videoEl = document.getElementById('vt-video');
  var titleEl = document.getElementById('vt-title');
  var descEl = document.getElementById('vt-desc');
  var uploadedEl = document.getElementById('vt-uploaded');
  var suggestedEl = document.getElementById('vt-suggested');
  var uploaderAvatarEl = document.getElementById('vt-uploader-avatar');
  var uploaderNameEl = document.getElementById('vt-uploader-name');
  var uploaderInfoEl = document.querySelector('.vt-uploader-info');
  var userChip = document.getElementById('nt-user');
  var usernameEl = document.getElementById('nt-username');
  var commentBox = document.getElementById('vt-comment');
  var sendBtn = document.getElementById('vt-send');
  var deleteBtn = document.getElementById('vt-delete-btn');
  var threadContainer = document.getElementById('vt-thread');

  var videoMap = {
    '1': { 
      src: 'German.mp4', 
      title: 'Los Peores Trabajos | Hola Soy German', 
      uploaded: 'Uploaded 11 years ago', 
      desc: 'Titan:    • TITÁN - German Garmendia\n\nJuegaGerman:    / juegagerman',
      uploader: {
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png',
        channelId: 'holasoygerman'
      },
      likes: 0,
      dislikes: 0
    },
    '2': { 
      src: 'Me.mp4', 
      title: 'me at the zoo', 
      uploaded: 'Uploaded 20 years ago', 
      desc: 'Microplastics are accumulating in human brains at an alarming rate\n   • Microplastics are accumulating in human br...  \n\n"Nanoplastics and Human Health" with Matthew J Campen, PhD, MSPH\n   • "Nanoplastics and Human Health" with Matth...  \n\n00:00 Intro\n00:05 The cool thing\n00:17 End',
      uploader: {
        name: 'Jawed',
        avatar: 'Channel4-pfp.png',
        channelId: 'jawed'
      },
      likes: 0,
      dislikes: 0
    },
    '3': { 
      src: 'Dross.mp4', 
      title: 'Dross contesta preguntas estupidas 1', 
      uploaded: 'Uploaded 13 years ago', 
      desc: 'Si te gustó el video, por favor, dale pulgar arriba.\n\nAGRÉGAME:\n  / eldiariodedross  \n  / eldiariodedross  \nMi blog (donde están todos mis videos): www.dross.com.ar\nHazle la pregunta que quieras a Dross: www.formspring.me/drossrotzank',
      uploader: {
        name: 'Dross Rotzank',
        avatar: 'Channel6-pfp.png',
        channelId: 'drossrotzank'
      },
      likes: 0,
      dislikes: 0
    },
    '4': {
      src: 'German-Video-2.mp4',
      title: 'Preguntas De twitter | Hola Soy German',
      uploaded: 'Uploaded 10 years ago',
      desc: 'Titan:    • TITÁN - German Garmendia\n\nJuegaGerman:    / juegagerman',
      uploader: {
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png',
        channelId: 'holasoygerman'
      },
      likes: 0,
      dislikes: 0
    },
    '5': {
      src: 'German-Video-3.mp4',
      title: 'Hermanos | Hola Soy German',
      uploaded: 'Uploaded 9 years ago',
      desc: 'Titan:    • TITÁN - German Garmendia\n\nJuegaGerman:    / juegagerman',
      uploader: {
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png',
        channelId: 'holasoygerman'
      },
      likes: 0,
      dislikes: 0
    }
  };

  function loadVideo() {
    var id = null;
    try { id = sessionStorage.getItem('selectedVideoId'); } catch (e) {}
    if (!id) { id = '1'; }
    
    var v = videoMap[id];
    
    // Check if it's a user-uploaded video
    if (!v) {
      // Try to load from user videos
      try {
        var userVideos = JSON.parse(localStorage.getItem('nt_user_videos') || '[]');
        var userVideo = userVideos.find(function(vid) { return vid.id === id; });
        if (userVideo) {
          v = userVideo;
          // Add to videoMap temporarily
          videoMap[id] = v;
          console.log('Loaded user video:', userVideo.title);
        }
      } catch (e) {
        console.log('Error loading user video:', e);
      }
    }
    
    // Also check global videos list
    if (!v) {
      try {
        var globalVideos = JSON.parse(localStorage.getItem('nt_global_videos') || '[]');
        var globalVideo = globalVideos.find(function(vid) { return vid.id === id; });
        if (globalVideo) {
          v = globalVideo;
          videoMap[id] = v;
          console.log('Loaded global video:', globalVideo.title);
        }
      } catch (e) {
        console.log('Error loading global video:', e);
      }
    }
    
    if (!v) {
      // Fallback to default video
      console.log('Video not found, falling back to default');
      id = '1';
      v = videoMap[id];
    }
    
    // Load saved likes/dislikes counts from localStorage
    try {
      var savedCounts = JSON.parse(localStorage.getItem('nt_video_likes') || '{}');
      if (savedCounts[id]) {
        v.likes = savedCounts[id].likes || 0;
        v.dislikes = savedCounts[id].dislikes || 0;
      }
    } catch (e) {
      console.log('Error loading video counts:', e);
    }
    
    if (videoEl) {
      if (v.isUserVideo) {
        // For user videos, try to load from stored file data
        try {
          var videoFiles = JSON.parse(localStorage.getItem('nt_video_files') || '{}');
          if (videoFiles[id]) {
            videoEl.setAttribute('src', videoFiles[id]);
            console.log('Loaded user video with ID:', id);
          } else {
            console.log('User video file not found for ID:', id);
            // Fallback to default video
            videoEl.setAttribute('src', 'sample-video.mp4');
          }
        } catch (e) {
          console.log('Error loading user video:', e);
          videoEl.setAttribute('src', 'sample-video.mp4');
        }
      } else {
        videoEl.setAttribute('src', v.src);
      }
      videoEl.style.margin = '0';
      
      // Set autoplay and loop
      videoEl.setAttribute('autoplay', 'true');
      videoEl.setAttribute('loop', 'true');
      videoEl.muted = true; // Required for autoplay in most browsers
      
      // Try to play the video
      try {
        var playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(function(error) {
            console.log('Autoplay failed:', error);
            // Autoplay failed, unmute and let user click play
            videoEl.muted = false;
          });
        }
      } catch (e) {
        console.log('Play failed:', e);
      }
    }
    if (titleEl) titleEl.textContent = v.title;
    if (uploadedEl) uploadedEl.textContent = v.uploaded;
    if (descEl) descEl.textContent = v.desc;
    
    // Set like/dislike counts
    if (likeCount) likeCount.textContent = String(v.likes || 0);
    if (dislikeCount) dislikeCount.textContent = String(v.dislikes || 0);

    // Show uploader information
    if (v.uploader && uploaderAvatarEl && uploaderNameEl) {
      uploaderAvatarEl.src = v.uploader.avatar;
      uploaderNameEl.textContent = v.uploader.name;
      
      // Add click handler for uploader info
      if (uploaderInfoEl) {
        uploaderInfoEl.style.cursor = 'pointer';
        uploaderInfoEl.onclick = function() {
          window.location.href = 'profile.html?channel=' + v.uploader.channelId;
        };
      }
    }
    
    // Show delete button only for user's own videos
    if (deleteBtn) {
      if (v.isUserVideo && v.uploader && v.uploader.name === currentUser) {
        deleteBtn.style.display = 'block';
        console.log('Showing delete button for user video:', v.title);
      } else {
        deleteBtn.style.display = 'none';
      }
    }

    // Save to watch history if logged in
    if (isLoggedIn && id) {
      saveToWatchHistory(id);
    }

    // suggested (simple mock of other two)
    if (suggestedEl) {
      suggestedEl.innerHTML = '';
      Object.keys(videoMap).filter(function (k) { return k !== id; }).forEach(function (k) {
        var sv = videoMap[k];
        var thumbnailSrc = 'videoimage-' + k + '.png';
        
        // Use specific thumbnails for each German video
        if (k === '4') {
          thumbnailSrc = 'miniatura-german-3.png';
        } else if (k === '5') {
          thumbnailSrc = 'miniatura-german-2.png';
        }
        
        var item = document.createElement('button');
        item.className = 'vt-sg';
        item.innerHTML = '<img class="vt-sg__thumb" src="' + thumbnailSrc + '" alt="' + sv.title + '"><div><div class="vt-sg__title">' + sv.title + '</div><div class="vt-sg__meta">' + sv.uploaded + '</div></div>';
        item.addEventListener('click', function () {
          try { sessionStorage.setItem('selectedVideoId', String(k)); } catch (e) {}
          window.location.reload();
        });
        suggestedEl.appendChild(item);
      });
    }
  }
  // Left sidebar navigation behaviors like index
  var sideButtons = document.querySelectorAll('.nt-sidebtn');
  function setActiveSide(button) {
    sideButtons.forEach(function (b) { b.classList.remove('is-active'); });
    if (button) button.classList.add('is-active');
  }
  sideButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.id;
      setActiveSide(btn);
      if (id === 'sb-home') {
        window.location.href = 'index.html';
      } else if (id === 'sb-channel') {
        if (isLoggedIn) {
          window.location.href = 'me.html';
        } else {
          window.location.href = 'signin.html';
        }
      } else if (id === 'sb-subs') {
        window.location.href = 'subs.html';
      } else if (id === 'sb-history') {
        window.location.href = 'history.html';
      } else if (id === 'sb-liked') {
        if (isLoggedIn) {
          window.location.href = 'liked.html';
        } else {
          window.location.href = 'signin.html';
        }
      }
    });
  });

  var subs = document.querySelectorAll('.nt-sub');
  subs.forEach(function (el) {
    el.addEventListener('click', function () {
      var profileUrl = el.getAttribute('data-profile');
      if (profileUrl) {
        window.location.href = profileUrl;
      }
    });
  });

  var helpSettings = document.getElementById('sb-settings');
  var helpReport = document.getElementById('sb-report');
  var helpHelp = document.getElementById('sb-help');
  var helpAbout = document.getElementById('sb-about');
  var logoutBtn = document.getElementById('sb-logout');
  if (helpSettings) helpSettings.addEventListener('click', function () { window.location.href = 'settings.html'; });
  if (helpReport) helpReport.addEventListener('click', function () { window.location.href = 'report.html'; });
  if (helpHelp) helpHelp.addEventListener('click', function () { window.location.href = 'help.html'; });
  if (helpAbout) helpAbout.addEventListener('click', function () { window.location.href = 'about.html'; });
  
  // Show logout button only when logged in
  if (logoutBtn) {
    if (isLoggedIn) {
      logoutBtn.style.display = 'block';
    } else {
      logoutBtn.style.display = 'none';
    }
    
    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to log out?')) {
        // Clear all user data
        try {
          localStorage.removeItem('nt_logged_in');
          localStorage.removeItem('nt_username');
          localStorage.removeItem('nt_email');
          localStorage.removeItem('nt_avatar');
          localStorage.removeItem('nt_description');
          localStorage.removeItem('nt_banner');
          localStorage.removeItem('nt_subscribers');
          localStorage.removeItem('nt_user_data');
          
          // Trigger storage events for other tabs
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'nt_logged_in',
            newValue: null
          }));
          
          // Redirect to home page
          window.location.href = 'index.html';
        } catch (e) {
          console.log('Error during logout:', e);
          // Fallback: just reload the page
          window.location.reload();
        }
      }
    });
  }

  loadVideo();
  
  // Function to delete video
  function deleteVideo(videoId) {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }
    
    try {
      console.log('Deleting video with ID:', videoId);
      
      // Remove from user videos
      var userVideos = JSON.parse(localStorage.getItem('nt_user_videos') || '[]');
      userVideos = userVideos.filter(function(video) {
        return video.id !== videoId;
      });
      localStorage.setItem('nt_user_videos', JSON.stringify(userVideos));
      console.log('Removed from user videos, remaining:', userVideos.length);
      
      // Remove from global videos
      var globalVideos = JSON.parse(localStorage.getItem('nt_global_videos') || '[]');
      globalVideos = globalVideos.filter(function(video) {
        return video.id !== videoId;
      });
      localStorage.setItem('nt_global_videos', JSON.stringify(globalVideos));
      console.log('Removed from global videos, remaining:', globalVideos.length);
      
      // Remove video file
      var videoFiles = JSON.parse(localStorage.getItem('nt_video_files') || '{}');
      if (videoFiles[videoId]) {
        delete videoFiles[videoId];
        localStorage.setItem('nt_video_files', JSON.stringify(videoFiles));
        console.log('Removed video file');
      }
      
      // Remove from video likes if exists
      var videoLikes = JSON.parse(localStorage.getItem('nt_video_likes') || '{}');
      if (videoLikes[videoId]) {
        delete videoLikes[videoId];
        localStorage.setItem('nt_video_likes', JSON.stringify(videoLikes));
      }
      
      // Remove from liked videos if exists
      var likedVideos = JSON.parse(localStorage.getItem('nt_liked_videos') || '[]');
      likedVideos = likedVideos.filter(function(id) {
        return id !== videoId;
      });
      localStorage.setItem('nt_liked_videos', JSON.stringify(likedVideos));
      
      // Remove from watch history if exists
      var watchHistory = JSON.parse(localStorage.getItem('nt_watch_history') || '[]');
      watchHistory = watchHistory.filter(function(entry) {
        return entry.videoId !== videoId;
      });
      localStorage.setItem('nt_watch_history', JSON.stringify(watchHistory));
      
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
      
      alert('Video deleted successfully!');
      
      // Redirect to user's channel
      window.location.href = 'me.html';
      
    } catch (e) {
      console.error('Error deleting video:', e);
      alert('Error deleting video: ' + e.message);
    }
  }
  
  // Delete button event listener
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      var currentVideoId = null;
      try {
        currentVideoId = sessionStorage.getItem('selectedVideoId');
      } catch (e) {}
      
      if (currentVideoId) {
        deleteVideo(currentVideoId);
      } else {
        alert('No video selected for deletion.');
      }
    });
  }

  // reflect logged-in state
  var isLoggedIn = false;
  try { isLoggedIn = localStorage.getItem('nt_logged_in') === '1'; } catch (e) {}
  var savedName = '';
  try { savedName = localStorage.getItem('nt_username') || ''; } catch (e) {}
  if (isLoggedIn && userChip) {
    if (usernameEl) usernameEl.textContent = savedName || 'me';
    userChip.href = 'me.html';
    userChip.style.display = 'inline-flex';
    var signinBtn = document.querySelector('.nt-btn--primary');
    var signupBtn = document.querySelector('.nt-btn--outline');
    if (signinBtn) signinBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
  }

  if (isLoggedIn) {
    if (commentBox) commentBox.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
  }
  
  // Load and display comments for current video
  loadVideoComments();
  
  // Send comment functionality
  if (sendBtn && commentBox) {
    sendBtn.addEventListener('click', function() {
      if (!isLoggedIn) {
        window.location.href = 'signin.html';
        return;
      }
      
      var commentText = commentBox.value.trim();
      if (!commentText) {
        alert('Please enter a comment.');
        return;
      }
      
      var currentVideoId = null;
      try {
        currentVideoId = sessionStorage.getItem('selectedVideoId');
      } catch (e) {}
      
      if (!currentVideoId) {
        alert('No video selected.');
        return;
      }
      
      addComment(currentVideoId, commentText);
      commentBox.value = ''; // Clear the input
    });
  }
  
  // Function to load comments for current video
  function loadVideoComments() {
    var currentVideoId = null;
    try {
      currentVideoId = sessionStorage.getItem('selectedVideoId');
    } catch (e) {}
    
    if (!currentVideoId || !threadContainer) return;
    
    try {
      var allComments = JSON.parse(localStorage.getItem('nt_video_comments') || '{}');
      var videoComments = allComments[currentVideoId] || [];
      
      // Clear existing comments
      threadContainer.innerHTML = '';
      
      // Sort comments by newest first
      videoComments.sort(function(a, b) {
        return b.timestamp - a.timestamp;
      });
      
      // Display each comment
      videoComments.forEach(function(comment) {
        var commentEl = createCommentElement(comment, currentVideoId);
        threadContainer.appendChild(commentEl);
      });
      
    } catch (e) {
      console.log('Error loading comments:', e);
    }
  }
  
  // Function to add a new comment
  function addComment(videoId, text) {
    try {
      var comment = {
        id: 'comment_' + Date.now(),
        author: currentUser,
        avatar: currentAvatar,
        text: text,
        timestamp: Date.now()
      };
      
      var allComments = JSON.parse(localStorage.getItem('nt_video_comments') || '{}');
      if (!allComments[videoId]) {
        allComments[videoId] = [];
      }
      
      allComments[videoId].unshift(comment); // Add to beginning
      localStorage.setItem('nt_video_comments', JSON.stringify(allComments));
      
      // Reload comments to show the new one
      loadVideoComments();
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'nt_video_comments',
        newValue: JSON.stringify(allComments)
      }));
      
    } catch (e) {
      console.log('Error adding comment:', e);
      alert('Error adding comment.');
    }
  }
  
  // Function to create comment HTML element
  function createCommentElement(comment, videoId) {
    var commentEl = document.createElement('div');
    commentEl.className = 'vt-post';
    commentEl.setAttribute('data-comment-id', comment.id);
    
    var timeAgo = getCommentTimeAgo(comment.timestamp);
    var isOwnComment = comment.author === currentUser;
    
    var deleteButtonHtml = '';
    if (isOwnComment) {
      deleteButtonHtml = 
        '<button class="vt-comment-delete" data-comment-id="' + comment.id + '" data-video-id="' + videoId + '">' +
          '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#FF0000" d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>';
    }
    
    commentEl.innerHTML = 
      '<div class="vt-post__header">' +
        '<div class="vt-post__meta">' +
          '<img class="vt-post__pfp" src="' + comment.avatar + '" alt="' + comment.author + '">' +
          '<span class="vt-post__author">' + comment.author + '</span>' +
          '<span class="vt-post__time">' + timeAgo + '</span>' +
        '</div>' +
        deleteButtonHtml +
      '</div>' +
      '<div class="vt-post__body">' + comment.text + '</div>' +
      '<div class="vt-post__actions">' +
        '<button class="vt-comment-action vt-comment-like">' +
          '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14 1 7.59 7.41C7.22 7.78 7 8.3 7 8.86V19c0 1.1.9 2 2 2h7c.82 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>' +
          '<span>0</span>' +
        '</button>' +
        '<button class="vt-comment-action vt-comment-dislike">' +
          '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M1 3h4v12H1V3zm22 8c0 1.1-.9 2-2 2h-6.31l.95 4.57.03.32c0 .41-.17.79-.44 1.06L14 23 7.59 16.59C7.22 16.22 7 15.7 7 15.14V5c0-1.1.9-2 2-2h7c.82 0 1.54.5 1.84 1.22l3.02 7.05c.09.23.14.47.14.73v2z"/></svg>' +
          '<span>0</span>' +
        '</button>' +
      '</div>';
    
    // Add delete functionality for own comments
    if (isOwnComment) {
      var deleteBtn = commentEl.querySelector('.vt-comment-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this comment?')) {
            deleteComment(videoId, comment.id);
          }
        });
      }
    }
    
    // Add like/dislike functionality
    var likeBtn = commentEl.querySelector('.vt-comment-like');
    var dislikeBtn = commentEl.querySelector('.vt-comment-dislike');
    
    if (likeBtn) {
      likeBtn.addEventListener('click', function() {
        if (!isLoggedIn) {
          window.location.href = 'signin.html';
          return;
        }
        
        var isLiked = likeBtn.classList.contains('is-active');
        var likeCount = parseInt(likeBtn.querySelector('span').textContent) || 0;
        
        if (isLiked) {
          // Unlike
          likeBtn.classList.remove('is-active');
          likeCount = Math.max(0, likeCount - 1);
        } else {
          // Like
          likeBtn.classList.add('is-active');
          likeCount += 1;
          
          // Remove dislike if active
          if (dislikeBtn && dislikeBtn.classList.contains('is-active')) {
            dislikeBtn.classList.remove('is-active');
            var dislikeCount = Math.max(0, parseInt(dislikeBtn.querySelector('span').textContent) - 1);
            dislikeBtn.querySelector('span').textContent = dislikeCount;
          }
        }
        
        likeBtn.querySelector('span').textContent = likeCount;
      });
    }
    
    if (dislikeBtn) {
      dislikeBtn.addEventListener('click', function() {
        if (!isLoggedIn) {
          window.location.href = 'signin.html';
          return;
        }
        
        var isDisliked = dislikeBtn.classList.contains('is-active');
        var dislikeCount = parseInt(dislikeBtn.querySelector('span').textContent) || 0;
        
        if (isDisliked) {
          // Undislike
          dislikeBtn.classList.remove('is-active');
          dislikeCount = Math.max(0, dislikeCount - 1);
        } else {
          // Dislike
          dislikeBtn.classList.add('is-active');
          dislikeCount += 1;
          
          // Remove like if active
          if (likeBtn && likeBtn.classList.contains('is-active')) {
            likeBtn.classList.remove('is-active');
            var likeCount = Math.max(0, parseInt(likeBtn.querySelector('span').textContent) - 1);
            likeBtn.querySelector('span').textContent = likeCount;
          }
        }
        
        dislikeBtn.querySelector('span').textContent = dislikeCount;
      });
    }
    
    return commentEl;
  }
  
  // Function to delete a comment
  function deleteComment(videoId, commentId) {
    try {
      var allComments = JSON.parse(localStorage.getItem('nt_video_comments') || '{}');
      if (allComments[videoId]) {
        allComments[videoId] = allComments[videoId].filter(function(comment) {
          return comment.id !== commentId;
        });
        
        localStorage.setItem('nt_video_comments', JSON.stringify(allComments));
        loadVideoComments(); // Reload to show updated list
        
        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'nt_video_comments',
          newValue: JSON.stringify(allComments)
        }));
      }
    } catch (e) {
      console.log('Error deleting comment:', e);
    }
  }
  
  // Function to format comment timestamp
  function getCommentTimeAgo(timestamp) {
    var now = Date.now();
    var diff = now - timestamp;
    
    var seconds = Math.floor(diff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30);
    var years = Math.floor(days / 365);
    
    if (years > 0) {
      return years + ' year' + (years === 1 ? '' : 's') + ' ago';
    } else if (months > 0) {
      return months + ' month' + (months === 1 ? '' : 's') + ' ago';
    } else if (days > 0) {
      return days + ' day' + (days === 1 ? '' : 's') + ' ago';
    } else if (hours > 0) {
      return hours + ' hour' + (hours === 1 ? '' : 's') + ' ago';
    } else if (minutes > 0) {
      return minutes + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
    } else {
      return 'just now';
    }
  }

  function setActive(btn, active) {
    if (!btn) return;
    if (active) btn.classList.add('is-active'); else btn.classList.remove('is-active');
  }

  var liked = false;
  var disliked = false;
  var currentVideoId = null;
  var likedVideos = [];
  
  // Load current video ID and liked videos
  try { 
    currentVideoId = sessionStorage.getItem('selectedVideoId');
    likedVideos = JSON.parse(localStorage.getItem('nt_liked_videos') || '[]');
    if (currentVideoId && likedVideos.includes(currentVideoId)) {
      liked = true;
    }
  } catch (e) {}
  
  // Function to save video likes/dislikes counts
  function saveVideoCounts(videoId, likes, dislikes) {
    try {
      var savedCounts = JSON.parse(localStorage.getItem('nt_video_likes') || '{}');
      savedCounts[videoId] = { likes: likes, dislikes: dislikes };
      localStorage.setItem('nt_video_likes', JSON.stringify(savedCounts));
    } catch (e) {
      console.log('Error saving video counts:', e);
    }
  }
  
  if (likeBtn) {
    // Set initial state
    setActive(likeBtn, liked);
    
    likeBtn.addEventListener('click', function () {
      if (!isLoggedIn) {
        window.location.href = 'signin.html';
        return;
      }
      
      liked = !liked;
      var currentVideo = videoMap[currentVideoId];
      if (currentVideo) {
        if (liked) {
          currentVideo.likes = (currentVideo.likes || 0) + 1;
        } else {
          currentVideo.likes = Math.max(0, (currentVideo.likes || 0) - 1);
        }
        likeCount.textContent = String(currentVideo.likes);
        
        // Save to localStorage
        saveVideoCounts(currentVideoId, currentVideo.likes, currentVideo.dislikes || 0);
      }
      
      setActive(likeBtn, liked);
      
      // Save to liked videos
      if (currentVideoId) {
        if (liked && !likedVideos.includes(currentVideoId)) {
          likedVideos.push(currentVideoId);
        } else if (!liked && likedVideos.includes(currentVideoId)) {
          likedVideos = likedVideos.filter(function(id) { return id !== currentVideoId; });
        }
        
        try {
          localStorage.setItem('nt_liked_videos', JSON.stringify(likedVideos));
          // Trigger storage event for other tabs/windows
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'nt_liked_videos',
            newValue: JSON.stringify(likedVideos),
            url: window.location.href
          }));
        } catch (e) {
          console.log('Error saving liked videos:', e);
        }
      }
      
      if (liked && disliked) {
        // undo dislike
        disliked = false;
        setActive(dislikeBtn, false);
        if (currentVideo) {
          currentVideo.dislikes = Math.max(0, (currentVideo.dislikes || 0) - 1);
          dislikeCount.textContent = String(currentVideo.dislikes);
          saveVideoCounts(currentVideoId, currentVideo.likes, currentVideo.dislikes);
        }
      }
    });
  }
  if (dislikeBtn) {
    dislikeBtn.addEventListener('click', function () {
      if (!isLoggedIn) {
        window.location.href = 'signin.html';
        return;
      }
      
      disliked = !disliked;
      var currentVideo = videoMap[currentVideoId];
      if (currentVideo) {
        if (disliked) {
          currentVideo.dislikes = (currentVideo.dislikes || 0) + 1;
        } else {
          currentVideo.dislikes = Math.max(0, (currentVideo.dislikes || 0) - 1);
        }
        dislikeCount.textContent = String(currentVideo.dislikes);
        
        // Save to localStorage
        saveVideoCounts(currentVideoId, currentVideo.likes || 0, currentVideo.dislikes);
      }
      
      setActive(dislikeBtn, disliked);
      
      if (disliked && liked) {
        // undo like
        liked = false;
        setActive(likeBtn, false);
        if (currentVideo) {
          currentVideo.likes = Math.max(0, (currentVideo.likes || 0) - 1);
          likeCount.textContent = String(currentVideo.likes);
          saveVideoCounts(currentVideoId, currentVideo.likes, currentVideo.dislikes);
        }
        
        // Remove from liked videos
        if (currentVideoId && likedVideos.includes(currentVideoId)) {
          likedVideos = likedVideos.filter(function(id) { return id !== currentVideoId; });
          try {
            localStorage.setItem('nt_liked_videos', JSON.stringify(likedVideos));
          } catch (e) {}
        }
      }
    });
  }

  if (favBtn) {
    favBtn.addEventListener('click', function () {
      // Focus-only behavior per spec; no-op for data
      setActive(favBtn, true);
      setTimeout(function () { setActive(favBtn, false); }, 150);
    });
  }

  // Comments are disabled when not logged in per spec

  // Function to save video to watch history
  function saveToWatchHistory(videoId) {
    try {
      var watchHistory = JSON.parse(localStorage.getItem('nt_watch_history') || '[]');
      
      // Remove previous entry of this video if exists
      watchHistory = watchHistory.filter(function(entry) {
        return entry.videoId !== videoId;
      });
      
      // Add new entry at the beginning (most recent)
      watchHistory.unshift({
        videoId: videoId,
        watchedAt: new Date().getTime()
      });
      
      // Keep only last 50 videos
      if (watchHistory.length > 50) {
        watchHistory = watchHistory.slice(0, 50);
      }
      
      localStorage.setItem('nt_watch_history', JSON.stringify(watchHistory));
      
      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'nt_watch_history',
        newValue: JSON.stringify(watchHistory),
        url: window.location.href
      }));
    } catch (e) {
      console.log('Error saving watch history:', e);
    }
  }

  // Listen for localStorage changes from other tabs/windows
  window.addEventListener('storage', function (e) {
    if (e.key === 'nt_avatar' && e.newValue) {
      var headerAvatar = document.querySelector('.nt-user__pfp');
      if (headerAvatar) headerAvatar.src = e.newValue;
      
      // Update uploader avatar if it's the current user's video
      var currentVideoId = null;
      try { currentVideoId = sessionStorage.getItem('selectedVideoId'); } catch (e) {}
      if (currentVideoId && videoMap[currentVideoId] && videoMap[currentVideoId].uploader) {
        var currentUploader = videoMap[currentVideoId].uploader;
        var savedUser = '';
        try { savedUser = localStorage.getItem('nt_username') || ''; } catch (ex) {}
        if (currentUploader.name === savedUser && uploaderAvatarEl) {
          uploaderAvatarEl.src = e.newValue;
        }
      }
    }
    if (e.key === 'nt_username' && e.newValue) {
      var usernameEl = document.getElementById('nt-username');
      if (usernameEl) usernameEl.textContent = e.newValue;
      
      // Update uploader name if it's the current user's video
      var currentVideoId = null;
      try { currentVideoId = sessionStorage.getItem('selectedVideoId'); } catch (e) {}
      if (currentVideoId && videoMap[currentVideoId] && videoMap[currentVideoId].uploader) {
        var currentUploader = videoMap[currentVideoId].uploader;
        var oldUser = currentUploader.name;
        try {
          var savedUser = localStorage.getItem('nt_username') || '';
          if (oldUser === savedUser && uploaderNameEl) {
            uploaderNameEl.textContent = e.newValue;
          }
        } catch (ex) {}
      }
    }
  });
});

