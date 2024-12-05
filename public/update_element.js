document.getElementById("updateForm").addEventListener("submit", function(e) {
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
        if (data.success) {
            UshowMessagePopup("Component updated successfully!", 'green');
        } else {
            UshowMessagePopup("Error updating component", 'red');
        }
    })
    .catch(error => {
        UshowMessagePopup(error, 'red');
    });
});

function UshowMessagePopup(message, color) {
    const UmessagePopup = document.getElementById("UmessagePopup");
    UmessagePopup.style.display = "block";
    UmessagePopup.style.color = color;
    UmessagePopup.innerHTML = `<span class="font-medium">${message}</span>`;
    
    // Hide the popup after 2 seconds
    setTimeout(() => {
        UmessagePopup.style.display = "none";
    }, 2000);
}