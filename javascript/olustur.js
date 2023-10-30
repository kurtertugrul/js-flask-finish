title = document.getElementById('title')
desc = document.getElementById('description')

function submit() {
    let newPostTitle = title.value;
    let newPostDescription = desc.value;
    const user = localStorage.getItem("username")

    


    fetch('http://127.0.0.1:5000/new_post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "username": localStorage.getItem("username")
        },
        body: JSON.stringify({ title: newPostTitle, description: newPostDescription, username: user}),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Network response was not ok (${response.status})`);
        }
    })
    .then(data => {
        if (data.status == 201) {
            alert('Post başarıyla gönderildi');

        } else {
            clearForm();        }
    })
    .catch(error => {
        console.error('Hata:', error);
        alert('Gönderme işlemi sırasında hata oluştu');
    });
}

function clearForm() {
    title.value = '';
    desc.value = '';
}