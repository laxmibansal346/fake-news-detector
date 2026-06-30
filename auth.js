const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authResult = document.getElementById('auth-result');

// Switch to Signup form
showSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    authResult.style.display = 'none';
});

// Switch to Login form
showLogin.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    authResult.style.display = 'none';
});

// Login
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if(!email || !password) {
        showResult('Please fill all fields!', 'error');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if(data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            window.location.href = '/index.html';
        } else {
            showResult(data.error, 'error');
        }

    } catch(err) {
        showResult('Something went wrong!', 'error');
    }
});

// Signup
signupBtn.addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if(!name || !email || !password) {
        showResult('Please fill all fields!', 'error');
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if(data.message) {
            showResult('Account created! Please login now.', 'success');
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        } else {
            showResult(data.error, 'error');
        }

    } catch(err) {
        showResult('Something went wrong!', 'error');
    }
});

// Show result message
function showResult(message, type) {
    authResult.style.display = 'block';
    authResult.innerText = message;
    if(type === 'error') {
        authResult.style.backgroundColor = '#fde8e8';
        authResult.style.color = '#cc0000';
    } else {
        authResult.style.backgroundColor = '#e8fde8';
        authResult.style.color = '#006600';
    }
}