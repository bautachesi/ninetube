document.addEventListener('DOMContentLoaded', function () {
  var searchForm = document.getElementById('nt-search-form');
  var searchInput = document.getElementById('nt-search-input');
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

  // Check if user is already logged in
  checkAuthStatus();

  async function checkAuthStatus() {
    try {
      const response = await fetch('http://localhost:5000/api/check-auth', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        // User is already logged in, redirect to main page
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    }
  }

  var submit = document.getElementById('si-submit');
  var create = document.getElementById('si-create');
  
  if (submit) {
    console.log('Login button found, adding event listener');
    submit.addEventListener('click', async function () {
      console.log('Login button clicked');
      var email = (document.getElementById('si-email') || {}).value || '';
      var password = (document.getElementById('si-password') || {}).value || '';
      
      console.log('Email:', email, 'Password length:', password.length);
      
      if (!email.trim() || !password.trim()) {
        alert('Please enter your email and password');
        return;
      }
      
      // Show loading state
      submit.disabled = true;
      submit.textContent = 'Signing In...';
      
      try {
        console.log('Sending login request to backend');
        const response = await fetch('http://localhost:5000/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: email.trim(),
            password: password
          })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          // Store user data in localStorage for compatibility with existing code
          localStorage.setItem('currentUser', data.user.username);
          localStorage.setItem('nt_logged_in', '1');
          localStorage.setItem('nt_username', data.user.username);
          localStorage.setItem('nt_email', data.user.email);
          localStorage.setItem('nt_avatar', data.user.profile_picture);
          localStorage.setItem('nt_subscribers', data.user.subscribers.toString());
          
          console.log('Login successful, redirecting to index.html');
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Sign in failed');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        // If server is not running, show more helpful message
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          alert('Cannot connect to server. Please make sure the Flask server is running on http://localhost:5000');
        } else {
          alert('Network error. Please check if the server is running.');
        }
      } finally {
        submit.disabled = false;
        submit.textContent = 'Log in';
      }
    });
  } else {
    console.error('Login button not found!');
  }
  
  if (create) {
    console.log('Create account button found');
    create.addEventListener('click', function () { 
      console.log('Redirecting to signup.html');
      window.location.href = 'signup.html'; 
    });
  } else {
    console.error('Create account button not found!');
  }
});

