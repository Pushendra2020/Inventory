document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();
    
        const formData = new FormData(form);
        const component_name = formData.get('component_name');
        const quantity = formData.get('quantity');
    
       
        fetch('/addData', {
            method: 'POST',
            body: new URLSearchParams({
                component_name: component_name,
                quantity: quantity
            })
        })
        .then(response => {
           const messageDiv = document.getElementById('message');
if (response.ok) {
    response.json().then(data => {
        if (data.success) {
            messageDiv.innerHTML = `<p style="color:green;">Component added is successfully</p>`;
        } else {
            messageDiv.innerHTML = `<p style="color:red;">${data.message}</p>`;
        }
    });
} else {
    messageDiv.innerHTML = `<p style="color:red;">${response.statusText}</p>`;
}
}).catch(error=> {
            console.error("Error:", error);
            document.getElementById('message').innerHTML = "<p style='color:red;'>Error returning component.</p>";
        });
        
    });

