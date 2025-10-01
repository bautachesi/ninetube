// Report Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeReportPage();
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

// Initialize report page
function initializeReportPage() {
    console.log('Report page initialized');
    
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

// Setup event listeners
function setupEventListeners() {
    // Report form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

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
}

// Handle report form submission
async function handleReportSubmission(e) {
    e.preventDefault();
    
    const formData = {
        reportedUsername: document.getElementById('reportedUsername').value.trim(),
        reportedEmail: document.getElementById('reportedEmail').value.trim(),
        reason: document.getElementById('reportReason').value,
        details: document.getElementById('reportDetails').value.trim()
    };
    
    // Validation
    if (!formData.reportedUsername || !formData.reason) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        // In a real implementation, this would send to your backend
        // For now, we'll simulate sending an email
        await simulateEmailSend(formData);
        
        showMessage('Report sent successfully! We will review your report within 24-48 hours.', 'success');
        
        // Reset form
        document.getElementById('reportForm').reset();
        
    } catch (error) {
        console.error('Report submission error:', error);
        showMessage('Failed to send report. Please try again later.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Report';
    }
}

// Simulate email sending (in real app, this would be handled by backend)
async function simulateEmailSend(reportData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Report would be sent to bautistamonachesi@gmail.com:', reportData);
            resolve();
        }, 1000);
    });
}

// Show success/error messages
function showMessage(text, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    const reportPanel = document.querySelector('.report-panel');
    reportPanel.insertBefore(message, reportPanel.firstChild);
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
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