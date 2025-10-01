document.addEventListener('DOMContentLoaded', function () {
  var searchForm = document.getElementById('nt-search-form');
  var searchInput = document.getElementById('nt-search-input');
  var menuBtn = document.getElementById('nt-menu-btn');
  var sidebar = document.getElementById('nt-sidebar');
  var uploadBtn = document.getElementById('nt-upload-btn');
  var settingsBtn = document.getElementById('nt-settings-btn');
  var sideButtons = document.querySelectorAll('.nt-sidebtn');
  var subs = document.querySelectorAll('.nt-sub');
  var helpSettings = document.getElementById('sb-settings');
  var helpReport = document.getElementById('sb-report');
  var helpHelp = document.getElementById('sb-help');
  var helpAbout = document.getElementById('sb-about');
  var userChip = document.getElementById('nt-user');
  var usernameEl = document.getElementById('nt-username');

  // Liked videos specific elements
  var likedVideosContainer = document.getElementById('liked-videos-container');
  var noLikedVideosEl = document.getElementById('liked-no-videos');

  // User data
  var isLoggedIn = false;
  var currentUser = '';
  var currentAvatar = '';
  var likedVideos = [];

  try {
    isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
    currentUser = localStorage.getItem('nt_username') || '';
    currentAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
    likedVideos = JSON.parse(localStorage.getItem('nt_liked_videos') || '[]');
  } catch (e) {
    console.log('Error loading user data:', e);
  }

  // Show logged in user in header or redirect to sign in
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
    // Not logged in, redirect to sign in
    window.location.href = 'signin.html';
    return;
  }

  // Video database (same as in video-script.js)
  var videoMap = {
    '1': { 
      title: 'Los Peores Trabajos | Hola Soy German', 
      thumbnail: 'videoimage-1.png',
      uploaded: 'Uploaded 11 years ago',
      uploader: {
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png'
      }
    },
    '2': { 
      title: 'me at the zoo', 
      thumbnail: 'videoimage-2.png',
      uploaded: 'Uploaded 20 years ago',
      uploader: {
        name: 'Jawed',
        avatar: 'Channel4-pfp.png'
      }
    },
    '3': { 
      title: 'Dross contesta preguntas estupidas 1', 
      thumbnail: 'videoimage-3.png',
      uploaded: 'Uploaded 13 years ago',
      uploader: {
        name: 'Dross Rotzank',
        avatar: 'Channel6-pfp.png'
      }
    },
    '4': {
      title: 'Preguntas De twitter | Hola Soy German',
      thumbnail: 'miniatura-german-3.png',
      uploaded: 'Uploaded 10 years ago',
      uploader: {
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png'
      }
    },
    '5': {
      title: 'Hermanos | Hola Soy German',
      thumbnail: 'miniatura-german-2.png',
      uploaded: 'Uploaded 9 years ago',
      uploader: {
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png'
      }
    }
  };

  // Display liked videos
  displayLikedVideos();

  function displayLikedVideos() {
    if (!likedVideosContainer || !noLikedVideosEl) return;

    if (likedVideos.length === 0) {
      likedVideosContainer.style.display = 'none';
      noLikedVideosEl.style.display = 'flex';
    } else {
      likedVideosContainer.style.display = 'grid';
      noLikedVideosEl.style.display = 'none';
      document.body.classList.add('has-liked-videos');

      // Clear existing videos
      likedVideosContainer.innerHTML = '';

      // Add liked videos
      likedVideos.forEach(function (videoId) {
        var video = getVideoInfo(videoId);
        if (video) {
          var videoEl = document.createElement('button');
          videoEl.className = 'nt-video';
          videoEl.setAttribute('data-target', 'video.html');
          videoEl.setAttribute('data-video-id', videoId);
          
          videoEl.innerHTML = 
            '<img class="nt-video__thumb" src="' + video.thumbnail + '" alt="' + video.title + '">' +
            '<div class="nt-video__body">' +
              '<div class="nt-video__title">' + video.title + '</div>' +
              '<div class="nt-video__bottom">' +
                '<div class="nt-video__meta">' +
                  '<img class="nt-video__pfp" src="' + video.uploader.avatar + '" alt="' + video.uploader.name + '">' +
                  '<span class="nt-video__uploader">' + video.uploader.name + '</span>' +
                '</div>' +
                '<div class="nt-video__time">' + video.uploaded + '</div>' +
              '</div>' +
            '</div>';

          videoEl.addEventListener('click', function () {
            try {
              sessionStorage.setItem('selectedVideoId', videoId);
            } catch (e) {}
            window.location.href = 'video.html';
          });

          likedVideosContainer.appendChild(videoEl);
        }
      });
    }
  }

  // Search form functionality
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var query = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
      var target = 'results.html';
      if (query) {
        var params = new URLSearchParams();
        params.set('q', query);
        target += '?' + params.toString();
      }
      window.location.href = target;
    });
  }

  // Sidebar toggle
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

  // Right-side action buttons
  if (uploadBtn) {
    uploadBtn.addEventListener('click', function () {
      window.location.href = 'upload.html';
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', function () {
      window.location.href = 'settings.html';
    });
  }

  // Compute sidebar top
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

  // Sidebar buttons navigation
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
        window.location.href = 'me.html';
      } else if (id === 'sb-subs') {
        window.location.href = 'subs.html';
      } else if (id === 'sb-history') {
        window.location.href = 'history.html';
      } else if (id === 'sb-liked') {
        // Already on liked page
      }
    });
  });

  // Subscriptions list navigation
  subs.forEach(function (el) {
    el.addEventListener('click', function () {
      var profileUrl = el.getAttribute('data-profile');
      if (profileUrl) {
        window.location.href = profileUrl;
      }
    });
  });

  // Help section navigation
  if (helpSettings) helpSettings.addEventListener('click', function () { window.location.href = 'settings.html'; });
  if (helpReport) helpReport.addEventListener('click', function () { window.location.href = 'report.html'; });
  if (helpHelp) helpHelp.addEventListener('click', function () { window.location.href = 'help.html'; });
  if (helpAbout) helpAbout.addEventListener('click', function () { window.location.href = 'about.html'; });
  
  // Logout functionality
  var logoutBtn = document.getElementById('sb-logout');
  if (logoutBtn) {
    if (isLoggedIn) {
      logoutBtn.style.display = 'block';
    } else {
      logoutBtn.style.display = 'none';
    }
    
    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to log out?')) {
        try {
          localStorage.removeItem('nt_logged_in');
          localStorage.removeItem('nt_username');
          localStorage.removeItem('nt_email');
          localStorage.removeItem('nt_avatar');
          localStorage.removeItem('nt_description');
          localStorage.removeItem('nt_banner');
          localStorage.removeItem('nt_subscribers');
          localStorage.removeItem('nt_user_data');
          
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'nt_logged_in',
            newValue: null
          }));
          
          window.location.href = 'index.html';
        } catch (e) {
          console.log('Error during logout:', e);
          window.location.reload();
        }
      }
    });
  }

  // Listen for localStorage changes from other tabs/windows
  window.addEventListener('storage', function (e) {
    if (e.key === 'nt_avatar' && e.newValue) {
      var headerAvatar = document.querySelector('.nt-user__pfp');
      if (headerAvatar) headerAvatar.src = e.newValue;
    }
    if (e.key === 'nt_username' && e.newValue) {
      if (usernameEl) usernameEl.textContent = e.newValue;
    }
    if (e.key === 'nt_liked_videos' && e.newValue) {
      try {
        likedVideos = JSON.parse(e.newValue);
        displayLikedVideos();
      } catch (ex) {}
    }
  });

  // Get video info from all sources (default videos, user videos, global videos)
  function getVideoInfo(videoId) {
    // Check default videos first
    if (videoMap[videoId]) {
      return videoMap[videoId];
    }
    
    // Check user videos
    try {
      var userVideos = JSON.parse(localStorage.getItem('nt_user_videos') || '[]');
      var userVideo = userVideos.find(function(v) { return v.id === videoId; });
      if (userVideo) {
        return {
          title: userVideo.title,
          thumbnail: userVideo.thumbnail || 'default-thumb.png',
          uploaded: userVideo.uploaded || 'Recently uploaded',
          uploader: userVideo.uploader || { name: 'Unknown', avatar: 'Default-pfp.png' }
        };
      }
    } catch (e) {}
    
    // Check global videos
    try {
      var globalVideos = JSON.parse(localStorage.getItem('nt_global_videos') || '[]');
      var globalVideo = globalVideos.find(function(v) { return v.id === videoId; });
      if (globalVideo) {
        return {
          title: globalVideo.title,
          thumbnail: globalVideo.thumbnail || 'default-thumb.png',
          uploaded: globalVideo.uploaded || 'Recently uploaded',
          uploader: globalVideo.uploader || { name: 'Unknown', avatar: 'Default-pfp.png' }
        };
      }
    } catch (e) {}
    
    return null;
  }
});