document.addEventListener('DOMContentLoaded', function () {
  var searchForm = document.getElementById('nt-search-form');
  var searchInput = document.getElementById('nt-search-input');
  var menuBtn = document.getElementById('nt-menu-btn');
  var sidebar = document.getElementById('nt-sidebar');
  var tabWhat = document.getElementById('nt-tab-what');
  var tabFollowing = document.getElementById('nt-tab-following');
  var sectionWhat = document.getElementById('nt-section-what');
  var sectionFollowing = document.getElementById('nt-section-following');
  var uploadBtn = document.getElementById('nt-upload-btn');
  var settingsBtn = document.getElementById('nt-settings-btn');
  var sideButtons = document.querySelectorAll('.nt-sidebtn');
  var subs = document.querySelectorAll('.nt-sub');
  var helpSettings = document.getElementById('sb-settings');
  var helpReport = document.getElementById('sb-report');
  var helpHelp = document.getElementById('sb-help');
  var helpAbout = document.getElementById('sb-about');
  var videoCards = document.querySelectorAll('.nt-video');
  var userChip = document.getElementById('nt-user');
  var usernameEl = document.getElementById('nt-username');

  var isLoggedIn = false; // placeholder until auth is implemented
  try { isLoggedIn = localStorage.getItem('nt_logged_in') === '1'; } catch (e) {}
  var savedName = '';
  var savedAvatar = '';
  try { 
    savedName = localStorage.getItem('nt_username') || '';
    savedAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
  } catch (e) {}

  if (isLoggedIn && userChip) {
    if (usernameEl) usernameEl.textContent = savedName || 'me';
    userChip.href = 'me.html';
    userChip.style.display = 'inline-flex';
    
    // Update avatar with saved image
    var headerAvatar = document.querySelector('.nt-user__pfp');
    if (headerAvatar) {
      headerAvatar.src = savedAvatar;
    }
    
    var signinBtn = document.querySelector('.nt-btn--primary');
    var signupBtn = document.querySelector('.nt-btn--outline');
    if (signinBtn) signinBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var query = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
      var target = 'results.html';
      if (query) {
        // Append query as ?q=...
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

  // Tabs switching
  function activateTab(tab) {
    if (!tabWhat || !tabFollowing || !sectionWhat || !sectionFollowing) return;
    var isWhat = tab === 'what';
    tabWhat.classList.toggle('nt-tab--active', isWhat);
    tabFollowing.classList.toggle('nt-tab--active', !isWhat);
    sectionWhat.classList.toggle('nt-section--active', isWhat);
    sectionFollowing.classList.toggle('nt-section--active', !isWhat);
    
    // Load content based on active tab
    if (isWhat) {
      loadWhatToWatchContent();
    } else {
      loadFollowingContent();
    }
  }

  if (tabWhat) {
    tabWhat.addEventListener('click', function () { activateTab('what'); });
  }
  if (tabFollowing) {
    tabFollowing.addEventListener('click', function () { activateTab('following'); });
  }

  // Load initial content
  loadWhatToWatchContent();

  // Routing for right-side actions
  function navigateOrSignIn(preferred) {
    if (isLoggedIn) {
      window.location.href = preferred;
    } else {
      window.location.href = 'signin.html';
    }
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', function () {
      navigateOrSignIn('upload.html');
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', function () {
      navigateOrSignIn('settings.html');
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

  // Sidebar buttons active state and navigation
  function setActiveSide(button) {
    sideButtons.forEach(function (b) { b.classList.remove('is-active'); });
    if (button) button.classList.add('is-active');
  }

  sideButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.id;
      setActiveSide(btn);
      if (id === 'sb-home') {
        // Home: just a placeholder for now
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
    try {
      var isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
      if (isLoggedIn) {
        logoutBtn.style.display = 'block';
      } else {
        logoutBtn.style.display = 'none';
      }
    } catch (e) {}
    
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

  // Video cards navigation
  videoCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var target = card.getAttribute('data-target') || 'video.html';
      var vid = card.getAttribute('data-video-id');
      if (vid) {
        try { sessionStorage.setItem('selectedVideoId', String(vid)); } catch (e) {}
      }
      window.location.href = target;
    });
  });

  // Header auth buttons routing
  var headerSignIn = document.querySelector('.nt-btn--primary');
  var headerSignUp = document.querySelector('.nt-btn--outline');
  if (headerSignIn) {
    headerSignIn.addEventListener('click', function () {
      window.location.href = 'signin.html';
    });
  }
  if (headerSignUp) {
    headerSignUp.addEventListener('click', function () {
      window.location.href = 'signup.html';
    });
  }

  // Load content for "What to Watch" tab
  function loadWhatToWatchContent() {
    // Load videos including user uploaded ones
    try {
      var whatSection = document.getElementById('nt-section-what');
      if (!whatSection) return;
      
      var globalVideos = JSON.parse(localStorage.getItem('nt_global_videos') || '[]');
      
      // Default videos if no global videos exist
      var defaultVideos = [
        {
          id: '1',
          title: 'Los Peores Trabajos | Hola Soy German',
          thumbnail: 'videoimage-1.png',
          uploader: {
            name: 'HolaSoyGerman',
            avatar: 'Channel1-pfp.png'
          },
          uploaded: '11 years ago'
        },
        {
          id: '2', 
          title: 'me at the zoo',
          thumbnail: 'videoimage-2.png',
          uploader: {
            name: 'Jawed',
            avatar: 'Channel4-pfp.png'
          },
          uploaded: '20 years ago'
        },
        {
          id: '3',
          title: 'Dross contesta preguntas estupidas 1', 
          thumbnail: 'videoimage-3.png',
          uploader: {
            name: 'Dross Rotzank',
            avatar: 'Channel6-pfp.png'
          },
          uploaded: '13 years ago'
        },
        {
          id: '4',
          title: 'Preguntas De twitter | Hola Soy German',
          thumbnail: 'miniatura-german-3.png',
          uploader: {
            name: 'HolaSoyGerman',
            avatar: 'Channel1-pfp.png'
          },
          uploaded: '10 years ago'
        },
        {
          id: '5',
          title: 'Hermanos | Hola Soy German',
          thumbnail: 'miniatura-german-2.png',
          uploader: {
            name: 'HolaSoyGerman',
            avatar: 'Channel1-pfp.png'
          },
          uploaded: '9 years ago'
        }
      ];
      
      // Combine user videos with default videos
      var allVideos = globalVideos.concat(defaultVideos);
      
      // Generate HTML for videos
      var videosHTML = '<div class="nt-videos">';
      allVideos.forEach(function(video) {
        videosHTML += 
          '<button class="nt-video" type="button" data-target="video.html" data-video-id="' + video.id + '">' +
            '<img class="nt-video__thumb" src="' + (video.thumbnail || 'videoimage-' + video.id + '.png') + '" alt="' + video.title + '">' +
            '<div class="nt-video__body">' +
              '<div class="nt-video__title">' + video.title + '</div>' +
              '<div class="nt-video__bottom">' +
                '<div class="nt-video__meta">' +
                  '<img class="nt-video__pfp" src="' + video.uploader.avatar + '" alt="' + video.uploader.name + '">' +
                  '<span class="nt-video__uploader">' + video.uploader.name + '</span>' +
                '</div>' +
                '<div class="nt-video__time">Uploaded ' + video.uploaded + '</div>' +
              '</div>' +
            '</div>' +
          '</button>';
      });
      videosHTML += '</div>';
      
      whatSection.innerHTML = videosHTML;
      
      // Re-attach video click handlers
      var newVideoCards = whatSection.querySelectorAll('.nt-video');
      newVideoCards.forEach(function (card) {
        card.addEventListener('click', function () {
          var target = card.getAttribute('data-target') || 'video.html';
          var vid = card.getAttribute('data-video-id');
          if (vid) {
            try { sessionStorage.setItem('selectedVideoId', String(vid)); } catch (e) {}
          }
          window.location.href = target;
        });
      });
      
    } catch (e) {
      console.log('Error loading what to watch content:', e);
    }
  }

  // Load content for "Following" tab
  function loadFollowingContent() {
    try {
      var subscriptions = JSON.parse(localStorage.getItem('nt_subscriptions') || '[]');
      var followingSection = document.getElementById('nt-section-following');
      
      if (!followingSection) return;
      
      if (subscriptions.length === 0) {
        followingSection.innerHTML = '<div style="padding: 40px; text-align: center; color: #707070;">You haven\'t subscribed to any channels yet.<br><br><a href="subs.html" style="color: #0034FF;">Browse channels to subscribe</a></div>';
        return;
      }
      
      // Get all videos from subscribed channels
      var allVideos = [
        {
          id: '1',
          title: 'Los Peores Trabajos | Hola Soy German',
          thumbnail: 'videoimage-1.png',
          uploader: {
            name: 'HolaSoyGerman',
            username: 'holasoygerman',
            avatar: 'Channel1-pfp.png'
          },
          uploaded: '11 years ago'
        },
        {
          id: '2',
          title: 'me at the zoo',
          thumbnail: 'videoimage-2.png',
          uploader: {
            name: 'Jawed',
            username: 'jawed',
            avatar: 'Channel4-pfp.png'
          },
          uploaded: '20 years ago'
        },
        {
          id: '3',
          title: 'Dross contesta preguntas estupidas 1',
          thumbnail: 'videoimage-3.png',
          uploader: {
            name: 'Dross Rotzank',
            username: 'drossrotzank',
            avatar: 'Channel6-pfp.png'
          },
          uploaded: '13 years ago'
        }
      ];
      
      // Filter videos to only show from subscribed channels
      var subscribedUsernames = subscriptions.map(function(sub) { return sub.username; });
      var followingVideos = allVideos.filter(function(video) {
        return subscribedUsernames.includes(video.uploader.username);
      });
      
      if (followingVideos.length === 0) {
        followingSection.innerHTML = '<div style="padding: 40px; text-align: center; color: #707070;">No recent videos from your subscriptions.<br><br><a href="subs.html" style="color: #0034FF;">Manage your subscriptions</a></div>';
        return;
      }
      
      // Generate HTML for following videos
      var videosHTML = '<div class="nt-videos">';
      followingVideos.forEach(function(video) {
        videosHTML += 
          '<button class="nt-video" type="button" data-target="video.html" data-video-id="' + video.id + '">' +
            '<img class="nt-video__thumb" src="' + video.thumbnail + '" alt="' + video.title + '">' +
            '<div class="nt-video__body">' +
              '<div class="nt-video__title">' + video.title + '</div>' +
              '<div class="nt-video__bottom">' +
                '<div class="nt-video__meta">' +
                  '<img class="nt-video__pfp" src="' + video.uploader.avatar + '" alt="' + video.uploader.name + '">' +
                  '<span class="nt-video__uploader">' + video.uploader.name + '</span>' +
                '</div>' +
                '<div class="nt-video__time">Uploaded ' + video.uploaded + '</div>' +
              '</div>' +
            '</div>' +
          '</button>';
      });
      videosHTML += '</div>';
      
      followingSection.innerHTML = videosHTML;
      
      // Re-attach video click handlers
      var newVideoCards = followingSection.querySelectorAll('.nt-video');
      newVideoCards.forEach(function (card) {
        card.addEventListener('click', function () {
          var target = card.getAttribute('data-target') || 'video.html';
          var vid = card.getAttribute('data-video-id');
          if (vid) {
            try { sessionStorage.setItem('selectedVideoId', String(vid)); } catch (e) {}
          }
          window.location.href = target;
        });
      });
      
    } catch (e) {
      console.log('Error loading following content:', e);
      var followingSection = document.getElementById('nt-section-following');
      if (followingSection) {
        followingSection.innerHTML = '<div style="padding: 40px; text-align: center; color: #707070;">Error loading following content.</div>';
      }
    }
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
    if (e.key === 'nt_subscriptions') {
      // Reload following content if subscriptions change
      var followingTab = document.getElementById('nt-tab-following');
      if (followingTab && followingTab.classList.contains('nt-tab--active')) {
        loadFollowingContent();
      }
    }
    if (e.key === 'nt_global_videos' || e.key === 'nt_user_videos') {
      // Reload what to watch content if videos change
      var whatTab = document.getElementById('nt-tab-what');
      if (whatTab && whatTab.classList.contains('nt-tab--active')) {
        loadWhatToWatchContent();
      }
    }
  });
});
