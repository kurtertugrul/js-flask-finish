


async function getData() {
    const user = localStorage.getItem('Users', 'username')
    const url = `http://127.0.0.1:5000/get`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: 
            {
                'Content-Type': 'application/json',
                "username": localStorage.getItem("username")
                
                
            }

        });

        if (!response.ok) {
            console.error('Veri çekme işlemi başarısız oldu.');
            return;
        }

        const data = await response.json();
        console.log(data.data)
        const tableBody = document.querySelector("#post-table tbody");
        tableBody.innerHTML = "";

        data.data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <table class="table">
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>
                <button onclick="deleteData(${item.id})">Delete</button>
                <button onclick="updateData(${item.id})">Edit</button>
                </td>
                </table>
            `;
            tableBody.appendChild(row);
        });

        hideloader();
    } catch (error) {
        console.error('Error:', error);
    }
}

(async () => {
    await getData();
})();

function hideloader() {
    document.getElementById('loader').style.display = 'none';
}

function deleteData(id) {
    fetch(`http://127.0.0.1:5000/delete/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ yanıtı düzgün değil');
            }
            return response.json();
        })
        .then(data => {
            if (data.status) {
                // Silinen veriyi tablodan kaldır veya tabloyu güncelle
                // alert('Veri başarıyla silindi');
            } else {
                alert('Veri silme başarısız oldu');
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            alert('Silme işlemi sırasında hata oluştu');
        });
}
document.addEventListener('DOMContentLoaded', function() {
    const editModal = document.getElementById('editModal');
    const editModalClose = document.getElementById('editModalClose');
    const editPostButton = document.getElementById('editPostButton');
    const editPostTitle = document.getElementById('editPostTitle');
    const editPostDescription = document.getElementById('editPostDescription');
    const editPostId = document.getElementById('editPostId');

    // Open the edit modal
    function openEditModal(id, title, description) {
        editPostId.value = id;
        editPostTitle.value = title;
        editPostDescription.value = description;
        editModal.style.display = 'block';
    }

    // Close the edit modal
    editModalClose.onclick = function() {
        editModal.style.display = 'none';
    }

    // Handle the "Edit" button click in the table
    document.addEventListener('click', function(event) {
        if (event.target && event.target.textContent === 'Edit') {
            const row = event.target.parentElement.parentElement;
            const id = row.cells[0].textContent;
            const title = row.cells[1].textContent;
            const description = row.cells[2].textContent;
            openEditModal(id, title, description);
        }
    });

    // Handle the "Edit Post" button click in the modal
    editPostButton.onclick = function() {
        const id = editPostId.value;
        const newTitle = editPostTitle.value;
        const newDescription = editPostDescription.value;

        fetch(`http://127.0.0.1:5000/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, title: newTitle, description: newDescription }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status==201) {
                editModal.style.display = 'none';
                // Reload the table or update the edited row as needed
                alert('Post updated successfully');
            } else {
                // alert('Post update failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error during the update operation');
        });
    }
});
function searchPosts() {
    const searchText = searchInput.value.toLowerCase();

    const table = document.getElementById('post-table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const id = rows[i].getElementsByTagName('tg')[0].textContent.toLowerCase();
        const title = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
        const description = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();

        if (id.includes(searchText) || title.includes(searchText) || description.includes(searchText)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}


document.getElementById('searchInput').addEventListener('input', searchPosts);




(async () => {
    await getData();
})();
