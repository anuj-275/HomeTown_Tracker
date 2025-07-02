window.onload = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('user-name').innerText = user.name;
  document.getElementById('user-id').innerText = user.id;
  loadSummary();
  loadUsers();
};


async function updateStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const status = document.getElementById('status').value;

  const res = await fetch(`http://localhost:8080/status/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  const updatedUser = await res.json();
  localStorage.setItem('user', JSON.stringify(updatedUser));

  // Refresh data after update
  loadSummary();
  loadUsers();
}


async function loadSummary() {
  const user = JSON.parse(localStorage.getItem('user'));

  const res = await fetch('http://localhost:8080/users');
  const users = await res.json();

  // Filter users by same group
  const sameGroupUsers = users.filter(u => u.groupCode === user.groupCode);

  const inHometownCount = sameGroupUsers.filter(u => u.status === 'IN_HOMETOWN').length;
  const outOfTownCount = sameGroupUsers.filter(u => u.status === 'OUT_OF_TOWN').length;

  document.getElementById('in-hometown-count').innerText = inHometownCount;
  document.getElementById('out-town-count').innerText = outOfTownCount;
}


async function loadUsers() {
  const user = JSON.parse(localStorage.getItem('user'));
  const res = await fetch('http://localhost:8080/users');
  const users = await res.json();

  // Filter only users in the same group
  const groupUsers = users.filter(u => u.groupCode === user.groupCode);

  const inHometown = groupUsers
    .filter(u => u.status === 'IN_HOMETOWN')
    .map(u => `${u.name} (ID: ${u.id})`);

  const outOfTown = groupUsers
    .filter(u => u.status === 'OUT_OF_TOWN')
    .map(u => `${u.name} (ID: ${u.id})`);

  // Prepare table rows
  const maxLength = Math.max(inHometown.length, outOfTown.length);
  let rows = '';
  for (let i = 0; i < maxLength; i++) {
    rows += `
      <tr>
        <td>${outOfTown[i] || ''}</td>
        <td>${inHometown[i] || ''}</td>
      </tr>
    `;
  }

  document.getElementById('users-table').innerHTML = rows;
}


function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

