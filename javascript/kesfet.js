async function getData() {
    const user = localStorage.getItem('Users')
    const url = `http://127.0.0.1:5000/all_post_get`;

    try {
        const response = await fetch(url, {
            method: 'GET',
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
                <td>${item.username}</td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>

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


function searchPosts() {
    const searchText = searchInput.value.toLowerCase();

    const table = document.getElementById('post-table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const id = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        const username = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
        const title = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
        const description = rows[i].getElementsByTagName('td')[3].textContent.toLowerCase();

        if ( id.includes(searchText) || username.includes(searchText) || title.includes(searchText) || description.includes(searchText)) {
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
