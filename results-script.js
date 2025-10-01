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

  // Results specific elements
  var resultsQueryEl = document.getElementById('results-query');
  var resultsCountEl = document.getElementById('results-count');
  var resultsChannelsSection = document.getElementById('results-channels');
  var resultsChannelsContainer = document.getElementById('results-channels-container');
  var resultsVideosSection = document.getElementById('results-videos');
  var resultsVideosContainer = document.getElementById('results-videos-container');
  var noResultsEl = document.getElementById('results-no-results');

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

  // Database of channels and videos
  var channelsDatabase = {
    'holasoygerman': {
      id: 'holasoygerman',
      name: 'HolaSoyGerman',
      avatar: 'Channel1-pfp.png',
      subscribers: '39M',
      keywords: ['hola', 'soy', 'german', 'holasoygerman', 'germán']
    },
    'drossrotzank': {
      id: 'drossrotzank',
      name: 'Dross Rotzank',
      avatar: 'Channel6-pfp.png',
      subscribers: '23M',
      keywords: ['dross', 'rotzank', 'drossrotzank', 'terror', 'tops']
    },
    'jawed': {
      id: 'jawed',
      name: 'Jawed',
      avatar: 'Channel4-pfp.png',
      subscribers: '2.1M',
      keywords: ['jawed', 'zoo', 'first', 'video']
    },
    'cursor': {
      id: 'cursor',
      name: 'Cursor',
      avatar: 'Channel2-pfp.png',
      subscribers: '1.2M',
      keywords: ['cursor', 'technology', 'programming', 'tech']
    },
    'carlossnakefist': {
      id: 'carlossnakefist',
      name: 'CarlosSnakeFist',
      avatar: 'Channel3-pfp.png',
      subscribers: '890K',
      keywords: ['carlos', 'snake', 'fist', 'carlossnakefist', 'gaming']
    },
    'bautista': {
      id: 'bautista',
      name: 'Bautista',
      avatar: 'ninetube-logo.png',
      subscribers: '450K',
      keywords: ['bautista', 'life', 'technology']
    }
  };

  var videosDatabase = {
    '1': {
      id: '1',
      title: 'Los Peores Trabajos | Hola Soy German',
      thumbnail: 'videoimage-1.png',
      uploaded: 'Uploaded 11 years ago',
      uploader: channelsDatabase.holasoygerman,
      keywords: ['los', 'peores', 'trabajos', 'hola', 'soy', 'german', 'trabajo', 'empleo']
    },
    '2': {
      id: '2',
      title: 'me at the zoo',
      thumbnail: 'videoimage-2.png',
      uploaded: 'Uploaded 20 years ago',
      uploader: channelsDatabase.jawed,
      keywords: ['me', 'at', 'the', 'zoo', 'first', 'video', 'jawed', 'elephants']
    },
    '3': {
      id: '3',
      title: 'Dross contesta preguntas estupidas 1',
      thumbnail: 'videoimage-3.png',
      uploaded: 'Uploaded 13 years ago',
      uploader: channelsDatabase.drossrotzank,
      keywords: ['dross', 'contesta', 'preguntas', 'estupidas', 'questions', 'answers']
    }
  };

  // Get search query from URL
  var urlParams = new URLSearchParams(window.location.search);
  var searchQuery = urlParams.get('q') || '';

  // Set search input value
  if (searchInput) {
    searchInput.value = searchQuery;
  }

  // Perform search
  if (searchQuery) {
    performSearch(searchQuery);
  } else {
    showNoResults();
  }

  function performSearch(query) {
    var searchTerms = query.toLowerCase().trim().split(' ').filter(function(term) {
      return term.length > 0;
    });

    if (searchTerms.length === 0) {
      showNoResults();
      return;
    }

    // Search channels
    var matchingChannels = searchChannels(searchTerms);
    
    // Search videos
    var matchingVideos = searchVideos(searchTerms);

    // Display results
    displayResults(query, matchingChannels, matchingVideos);
  }

  function searchChannels(searchTerms) {
    var matches = [];

    // Search in default channels
    Object.values(channelsDatabase).forEach(function(channel) {
      var score = 0;
      var nameWords = channel.name.toLowerCase().split(' ');
      
      searchTerms.forEach(function(term) {
        // Check exact name matches (higher score)
        if (channel.name.toLowerCase().includes(term)) {
          score += 10;
        }
        
        // Check keyword matches
        channel.keywords.forEach(function(keyword) {
          if (keyword.includes(term)) {
            score += 5;
          }
        });
        
        // Check word matches in name
        nameWords.forEach(function(word) {
          if (word.includes(term)) {
            score += 3;
          }
        });
      });

      if (score > 0) {
        matches.push({ channel: channel, score: score });
      }
    });
    
    // Search in real user accounts
    try {
      var userData = JSON.parse(localStorage.getItem('nt_user_data') || '{}');
      if (userData.username) {
        var userScore = 0;
        var userNameWords = userData.username.toLowerCase().split(' ');
        
        searchTerms.forEach(function(term) {
          if (userData.username.toLowerCase().includes(term)) {
            userScore += 10;
          }
          userNameWords.forEach(function(word) {
            if (word.includes(term)) {
              userScore += 3;
            }
          });
        });
        
        if (userScore > 0) {
          var realUserChannel = {
            id: userData.username.toLowerCase().replace(/\s+/g, ''),
            name: userData.username,
            avatar: userData.profilePicture || 'Default-pfp.png',
            subscribers: '1',
            isRealUser: true
          };
          matches.push({ channel: realUserChannel, score: userScore });
        }
      }
    } catch (e) {
      console.log('Error searching real users:', e);
    }

    // Sort by score (highest first)
    return matches.sort(function(a, b) {
      return b.score - a.score;
    }).map(function(match) {
      return match.channel;
    });
  }

  function searchVideos(searchTerms) {
    var matches = [];

    // Search in default videos
    Object.values(videosDatabase).forEach(function(video) {
      var score = 0;
      var titleWords = video.title.toLowerCase().split(' ');
      
      searchTerms.forEach(function(term) {
        // Check exact title matches (higher score)
        if (video.title.toLowerCase().includes(term)) {
          score += 10;
        }
        
        // Check keyword matches
        video.keywords.forEach(function(keyword) {
          if (keyword.includes(term)) {
            score += 5;
          }
        });
        
        // Check uploader name matches
        if (video.uploader.name.toLowerCase().includes(term)) {
          score += 7;
        }
        
        // Check word matches in title
        titleWords.forEach(function(word) {
          if (word.includes(term)) {
            score += 3;
          }
        });
      });

      if (score > 0) {
        matches.push({ video: video, score: score });
      }
    });
    
    // Search in user-uploaded videos
    try {
      var globalVideos = JSON.parse(localStorage.getItem('nt_global_videos') || '[]');
      globalVideos.forEach(function(video) {
        var score = 0;
        var titleWords = video.title.toLowerCase().split(' ');
        
        searchTerms.forEach(function(term) {
          // Check exact title matches
          if (video.title.toLowerCase().includes(term)) {
            score += 10;
          }
          
          // Check description matches
          if (video.desc && video.desc.toLowerCase().includes(term)) {
            score += 5;
          }
          
          // Check uploader name matches
          if (video.uploader && video.uploader.name.toLowerCase().includes(term)) {
            score += 7;
          }
          
          // Check word matches in title
          titleWords.forEach(function(word) {
            if (word.includes(term)) {
              score += 3;
            }
          });
        });
        
        if (score > 0) {
          // Convert user video to results format
          var resultVideo = {
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail || 'default-thumb.png',
            uploaded: video.uploaded,
            uploader: {
              name: video.uploader.name,
              avatar: video.uploader.avatar
            },
            isUserVideo: true
          };
          matches.push({ video: resultVideo, score: score });
        }
      });
    } catch (e) {
      console.log('Error searching user videos:', e);
    }

    // Sort by score (highest first)
    return matches.sort(function(a, b) {
      return b.score - a.score;
    }).map(function(match) {
      return match.video;
    });
  }

  function displayResults(query, channels, videos) {
    // Update header
    if (resultsQueryEl) {
      resultsQueryEl.textContent = 'Search results for "' + query + '"';
    }

    var totalResults = channels.length + videos.length;
    if (resultsCountEl) {
      resultsCountEl.textContent = 'About ' + totalResults + ' results';
    }

    // Show/hide sections
    if (channels.length > 0) {
      resultsChannelsSection.style.display = 'block';
      displayChannels(channels);
    } else {
      resultsChannelsSection.style.display = 'none';
    }

    if (videos.length > 0) {
      resultsVideosSection.style.display = 'block';
      displayVideos(videos);
    } else {
      resultsVideosSection.style.display = 'none';
    }

    if (totalResults === 0) {
      showNoResults();
    } else {
      noResultsEl.style.display = 'none';
    }
  }

  function displayChannels(channels) {
    if (!resultsChannelsContainer) return;

    resultsChannelsContainer.innerHTML = '';

    channels.forEach(function(channel) {
      var channelEl = document.createElement('button');
      channelEl.className = 'results-channel';
      
      channelEl.innerHTML =
        '<img class="results-channel__avatar" src="' + channel.avatar + '" alt="' + channel.name + '">' +
        '<div class="results-channel__info">' +
          '<h3 class="results-channel__name">' + channel.name + '</h3>' +
          '<p class="results-channel__subscribers">' + channel.subscribers + ' Subscribers</p>' +
        '</div>';

      channelEl.addEventListener('click', function() {
        if (channel.isRealUser) {
          // Navigate to user's profile (me.html for current user, profile.html for others)
          var currentUser = '';
          try {
            currentUser = localStorage.getItem('nt_username') || '';
          } catch (e) {}
          
          if (channel.name === currentUser) {
            window.location.href = 'me.html';
          } else {
            window.location.href = 'profile.html?channel=' + encodeURIComponent(channel.id);
          }
        } else {
          window.location.href = 'profile.html?channel=' + channel.id;
        }
      });

      resultsChannelsContainer.appendChild(channelEl);
    });
  }

  function displayVideos(videos) {
    if (!resultsVideosContainer) return;

    resultsVideosContainer.innerHTML = '';

    videos.forEach(function(video) {
      var videoEl = document.createElement('button');
      videoEl.className = 'results-video';
      
      videoEl.innerHTML =
        '<img class="results-video__thumbnail" src="' + video.thumbnail + '" alt="' + video.title + '">' +
        '<div class="results-video__info">' +
          '<h3 class="results-video__title">' + video.title + '</h3>' +
          '<p class="results-video__date">' + video.uploaded + '</p>' +
          '<div class="results-video__uploader">' +
            '<img class="results-video__uploader-avatar" src="' + video.uploader.avatar + '" alt="' + video.uploader.name + '">' +
            '<span class="results-video__uploader-name">' + video.uploader.name + '</span>' +
          '</div>' +
        '</div>';

      videoEl.addEventListener('click', function() {
        try {
          sessionStorage.setItem('selectedVideoId', video.id);
        } catch (e) {}
        window.location.href = 'video.html';
      });

      resultsVideosContainer.appendChild(videoEl);
    });
  }

  function showNoResults() {
    if (resultsQueryEl && searchQuery) {
      resultsQueryEl.textContent = 'Search results for "' + searchQuery + '"';
    }
    if (resultsCountEl) {
      resultsCountEl.textContent = '0 results';
    }
    
    resultsChannelsSection.style.display = 'none';
    resultsVideosSection.style.display = 'none';
    noResultsEl.style.display = 'block';
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

  // Listen for localStorage changes from other tabs/windows
  window.addEventListener('storage', function (e) {
    if (e.key === 'nt_avatar' && e.newValue) {
      var headerAvatar = document.querySelector('.nt-user__pfp');
      if (headerAvatar) headerAvatar.src = e.newValue;
    }
    if (e.key === 'nt_username' && e.newValue) {
      if (usernameEl) usernameEl.textContent = e.newValue;
    }
  });
});