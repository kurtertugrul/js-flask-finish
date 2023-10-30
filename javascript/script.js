

const api_url = "http://127.0.0.1:5000/get";

async function getData() {
    try {
        const response = await fetch(api_url,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "username": localStorage.getItem(user)
            }
            
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.data);
            hideloader();
            show(data);
        } else {
            throw new Error(`Network response was not ok (${response.status})`);
        }
    } catch (error) {
        console.error(error);
        hideloader();
    }
}

function hideloader() {
    document.getElementById('loader').style.display = 'none';
}

function show(data) {
    const dataElement = document.getElementById('data');
    dataElement.textContent = JSON.stringify(data, null, 2);
}

(async () => {
    await getData();
})();
