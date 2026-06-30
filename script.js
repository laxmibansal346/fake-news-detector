const name = localStorage.getItem('name');
if(name) {
    document.getElementById('profile-initial').innerText = name ? name.charAt(0).toUpperCase() : 'U';
}
const detectBtn = document.getElementById('detect-btn');
const newsInput = document.getElementById('news-input');
const result = document.getElementById('result');

detectBtn.addEventListener('click', async () => {
    const headline = newsInput.value.trim();

    if(headline === '') {
        result.style.display = 'block';
        result.style.backgroundColor = '#fff3cd';
        result.style.color = '#856404';
        result.innerText = 'Please enter a news headline first.';
        return;
    }

    result.style.display = 'block';
    result.style.backgroundColor = '#e8f4fd';
    result.style.color = '#0066cc';
    result.innerText = 'Analyzing... Please wait.';

    try {
        const response = await fetch('/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ headline })
        });

        const data = await response.json();

        if(data.result.toLowerCase().includes('fake')) {
            result.style.backgroundColor = '#fde8e8';
            result.style.color = '#cc0000';
        } else {
            result.style.backgroundColor = '#e8fde8';
            result.style.color = '#006600';
        }

        result.innerText = data.result;

    } catch(error) {
        result.style.backgroundColor = '#fde8e8';
        result.style.color = '#cc0000';
        result.innerText = 'Something went wrong. Please try again.';
    }
});