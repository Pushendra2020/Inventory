
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
    messageDiv.innerHTML = `<p style="color:green;">${data.message}</p>`;
} else {
    messageDiv.innerHTML = `<p style="color:red;">${data.message}</p>`;
}}).catch(error => {
            console.error("Error:", error);
            document.getElementById('message').innerHTML = "<p style='color:red;'>Error returning component.</p>";
        });
    });
})

