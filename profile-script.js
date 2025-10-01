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
  var profileBannerEl = document.getElementById('profile-banner');
  var profileAvatarImg = document.getElementById('profile-avatar-img');
  var profileUsernameEl = document.getElementById('profile-username');
  var profileSubscribersEl = document.getElementById('profile-subscribers');
  var profileDescriptionEl = document.getElementById('profile-description-text');
  var subscribeBtn = document.getElementById('profile-subscribe-btn');
  var videosContainer = document.getElementById('profile-videos-container');
  var noVideosEl = document.getElementById('profile-no-videos');

  // User data
  var isLoggedIn = false;
  var currentUser = '';
  var currentAvatar = '';
  var subscriptions = [];

  try {
    isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
    currentUser = localStorage.getItem('nt_username') || '';
    currentAvatar = localStorage.getItem('nt_avatar') || 'Default-pfp.png';
    subscriptions = JSON.parse(localStorage.getItem('nt_subscriptions') || '[]');
    
    // Migrate old subscription format (array of strings) to new format (array of objects)
    if (subscriptions.length > 0 && typeof subscriptions[0] === 'string') {
      console.log('Migrating old subscription format...');
      var migratedSubscriptions = subscriptions.map(function(channelId) {
        var channelNames = {
          'holasoygerman': 'HolaSoyGerman',
          'drossrotzank': 'Dross Rotzank',
          'jawed': 'Jawed',
          'cursor': 'Cursor',
          'carlossnakefist': 'CarlosSnakeFist',
          'bautista': 'Bautista'
        };
        return {
          username: channelId,
          name: channelNames[channelId] || channelId,
          subscribedAt: Date.now()
        };
      });
      subscriptions = migratedSubscriptions;
      localStorage.setItem('nt_subscriptions', JSON.stringify(subscriptions));
      console.log('Migration completed');
    }
  } catch (e) {
    console.log('Error loading user data:', e);
  }

  // Show logged in user in header or show sign in/up buttons
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
    // Show sign in/up buttons and set up their navigation
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
  }

  // Channel data - get from URL parameters
  var channelData = getChannelDataFromURL();
  
  if (channelData) {
    loadChannelProfile(channelData);
  } else {
    // No channel specified or invalid channel, redirect to home
    window.location.href = 'index.html';
  }

  // Function to get channel data based on URL parameters
  function getChannelDataFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var channelId = urlParams.get('channel');
    
    var channels = {
      'holasoygerman': {
        id: 'holasoygerman',
        name: 'HolaSoyGerman',
        avatar: 'Channel1-pfp.png',
        banner: 'profile-banner.png',
        subscribers: '41.2M',
        description: '¡Hola! Soy German, bienvenidos a mi canal donde subo videos divertidos y entretenidos. ¡Gracias por suscribirse!',
        videos: [
          {
            id: '1',
            title: 'Los Peores Trabajos | Hola Soy German',
            thumbnail: 'videoimage-1.png',
            uploadTime: '11 years ago'
          },
          {
            id: '4',
            title: 'Preguntas De twitter | Hola Soy German',
            thumbnail: 'miniatura-german-3.png',
            uploadTime: '10 years ago'
          },
          {
            id: '5',
            title: 'Hermanos | Hola Soy German',
            thumbnail: 'miniatura-german-2.png',
            uploadTime: '9 years ago'
          }
        ]
      },
      'drossrotzank': {
        id: 'drossrotzank',
        name: 'Dross Rotzank',
        avatar: 'Channel6-pfp.png',
        banner: 'profile-banner.png',
        subscribers: '18.5M',
        description: 'Canal oficial de Dross. Aquí encontrarás videos de terror, tops y mucho más contenido entretenido.',
        videos: [
          {
            id: '3',
            title: 'Dross contesta preguntas estupidas 1',
            thumbnail: 'videoimage-3.png',
            uploadTime: '13 years ago'
          }
        ]
      },
      'jawed': {
        id: 'jawed',
        name: 'Jawed',
        avatar: 'Channel4-pfp.png',
        banner: 'profile-banner.png',
        subscribers: '2.3M',
        description: 'The first video on YouTube! Welcome to my channel, this is where it all started.',
        videos: [
          {
            id: '2',
            title: 'me at the zoo',
            thumbnail: 'videoimage-2.png',
            uploadTime: '20 years ago'
          }
        ]
      },
      'cursor': {
        id: 'cursor',
        name: 'Cursor',
        avatar: 'Channel2-pfp.png',
        banner: 'profile-banner.png',
        subscribers: '125K',
        description: 'Technology and programming content. Building the future one line of code at a time.',
        videos: []
      },
      'carlossnakefist': {
        id: 'carlossnakefist',
        name: 'CarlosSnakeFist',
        avatar: 'Channel3-pfp.png',
        banner: 'profile-banner.png',
        subscribers: '89K',
        description: 'Gaming content and entertainment. Join me for epic gaming sessions and reviews!',
        videos: []
      },
      'bautista': {
        id: 'bautista',
        name: 'Bautista',
        avatar: 'ninetube-logo.png',
        banner: 'profile-banner.png',
        subscribers: '450K',
        description: 'Welcome to my channel! Creating content about life, technology and everything in between.',
        videos: []
      }
    };

    return channels[channelId] || null;
  }

  function loadChannelProfile(channel) {
    // Update page title
    document.title = channel.name + ' - ninetube';
    
    if (profileBannerEl) {
      profileBannerEl.style.backgroundImage = 'url(' + channel.banner + ')';
    }
    if (profileAvatarImg) {
      profileAvatarImg.src = channel.avatar;
    }
    if (profileUsernameEl) {
      profileUsernameEl.textContent = channel.name;
    }
    if (profileSubscribersEl) {
      profileSubscribersEl.textContent = channel.subscribers + ' Subscribers';
    }
    if (profileDescriptionEl) {
      profileDescriptionEl.textContent = channel.description;
    }

    // Check if already subscribed
    var isSubscribed = subscriptions.some(function(sub) {
      return sub.username === channel.id;
    });
    updateSubscribeButton(isSubscribed);

    // Setup subscribe button
    if (subscribeBtn) {
      subscribeBtn.addEventListener('click', function () {
        if (isLoggedIn) {
          toggleSubscription(channel.id, channel.name);
        } else {
          window.location.href = 'signin.html';
        }
      });
    }

    // Load videos
    displayChannelVideos(channel);
  }

  function updateSubscribeButton(isSubscribed) {
    if (!subscribeBtn) return;
    
    if (isSubscribed) {
      subscribeBtn.textContent = 'Subscribed';
      subscribeBtn.classList.add('subscribed');
    } else {
      subscribeBtn.textContent = 'Subscribe';
      subscribeBtn.classList.remove('subscribed');
    }
  }

  function toggleSubscription(channelId, channelName) {
    var isSubscribed = subscriptions.some(function(sub) {
      return sub.username === channelId;
    });
    
    if (isSubscribed) {
      // Unsubscribe - remove from subscriptions
      subscriptions = subscriptions.filter(function(sub) {
        return sub.username !== channelId;
      });
      console.log('Unsubscribed from:', channelName);
    } else {
      // Subscribe - add to subscriptions
      var newSubscription = {
        username: channelId,
        name: channelName,
        subscribedAt: Date.now()
      };
      subscriptions.push(newSubscription);
      console.log('Subscribed to:', channelName);
    }

    try {
      localStorage.setItem('nt_subscriptions', JSON.stringify(subscriptions));
      
      // Trigger storage event for other tabs (like subs.html)
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'nt_subscriptions',
        newValue: JSON.stringify(subscriptions)
      }));
      
    } catch (e) {
      console.log('Error saving subscriptions:', e);
    }

    updateSubscribeButton(!isSubscribed);
  }

  function displayChannelVideos(channel) {
    if (!videosContainer || !noVideosEl) return;

    if (channel.videos.length === 0) {
      videosContainer.style.display = 'none';
      noVideosEl.style.display = 'flex';
    } else {
      videosContainer.style.display = 'grid';
      noVideosEl.style.display = 'none';
      document.body.classList.add('has-videos');

      // Clear existing videos
      videosContainer.innerHTML = '';

      // Add channel videos
      channel.videos.forEach(function (video) {
        var videoEl = document.createElement('button');
        videoEl.className = 'nt-video';
        videoEl.setAttribute('data-target', 'video.html');
        videoEl.setAttribute('data-video-id', video.id);
        
        videoEl.innerHTML = 
          '<img class="nt-video__thumb" src="' + video.thumbnail + '" alt="' + video.title + '">' +
          '<div class="nt-video__body">' +
            '<div class="nt-video__title">' + video.title + '</div>' +
            '<div class="nt-video__bottom">' +
              '<div class="nt-video__meta">' +
                '<img class="nt-video__pfp" src="' + channel.avatar + '" alt="' + channel.name + '">' +
                '<span class="nt-video__uploader">' + channel.name + '</span>' +
              '</div>' +
              '<div class="nt-video__time">Uploaded ' + video.uploadTime + '</div>' +
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
      if (isLoggedIn) {
        window.location.href = 'upload.html';
      } else {
        window.location.href = 'signin.html';
      }
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', function () {
      if (isLoggedIn) {
        window.location.href = 'settings.html';
      } else {
        window.location.href = 'signin.html';
      }
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

  // Listen for localStorage changes from other tabs/windows
  window.addEventListener('storage', function (e) {
    if (e.key === 'nt_avatar' && e.newValue) {
      var headerAvatar = document.querySelector('.nt-user__pfp');
      if (headerAvatar) headerAvatar.src = e.newValue;
    }
    if (e.key === 'nt_username' && e.newValue) {
      if (usernameEl) usernameEl.textContent = e.newValue;
    }
    if (e.key === 'nt_subscriptions' && e.newValue) {
      // Update subscriptions and refresh subscribe button state
      try {
        subscriptions = JSON.parse(e.newValue);
        var channelData = getChannelDataFromURL();
        if (channelData) {
          var isSubscribed = subscriptions.some(function(sub) {
            return sub.username === channelData.id;
          });
          updateSubscribeButton(isSubscribed);
        }
      } catch (ex) {
        console.log('Error updating subscriptions from storage event:', ex);
      }
    }
  });
});