// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
    setupEventListeners();
    checkAuthStatus();
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
            // Show logout button if user is logged in
            const logoutItem = document.querySelector('.logout-item');
            if (logoutItem) {
                logoutItem.style.display = 'block';
            }
        }
    } catch (error) {
        console.log('Auth check failed:', error);
    }
}

// Initialize about page (no animations)
function initializeAboutPage() {
    console.log('About page initialized');
    
    // Load user settings for theme
    loadUserTheme();
}

// Load user theme preferences
async function loadUserTheme() {
    try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated && data.user.settings && data.user.settings.dark_mode) {
            document.body.classList.add('dark-mode');
        }
    } catch (error) {
        console.log('Theme loading failed:', error);
    }
}

// Setup event listeners (no animations)
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Upload button
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            window.location.href = 'upload.html';
        });
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Contact links (no animations)
    setupContactLinks();
}

// Setup contact links (no animations)
function setupContactLinks() {
    const contactLinks = document.querySelectorAll('.contact-email, .contact-report, .contact-help');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Handle specific actions without animations
            if (this.classList.contains('contact-report')) {
                e.preventDefault();
                window.location.href = 'report.html';
            } else if (this.classList.contains('contact-help')) {
                e.preventDefault();
                window.location.href = 'help.html';
            }
        });
    });
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `results.html?q=${encodeURIComponent(query)}`;
    }
}

// Handle logout
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Clear localStorage and redirect
    localStorage.removeItem('currentUser');
    localStorage.removeItem('nt_logged_in');
    window.location.href = 'signin.html';
}

// Listen for storage changes (cross-tab synchronization)
window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser' && !e.newValue) {
        // User logged out in another tab
        window.location.href = 'signin.html';
    }
});