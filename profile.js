const token = localStorage.getItem('token');
const name = localStorage.getItem('name');

if(!token) {
    window.location.href = '/login.html';
}

// Set first letter of name in avatar
document.getElementById('profile-name').innerText = name;
document.querySelector('.avatar').innerText = name ? name.charAt(0).toUpperCase() : 'U';

// Fetch profile data from server
fetch('/profile', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    document.getElementById('profile-name').innerText = data.name;
    document.getElementById('profile-email').innerText = data.email;
    document.querySelector('.avatar').innerText = data.name.charAt(0).toUpperCase();
    
    const date = new Date(data.created_at);
    document.getElementById('profile-date').innerText = date.toDateString();
})
.catch(err => {
    console.log('Error:', err);
});

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '/index.html';
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = '/login.html';
});