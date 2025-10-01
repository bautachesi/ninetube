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

  // Profile specific elements
  var editBtn = document.getElementById('me-edit-btn');
  var descriptionText = document.getElementById('me-description-text');
  var bannerEl = document.getElementById('me-banner');
  var bannerInput = document.getElementById('me-banner-input');
  var avatarEl = document.getElementById('me-avatar');
  var avatarImg = document.getElementById('me-avatar-img');
  var avatarInput = document.getElementById('me-avatar-input');
  var meUsernameEl = document.getElementById('me-username');
  var subscribersEl = document.getElementById('me-subscribers');
  var videosContainer = document.getElementById('me-videos-container');
  var noVideosEl = document.getElementById('me-no-videos');
  var meUploadBtn = document.getElementById('me-upload-btn');

  // Load user data from localStorage
  var isLoggedIn = false;
  var savedName = '';
  var savedDescription = '';
  var savedAvatar = '';
  var savedBanner = '';
  var savedSubscribers = 0;
  var userVideos = [];

  try {
    isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
    savedName = localStorage.getItem('nt_username') || 'me';
    savedDescription = localStorage.getItem('nt_description') || '¡Hello! im using ninetube.com for upload videos and make friends!';
    savedAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
    savedBanner = localStorage.getItem('nt_banner') || 'profile-banner.png';
    savedSubscribers = parseInt(localStorage.getItem('nt_subscribers') || '0');
    userVideos = JSON.parse(localStorage.getItem('nt_user_videos') || '[]');
  } catch (e) {
    console.log('Error loading user data:', e);
  }

  // Initialize profile data
  if (usernameEl) usernameEl.textContent = savedName;
  if (meUsernameEl) meUsernameEl.textContent = savedName;
  if (subscribersEl) subscribersEl.textContent = savedSubscribers + ' Subscribers';
  if (descriptionText) descriptionText.value = savedDescription;
  if (avatarImg) avatarImg.src = savedAvatar;
  if (bannerEl) bannerEl.style.backgroundImage = 'url(' + savedBanner + ')';

  // Initialize header avatar
  var headerAvatar = document.querySelector('.nt-user__pfp');
  if (headerAvatar) {
    headerAvatar.src = savedAvatar;
  }

  // Show user in header if logged in
  if (isLoggedIn && userChip) {
    userChip.href = 'me.html';
    userChip.style.display = 'inline-flex';
    
    var signinBtn = document.querySelector('.nt-btn--primary');
    var signupBtn = document.querySelector('.nt-btn--outline');
    if (signinBtn) signinBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
  }

  // Show user videos or no videos message
  displayUserVideos();

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

  // Compute sidebar top to be below subheader
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
        // Already on channel page
      } else if (id === 'sb-subs') {
        window.location.href = 'subs.html';
      } else if (id === 'sb-history') {
        window.location.href = 'history.html';
      } else if (id === 'sb-liked') {
        window.location.href = 'liked.html';
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

  // Edit channel functionality
  var isEditing = false;

  if (editBtn) {
    editBtn.addEventListener('click', function () {
      if (!isEditing) {
        // Start editing
        isEditing = true;
        editBtn.textContent = 'Save Changes';
        descriptionText.removeAttribute('readonly');
        descriptionText.focus();
        
        // Make banner and avatar editable
        bannerEl.classList.add('editable');
        avatarEl.classList.add('editable');
      } else {
        // Save changes
        isEditing = false;
        editBtn.textContent = 'Edit Channel';
        descriptionText.setAttribute('readonly', 'readonly');
        
        // Remove editable state
        bannerEl.classList.remove('editable');
        avatarEl.classList.remove('editable');
        
        // Save description and username to localStorage
        var newDescription = descriptionText.value;
        var newUsername = meUsernameEl.textContent;
        try {
          localStorage.setItem('nt_description', newDescription);
          localStorage.setItem('nt_username', newUsername);
          
          // Update header username immediately
          if (usernameEl) {
            usernameEl.textContent = newUsername;
          }
          
          // Trigger storage events for other tabs/windows
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'nt_description',
            newValue: newDescription,
            url: window.location.href
          }));
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'nt_username',
            newValue: newUsername,
            url: window.location.href
          }));
        } catch (e) {
          console.log('Error saving data:', e);
        }
      }
    });
  }

  // Banner image upload (only when editing)
  if (bannerEl && bannerInput) {
    bannerEl.addEventListener('click', function () {
      if (isEditing) {
        bannerInput.click();
      }
    });

    bannerInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var imageData = event.target.result;
          bannerEl.style.backgroundImage = 'url(' + imageData + ')';
          
          // Save to localStorage
          try {
            localStorage.setItem('nt_banner', imageData);
            // Trigger storage event for other tabs/windows
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'nt_banner',
              newValue: imageData,
              url: window.location.href
            }));
          } catch (e) {
            console.log('Error saving banner:', e);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Avatar image upload (only when editing)
  if (avatarEl && avatarInput) {
    avatarEl.addEventListener('click', function () {
      if (isEditing) {
        avatarInput.click();
      }
    });

    avatarInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var imageData = event.target.result;
          avatarImg.src = imageData;
          
          // Update header avatar immediately
          var headerAvatar = document.querySelector('.nt-user__pfp');
          if (headerAvatar) {
            headerAvatar.src = imageData;
          }
          
          // Save to localStorage
          try {
            localStorage.setItem('nt_avatar', imageData);
            // Trigger storage event for other tabs/windows
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'nt_avatar',
              newValue: imageData,
              url: window.location.href
            }));
          } catch (e) {
            console.log('Error saving avatar:', e);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Upload videos button
  if (meUploadBtn) {
    meUploadBtn.addEventListener('click', function () {
      window.location.href = 'upload.html';
    });
  }

  // Function to display user videos
  function displayUserVideos() {
    if (!videosContainer || !noVideosEl) return;

    // Load user videos from localStorage (including uploaded ones)
    try {
      userVideos = JSON.parse(localStorage.getItem('nt_user_videos') || '[]');
    } catch (e) {
      console.log('Error loading user videos:', e);
      userVideos = [];
    }

    if (userVideos.length === 0) {
      videosContainer.style.display = 'none';
      noVideosEl.style.display = 'flex';
    } else {
      videosContainer.style.display = 'grid';
      noVideosEl.style.display = 'none';
      document.body.classList.add('has-videos');

      // Clear existing videos
      videosContainer.innerHTML = '';

      // Add user videos
      userVideos.forEach(function (video) {
        var videoEl = document.createElement('button');
        videoEl.className = 'nt-video';
        videoEl.setAttribute('data-target', 'video.html');
        videoEl.setAttribute('data-video-id', video.id);
        
        videoEl.innerHTML = 
          '<img class="nt-video__thumb" src="' + (video.thumbnail || 'default-thumb.png') + '" alt="' + video.title + '">' +
          '<div class="nt-video__body">' +
            '<div class="nt-video__title">' + video.title + '</div>' +
            '<div class="nt-video__bottom">' +
              '<div class="nt-video__meta">' +
                '<img class="nt-video__pfp" src="' + (video.uploader ? video.uploader.avatar : savedAvatar) + '" alt="' + (video.uploader ? video.uploader.name : savedName) + '">' +
                '<span class="nt-video__uploader">' + (video.uploader ? video.uploader.name : savedName) + '</span>' +
              '</div>' +
              '<div class="nt-video__time">' + (video.uploaded || 'Recently uploaded') + '</div>' +
            '</div>' +
          '</div>';

        videoEl.addEventListener('click', function () {
          try {
            sessionStorage.setItem('selectedVideoId', video.id);
          } catch (e) {}
          window.location.href = 'video.html';
        });

        videosContainer.appendChild(videoEl);
      });
    }
  }

  // Function to update user videos with new avatar/name
  function updateUserVideosDisplay() {
    if (userVideos.length > 0) {
      // Re-render videos with updated avatar and name
      displayUserVideos();
    }
  }

  // Listen for localStorage changes from other tabs/windows
  window.addEventListener('storage', function (e) {
    if (e.key === 'nt_avatar' && e.newValue) {
      savedAvatar = e.newValue;
      if (avatarImg) avatarImg.src = e.newValue;
      var headerAvatar = document.querySelector('.nt-user__pfp');
      if (headerAvatar) headerAvatar.src = e.newValue;
      updateUserVideosDisplay();
    }
    if (e.key === 'nt_banner' && e.newValue) {
      if (bannerEl) bannerEl.style.backgroundImage = 'url(' + e.newValue + ')';
    }
    if (e.key === 'nt_username' && e.newValue) {
      savedName = e.newValue;
      if (meUsernameEl) meUsernameEl.textContent = e.newValue;
      if (usernameEl) usernameEl.textContent = e.newValue;
      updateUserVideosDisplay();
    }
    if (e.key === 'nt_description' && e.newValue) {
      if (descriptionText) descriptionText.value = e.newValue;
    }
    if (e.key === 'nt_user_videos') {
      displayUserVideos();
    }
  });
  
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
});