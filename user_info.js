function fetchUserInfo() {
    const username = localStorage.getItem('username');

    fetch('http://127.0.0.1:5000/user_info', {
        method: 'GET',
        headers: {
            'username': username
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === true && data.data.length > 0) {
            const user = data.data[0]; 

            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-surname').textContent = user.surname;
            document.getElementById('user-birthday').textContent = user.birthday;
            document.getElementById('user-gender').textContent = user.gender === 'on' ? 'Erkek' : 'Kadın';
            document.getElementById('user-phonenumber').textContent = user.phonenumber;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-username').textContent = user.username;
        } else {
            const userInfoDiv = document.getElementById('user-info');
            userInfoDiv.innerHTML = '<p>User information not available.</p>';
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.innerHTML = '<p>Error fetching user information.</p>';
    });
}
document.addEventListener('DOMContentLoaded', function () {
    fetchUserInfo();
});

// document.getElementById('editUserButton').addEventListener('click', function() {
//     const userId = document.getElementById('editUserId').value;
//     const updatedName = document.getElementById('editUserName').value;
//     const updatedSurname = document.getElementById('editUserSurname').value;
//     const updatedBirthday = document.getElementById('editUserBirthday').value;
//     const updatedGender = document.getElementById('editUserGender').value;
//     const updatedPhonenumber = document.getElementById('editUserPhonenumber').value;
//     const updatedEmail = document.getElementById('editUserEmail').value;

//     fetch('http://127.0.0.1:5000/update_user', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             id: userId,
//             name: updatedName,
//             surname: updatedSurname,
//             birthday: updatedBirthday,
//             gender: updatedGender,
//             phonenumber: updatedPhonenumber,
//             email: updatedEmail,
//         }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.message === 'Kullanıcı bilgileri başarıyla güncellendi') {
//             fetchUserInfo();
//         } else {
//             alert('Güncelleme sırasında hata oluştu.');
//         }
//     })
//     .catch(error => {
//         console.error('Hata:', error);
//         alert('Güncelleme sırasında hata oluştu.');
//     });
// });
