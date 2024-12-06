document.getElementById("updateForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const component_name = document.getElementById("component_name").value;
    const quantity = document.getElementById("quantity").value
    if (!component_name) {
        UshowMessagePopup("Component Name is required!", 'red');
        return;
    }
    if (!quantity) {
        UshowMessagePopup("Quantity is required!", 'red');
        return;
    }
    fetch("/updateData", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            component_name: component_name,
            quantity: quantity
        })
    })
        .then(response => response.json())
        .then(data => {
            const messageDiv = document.getElementById('message');
            if (data.success) {
                messageDiv.innerHTML = `<p style="color:green;">${data.message}</p>`;
            } else {
                messageDiv.innerHTML = `<p style="color:green;">${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById('message').innerHTML = "<p style='color:red;'>Error returning component.</p>";
        });
});
