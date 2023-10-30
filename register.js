document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const messageDiv = document.getElementById('message');

    registerButton.addEventListener('click', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const birthday = document.getElementById('birthday').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const phonenumber = document.getElementById('phonenumber').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordcorrect = document.getElementById('passwordcorrect').value;
        
        if (password != passwordcorrect) {
            alert ('Şifreler Uyumsuz');
        } else {
            const userData = {
                name,
                surname,
                birthday,
                gender,
                phonenumber,
                email,
                username,
                password,
                passwordcorrect
            };  
        

            fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                    messageDiv.textContent = data.message;
                    window.location.href = 'http://127.0.0.1:5501/login.html'  
            })
            .catch(error => {
                messageDiv.textContent = 'Hata: ' + error;
            });
        }
    });
});

