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

  var signIn = document.querySelector('.nt-btn--primary');
  var signUp = document.querySelector('.nt-btn--outline');
  if (signIn) signIn.addEventListener('click', function () { window.location.href = 'signin.html'; });
  if (signUp) signUp.addEventListener('click', function () { window.location.href = 'signup.html'; });

  var submit = document.getElementById('su-submit');
  var login = document.getElementById('su-login');
  
  if (submit) {
    submit.addEventListener('click', async function () {
      var username = (document.getElementById('su-username') || {}).value || '';
      var email = (document.getElementById('su-email') || {}).value || '';
      var password = (document.getElementById('su-password') || {}).value || '';
      
      if (!username.trim() || !email.trim() || !password.trim()) {
        alert('Please fill in all fields');
        return;
      }
      
      // Show loading state
      submit.disabled = true;
      submit.textContent = 'Creating Account...';
      
      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password: password
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('Account created successfully!');
          window.location.href = 'signin.html';
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Network error. Please check if the server is running.');
      } finally {
        submit.disabled = false;
        submit.textContent = 'Sign Up';
      }
    });
  }
  
  if (login) {
    console.log('Sign in redirect button found');
    login.addEventListener('click', function () { 
      console.log('Redirecting to signin.html');
      window.location.href = 'signin.html'; 
    });
  } else {
    console.error('Sign in redirect button not found!');
  }
});

