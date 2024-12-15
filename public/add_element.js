document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const component_name = formData.get('component_name');
    const quantity = formData.get('quantity');
    let descrip = formData.get('descrip');
    let link = formData.get('link');

    if (link == null || link === '') {
        link = '#';
    }
    if (descrip == null || descrip === '') {
        descrip = 'Enter the descrip later';
    }

    fetch('/addData', {
        method: 'POST',
        body: new URLSearchParams({
            component_name: component_name,
            quantity: quantity,
            descrip: descrip,
            link: link
        })
    })
        .then(response => {
            const messageDiv = document.getElementById('message');
            if (response.ok) {
                response.json().then(data => {
                    if (data.success) {
                        messageDiv.innerHTML = `<p
                         class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">Component added is successfully</p>`;
                        popup(messageDiv, 2000);
                    } else {
                        messageDiv.innerHTML = `<p 
                        class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">${data.message}</p>`;
                        popup(messageDiv, 2000);
                    }
                });
            } else {
                messageDiv.innerHTML = `<p 
                class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">${response.statusText}</p>`;
                popup(messageDiv, 2000);
            }
        }).catch(error => {
            console.error("Error:", error);
            document.getElementById('message').innerHTML = `<p class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">Error returning component.</p>`;
            popup(messageDiv, 2000);
        });

});

function popup(messageDiv, duration) {
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, duration);
}