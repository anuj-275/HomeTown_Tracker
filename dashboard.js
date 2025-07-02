window.onload = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  // Show name + ID
  document.getElementById('user-name').innerText = `${user.name} (ID: ${user.id})`;

  loadSummary();
  loadUsers();
};


async function updateStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const status = document.getElementById('status').value;
  const city = status === 'OUT_OF_TOWN' ? document.getElementById('city').value : 'Gaya';

  const res = await fetch(`https://hometown-tracker-back.onrender.com/status/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, city })
  });

  const updatedUser = await res.json();
  localStorage.setItem('user', JSON.stringify(updatedUser));

  loadSummary();
  loadUsers();
}


async function loadSummary() {
  const user = JSON.parse(localStorage.getItem('user'));
  try {
    const res = await fetch('https://hometown-tracker-back.onrender.com/users');
    if (!res.ok) throw new Error('Failed to load summary.');
    const users = await res.json();
    const sameGroupUsers = users.filter(u => u.groupCode === user.groupCode);
    const inHometownCount = sameGroupUsers.filter(u => u.status === 'IN_HOMETOWN').length;
    const outOfTownCount = sameGroupUsers.filter(u => u.status === 'OUT_OF_TOWN').length;
    document.getElementById('in-hometown-count').innerText = inHometownCount;
    document.getElementById('out-town-count').innerText = outOfTownCount;
  } catch (err) {
    alert(err.message || 'Failed to load summary!');
  }
}
async function loadUsers() {
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    const res = await fetch('https://hometown-tracker-back.onrender.com/users');
    if (!res.ok) throw new Error('Failed to load users.');

    const users = await res.json();

    // Filter only users from the same group
    const groupUsers = users.filter(u => u.groupCode === user.groupCode);

    // Prepare names with IDs and city (if applicable)
    const inHometown = groupUsers
      .filter(u => u.status === 'IN_HOMETOWN')
      .map(u => `${u.name}`);

    const outOfTown = groupUsers
      .filter(u => u.status === 'OUT_OF_TOWN')
      .map(u => `${u.name} (${u.city || 'Unknown'})`);

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
  } catch (err) {
    alert(err.message || 'Failed to load users!');
  }
}


function toggleCityInput() {
  const status = document.getElementById('status').value;
  document.getElementById('city-input').style.display = status === 'OUT_OF_TOWN' ? 'block' : 'none';
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
