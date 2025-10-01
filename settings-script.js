// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    loadUserSettings();
    setupEventListeners();
});

// Initialize settings functionality
async function initializeSettings() {
    try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = 'signin.html';
            return;
        }
        
        // Store current user data
        localStorage.setItem('currentUser', data.user.username);
        localStorage.setItem('nt_logged_in', '1');
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'signin.html';
    }
}

// Load user settings from backend
async function loadUserSettings() {
    try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = 'signin.html';
            return;
        }
        
        const userSettings = data.user.settings || {
            language: 'English'
        };
        
        const privateAccount = data.user.private_account || false;
        
        // Set private account toggle
        if (privateAccount) {
            document.getElementById('privateAccountToggle').classList.add('active');
        }
        
        // Set language selector
        document.getElementById('languageSelector').textContent = userSettings.language;
        localStorage.setItem('ninetube_language', userSettings.language);
        
        // Update selected language in dropdown
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-lang') === userSettings.language) {
                option.classList.add('selected');
            }
        });
        
        // Apply language changes
        applyLanguageChanges(userSettings.language);
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

// Save user settings to backend
async function saveUserSettings() {
    const privateAccountEnabled = document.getElementById('privateAccountToggle').classList.contains('active');
    const selectedLanguage = document.getElementById('languageSelector').textContent;

    try {
        await fetch('http://localhost:5000/api/update-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                private_account: privateAccountEnabled,
                language: selectedLanguage
            })
        });
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Private account toggle
    const privateAccountToggle = document.getElementById('privateAccountToggle');
    if (privateAccountToggle) {
        privateAccountToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            saveUserSettings();
        });
    }

    // Language selector
    const languageSelector = document.getElementById('languageSelector');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (languageSelector) {
        languageSelector.addEventListener('click', function() {
            if (languageDropdown) {
                languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    // Language options
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update selector text
            const selectedLang = this.getAttribute('data-lang');
            languageSelector.textContent = selectedLang;
            
            // Hide dropdown
            if (languageDropdown) {
                languageDropdown.style.display = 'none';
            }
            
            // Save settings
            saveUserSettings();
            
            // Apply language changes
            applyLanguageChanges(selectedLang);
            localStorage.setItem('ninetube_language', selectedLang);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.language-container') && languageDropdown) {
            languageDropdown.style.display = 'none';
        }
    });

    // Logout functionality (for logout button in sidebar)
    const logoutBtn = document.querySelector('#sb-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                await fetch('http://localhost:5000/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
            
            // Clear localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('nt_logged_in');
            window.location.href = 'signin.html';
        });
    }
}

// Apply language changes to the interface
function applyLanguageChanges(language) {
    const translations = {
        'English': {
            settingsTitle: 'SETTINGS & MORE',
            settingsDesc: 'Configure everything Ninetube allows you to configure. From page language to public or private account, and more!',
            privateAccount: 'Private Account',
            languageLabel: 'Language'
        },
        'Spanish': {
            settingsTitle: 'CONFIGURACIÓN Y MÁS',
            settingsDesc: 'Configura todo lo que Ninetube te permite configurar. Desde idioma de la página hasta cuenta pública o privada, ¡y más!',
            privateAccount: 'Cuenta Privada',
            languageLabel: 'Idioma'
        },
        'French': {
            settingsTitle: 'PARAMÈTRES ET PLUS',
            settingsDesc: 'Configurez tout ce que Ninetube vous permet de configurer. De la langue de la page au compte public ou privé, et plus encore!',
            privateAccount: 'Compte Privé',
            languageLabel: 'Langue'
        },
        'Russian': {
            settingsTitle: 'НАСТРОЙКИ И БОЛЬШЕ',
            settingsDesc: 'Настройте все, что позволяет настроить Ninetube. От языка страницы до публичного или приватного аккаунта и многое другое!',
            privateAccount: 'Приватный Аккаунт',
            languageLabel: 'Язык'
        }
    };

    const currentTranslations = translations[language] || translations['English'];
    
    // Update text content
    const titleElement = document.querySelector('.settings-title');
    const descElement = document.querySelector('.settings-description');
    const settingLabels = document.querySelectorAll('.setting-label');
    
    if (titleElement) titleElement.textContent = currentTranslations.settingsTitle;
    if (descElement) descElement.textContent = currentTranslations.settingsDesc;
    
    if (settingLabels[0]) settingLabels[0].textContent = currentTranslations.privateAccount;
    if (settingLabels[1]) settingLabels[1].textContent = currentTranslations.languageLabel;
}

// Listen for storage changes (cross-tab synchronization)
window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser' && !e.newValue) {
        // User logged out in another tab
        window.location.href = 'signin.html';
    }
    
    if (e.key === 'ninetube_language') {
        // Language changed in another tab
        applyLanguageChanges(e.newValue);
    }
});