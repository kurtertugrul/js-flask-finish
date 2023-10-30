document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const messageDiv1 = document.getElementById('message');

    loginButton.addEventListener('click', function () {
        const username1 = document.getElementById('username1').value;
        const password1 = document.getElementById('password1').value;
        localStorage.setItem('username', username1)

        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username1, password: password1})
        })
            .then(response => response.json())
            .then(data => {
                messageDiv1.textContent = data.message;
                if (data.status == true) {
                    console.log(data);
                    window.location.href = 'http://127.0.0.1:5501/main.html?#';
                } else {
                    console.log(data);
                    alert('Giriş başarısız');
                }
            })
            .catch(error => {
                messageDiv1.textContent = 'Hata ' + error;
            });
    });
});