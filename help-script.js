// Help Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeHelpPage();
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

// Initialize help page
function initializeHelpPage() {
    console.log('Help page initialized');
    
    // Load user settings for theme
    loadUserTheme();
    
    // Add search functionality to FAQ items
    addFAQSearch();
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

// Add search functionality for FAQ items
function addFAQSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        // Create a custom search for FAQ when on help page
        searchInput.placeholder = 'Search FAQ or press Enter for global search';
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterFAQItems(query);
        });
    }
}

// Filter FAQ items based on search query
function filterFAQItems(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!query) {
        // Show all items if no query
        faqItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
            item.style.display = 'block';
            // Highlight matching text
            highlightText(item, query);
        } else {
            item.style.display = 'none';
        }
    });
}

// Highlight matching text in FAQ items
function highlightText(item, query) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    [question, answer].forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        
        if (highlightedText !== text) {
            element.innerHTML = highlightedText;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchButton) {
        searchButton.addEventListener('click', handleGlobalSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleGlobalSearch();
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

    // FAQ item interactions
    setupFAQInteractions();
}

// Setup FAQ item interactions
function setupFAQInteractions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a subtle animation when clicked
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 100);
        });
    });
}

// Handle global search (redirects to results page)
function handleGlobalSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Clear FAQ filtering
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.style.display = 'block';
            // Remove any highlighting
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.innerHTML = question.textContent;
            answer.innerHTML = answer.textContent;
        });
        
        // Redirect to global search
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

// Add smooth scrolling for better UX
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}