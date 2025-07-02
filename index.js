const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const BASE_URL = "https://hometown-tracker-back.onrender.com";

// Utility: Email validation
function isValidEmail(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

// Utility: Group code validation (alphanumeric, 3-12 chars)
function isValidGroupCode(code) {
  return /^[A-Za-z0-9]{3,12}$/.test(code);
}

// Utility: Password strength (min 6 chars)
function isValidPassword(pw) {
  return pw.length >= 6;
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!isValidPassword(password)) {
    alert('Password must be at least 6 characters.');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error('Invalid credentials!');
    
    const user = await res.json();
    if (user && user.id) {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Login failed! Please check your credentials.');
    }
  } catch (err) {
    alert(err.message || 'Login failed!');
  }
});

// Register Handler
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();  // FIXED: added () after toLowerCase
  const password = document.getElementById('register-password').value;
  const groupCode = document.getElementById('register-group').value.trim().toLowerCase();

  if (!name) {
    alert('Name is required.');
    return;
  }
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!isValidPassword(password)) {
    alert('Password must be at least 6 characters.');
    return;
  }
  if (!isValidGroupCode(groupCode)) {
    alert('Group code must be 3-12 alphanumeric characters.');
    return;
  }

  try {
    // Check for duplicate email
    const usersRes = await fetch(`${BASE_URL}/users`);
    const users = await usersRes.json();

    if (users.some(u => u.email === email)) {
      alert('Email already registered.');
      return;
    }

    // (Optional) Check if group code is already used, if needed
    // if (users.some(u => u.groupCode === groupCode)) {
    //   alert('Group code already in use.');
    //   return;
    // }

    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, groupCode })
    });

    if (!res.ok) throw new Error('Registration failed!');

    const user = await res.json();
    if (user && user.id) {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Registration failed!');
    }
  } catch (err) {
    alert(err.message || 'Registration failed!');
  }
});
