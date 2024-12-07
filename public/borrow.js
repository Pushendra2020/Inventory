document.addEventListener("DOMContentLoaded", () => {
    const borrowForm = document.getElementById('borrowForm');
    borrowForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const component_name = document.getElementById("component_name").value;
        const quantity = document.getElementById("quantity").value;
        const prn = document.getElementById('prn').value;
        const user_name = document.getElementById('user_name').value


        fetch("/borrowData", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                user_name: user_name,
                prn: prn,
                component_name: component_name,
                quantity: quantity,
            })
        })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('message');
                if (data.success) {
                    messageDiv.innerHTML = `<p class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">${data.message}</p>`;
                    popup(messageDiv,2000)

                } else {
                    messageDiv.innerHTML = `<p class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">${data.message}</p>`; 
                    popup(messageDiv,2000)
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById('message').innerHTML = `<p class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">Error returning component.</p>`;
                popup(messageDiv,2000)
            })
    })
})

function popup(messageDiv,duration){
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, duration);
}