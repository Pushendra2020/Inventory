
document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("deleteForm").addEventListener("submit", function(e) {
        e.preventDefault();
    
        const component_name = document.getElementById("component_name").value;
        if (!component_name) {
            showMessagePopup("Component Name is required!", 'red');
            return;
        }
        fetch("/deleteData", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `component_name=${component_name}`,
        })
        .then(response => response.json()) 
        .then(data => {
          const messageDiv = document.getElementById('message');
if (data.success) {
    messageDiv.innerHTML = `<p class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">${data.message}</p>`;
    popup(messageDiv,2000);
} else {
    messageDiv.innerHTML = `<p class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">${data.message}</p>`;
    popup(messageDiv,2000);
    
}}).catch(error => {
            console.error("Error:", error);
            document.getElementById('message').innerHTML = `<p class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">Error returning component.</p>`;
            popup(messageDiv,2000);
        });
    });
})

function popup(messageDiv,duration){
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, duration);
}

