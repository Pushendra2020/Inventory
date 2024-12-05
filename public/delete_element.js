
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
            if (data.success) {
                showMessagePopup("Delete is successfull");
            } else {
                showMessagePopup("Delete is Not successfull");
            }
        })
        .catch(error => {
            showMessagePopup("Error deleting component");
        });
    });
    function showMessagePopup(message) {
         const messagePopup = document.getElementById("DmessagePopup");
         messagePopup.innerHTML =message;
        messagePopup.style.display = "block";  
        setTimeout(() => {
            messagePopup.style.display = "none";
        }, 1000);
    }
})

