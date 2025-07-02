const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const BASE_URL = "https://hometown-tracker-back.onrender.com";

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch('https://hometown-tracker-back.onrender.com/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });

  const user = await res.json();
  if (user && user.id) {
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Login failed!');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const groupCode = document.getElementById('register-group').value;

  const res = await fetch('https://hometown-tracker-back.onrender.com/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password, groupCode })
  });

  const user = await res.json();
  if (user && user.id) {
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Registration failed!');
  }
});

