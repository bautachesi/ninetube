// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setupHeaderUserDisplay(); // Add this first
    setupSubscriptionsPage();
    setupSearchFunctionality();
    setupSidebarNavigation();
    setupStorageListener();
});

// Main setup function for subscriptions page
function setupSubscriptionsPage() {
    loadSubscriptions();
    setupUnsubscribeButtons();
}

// Load and display subscriptions
function loadSubscriptions() {
    try {
        var subscriptions = JSON.parse(localStorage.getItem('nt_subscriptions') || '[]');
        
        // Migrate old subscription format (array of strings) to new format (array of objects)
        if (subscriptions.length > 0 && typeof subscriptions[0] === 'string') {
            console.log('Migrating old subscription format in subs page...');
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
            console.log('Migration completed in subs page');
        }
        
        var channelsContainer = document.getElementById('subs-channels-container');
        var noChannelsDiv = document.getElementById('subs-no-channels');
        
        if (!channelsContainer || !noChannelsDiv) {
            console.log('Required DOM elements not found');
            return;
        }
        
        if (subscriptions.length === 0) {
            showNoSubscriptions();
            return;
        }
        
        hideNoSubscriptions();
        displaySubscriptions(subscriptions);
        
    } catch (e) {
        console.log('Error loading subscriptions:', e);
        showNoSubscriptions();
    }
}

// Display subscriptions in vertical list format
function displaySubscriptions(subscriptions) {
    var channelsContainer = document.getElementById('subs-channels-container');
    if (!channelsContainer) return;
    
    channelsContainer.innerHTML = '';
    
    subscriptions.forEach(function(subscription) {
        var channelItem = createSubscriptionItem(subscription);
        channelsContainer.appendChild(channelItem);
    });
}

// Create individual subscription item
function createSubscriptionItem(subscription) {
    var item = document.createElement('div');
    item.className = 'subs-channel-item';
    item.setAttribute('data-channel', subscription.username);
    
    // Get complete channel info
    var channelInfo = getChannelInfo(subscription.username);
    
    // Channel avatar
    var avatar = document.createElement('img');
    avatar.className = 'subs-channel-avatar';
    avatar.src = channelInfo.avatar;
    avatar.alt = channelInfo.name;
    
    // Channel info container
    var infoContainer = document.createElement('div');
    infoContainer.className = 'subs-channel-info';
    
    // Channel name
    var name = document.createElement('div');
    name.className = 'subs-channel-name';
    name.textContent = channelInfo.name;
    
    // Channel stats
    var stats = document.createElement('div');
    stats.className = 'subs-channel-stats';
    stats.textContent = formatSubscriberCount(channelInfo.subscribers) + ' subscribers';
    
    infoContainer.appendChild(name);
    infoContainer.appendChild(stats);
    
    // Unsubscribe button
    var unsubBtn = document.createElement('button');
    unsubBtn.className = 'subs-unsubscribe-btn';
    unsubBtn.textContent = 'Unsubscribe';
    unsubBtn.setAttribute('data-channel', subscription.username);
    
    // Assemble the item
    item.appendChild(avatar);
    item.appendChild(infoContainer);
    item.appendChild(unsubBtn);
    
    // Add click handler for navigating to channel
    item.addEventListener('click', function(e) {
        // Don't navigate if unsubscribe button was clicked
        if (e.target.classList.contains('subs-unsubscribe-btn')) {
            return;
        }
        
        // Navigate to channel profile
        window.location.href = 'profile.html?channel=' + encodeURIComponent(subscription.username);
    });
    
    return item;
}

// Setup unsubscribe button functionality
function setupUnsubscribeButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('subs-unsubscribe-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            var channelUsername = e.target.getAttribute('data-channel');
            if (channelUsername) {
                unsubscribeFromChannel(channelUsername);
            }
        }
    });
}

// Unsubscribe from a channel
function unsubscribeFromChannel(channelUsername) {
    if (!confirm('Are you sure you want to unsubscribe from this channel?')) {
        return;
    }
    
    try {
        var subscriptions = JSON.parse(localStorage.getItem('nt_subscriptions') || '[]');
        console.log('Before unsubscribe:', subscriptions);
        console.log('Unsubscribing from:', channelUsername);
        
        // Remove the subscription - handle both old and new formats
        subscriptions = subscriptions.filter(function(sub) {
            // Handle object format (new)
            if (typeof sub === 'object' && sub.username) {
                return sub.username !== channelUsername;
            }
            // Handle string format (old)
            return sub !== channelUsername;
        });
        
        console.log('After unsubscribe:', subscriptions);
        
        // Save updated subscriptions
        localStorage.setItem('nt_subscriptions', JSON.stringify(subscriptions));
        
        // Reload the subscriptions display
        loadSubscriptions();
        
        // Trigger storage event for other tabs (like profile pages)
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'nt_subscriptions',
            newValue: JSON.stringify(subscriptions)
        }));
        
        console.log('Unsubscribed successfully');
        
    } catch (e) {
        console.error('Error unsubscribing from channel:', e);
        alert('Error unsubscribing. Please try again.');
    }
}

// Get default avatar for a channel
function getDefaultChannelAvatar(username) {
    var channelAvatars = {
        'holasoygerman': 'Channel1-pfp.png',
        'cursor': 'Channel2-pfp.png',
        'carlossnakefist': 'Channel3-pfp.png',
        'jawed': 'Channel4-pfp.png',
        'bautista': 'ninetube-logo.png',
        'drossrotzank': 'Channel6-pfp.png'
    };
    
    return channelAvatars[username] || 'Default-pfp.png';
}

// Get channel info with proper names and subscriber counts
function getChannelInfo(username) {
    var channelData = {
        'holasoygerman': {
            name: 'HolaSoyGerman',
            avatar: 'Channel1-pfp.png',
            subscribers: 41200000
        },
        'cursor': {
            name: 'Cursor',
            avatar: 'Channel2-pfp.png',
            subscribers: 125000
        },
        'carlossnakefist': {
            name: 'CarlosSnakeFist',
            avatar: 'Channel3-pfp.png',
            subscribers: 89000
        },
        'jawed': {
            name: 'Jawed',
            avatar: 'Channel4-pfp.png',
            subscribers: 2300000
        },
        'bautista': {
            name: 'Bautista',
            avatar: 'ninetube-logo.png',
            subscribers: 450000
        },
        'drossrotzank': {
            name: 'Dross Rotzank',
            avatar: 'Channel6-pfp.png',
            subscribers: 18500000
        }
    };
    
    return channelData[username] || {
        name: username,
        avatar: 'Default-pfp.png',
        subscribers: 0
    };
}

// Format subscriber count
function formatSubscriberCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    } else {
        return count.toString();
    }
}

// Show no subscriptions message
function showNoSubscriptions() {
    var channelsContainer = document.getElementById('subs-channels-container');
    var noChannelsDiv = document.getElementById('subs-no-channels');
    
    if (channelsContainer) channelsContainer.style.display = 'none';
    if (noChannelsDiv) noChannelsDiv.style.display = 'flex';
    
    document.body.classList.remove('has-subscriptions');
}

// Hide no subscriptions message
function hideNoSubscriptions() {
    var channelsContainer = document.getElementById('subs-channels-container');
    var noChannelsDiv = document.getElementById('subs-no-channels');
    
    if (channelsContainer) channelsContainer.style.display = 'flex';
    if (noChannelsDiv) noChannelsDiv.style.display = 'none';
    
    document.body.classList.add('has-subscriptions');
}

// Setup search functionality
function setupSearchFunctionality() {
    var searchForm = document.getElementById('nt-search-form');
    var searchInput = document.getElementById('nt-search-input');
    
    if (searchForm && searchInput) {
        // Get search query from URL if we came from a search
        var urlParams = new URLSearchParams(window.location.search);
        var query = urlParams.get('q');
        if (query) {
            searchInput.value = query;
        }
        
        searchForm.addEventListener('submit', function(e) {
            var query = searchInput.value.trim();
            if (query) {
                window.location.href = 'results.html?q=' + encodeURIComponent(query);
            }
            e.preventDefault();
        });
    }
}

// Setup sidebar navigation
function setupSidebarNavigation() {
    // Setup sidebar toggle functionality
    var menuBtn = document.getElementById('nt-menu-btn');
    var sidebar = document.getElementById('nt-sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', function () {
            var isOpen = sidebar.classList.toggle('nt-sidebar--open');
            sidebar.setAttribute('aria-hidden', String(!isOpen));
            document.body.classList.toggle('sidebar-open', isOpen);
        });
        
        // Open by default (matching other pages)
        sidebar.classList.add('nt-sidebar--open');
        sidebar.setAttribute('aria-hidden', 'false');
        document.body.classList.add('sidebar-open');
    }
    
    // Compute sidebar top position
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
    
    // Home button
    var homeBtn = document.getElementById('sb-home');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // My Channel button  
    var channelBtn = document.getElementById('sb-channel');
    if (channelBtn) {
        channelBtn.addEventListener('click', function() {
            window.location.href = 'me.html';
        });
    }
    
    // History button
    var historyBtn = document.getElementById('sb-history');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            window.location.href = 'history.html';
        });
    }
    
    // Liked button
    var likedBtn = document.getElementById('sb-liked');
    if (likedBtn) {
        likedBtn.addEventListener('click', function() {
            window.location.href = 'liked.html';
        });
    }
    
    // Subscription channel buttons
    var subButtons = document.querySelectorAll('.nt-sub');
    subButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var profileUrl = this.getAttribute('data-profile');
            if (profileUrl) {
                window.location.href = profileUrl;
            }
        });
    });
    
    // Logout button
    var logoutBtn = document.getElementById('sb-logout');
    if (logoutBtn) {
        // Show logout button only when logged in
        var isLoggedIn = false;
        try {
            isLoggedIn = localStorage.getItem('nt_logged_in') === '1';
        } catch (e) {}
        
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
                    window.location.reload();
                }
            }
        });
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

// Setup storage event listener for cross-tab synchronization
function setupStorageListener() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'nt_subscriptions') {
            loadSubscriptions();
        } else if (e.key === 'nt_user_data' || e.key === 'nt_logged_in' || e.key === 'nt_username' || e.key === 'nt_avatar') {
            setupHeaderUserDisplay();
        }
    });
}