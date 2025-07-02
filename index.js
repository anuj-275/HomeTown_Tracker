const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch('http://localhost:8080/login', {
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

  const res = await fetch('http://localhost:8080/register', {
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

