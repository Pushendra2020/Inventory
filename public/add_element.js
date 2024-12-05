// const form = document.getElementById('form');

// const submit =document.getElementById("submit");

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
            if (response.ok) {
                showMessagePopup("Component added successfully",'green');
            } else {
                showMessagePopup("Error inserting component", 'red');
            }
        })
        .catch(error=> {
            showMessagePopup("error", 'red');
        });
        
        function showMessagePopup(message, color) {
            const messagePopup = document.getElementById("messagePopup");
            messagePopup.innerHTML =message;
            messagePopup.style.backgroundColor = color;
            messagePopup.style.display = "block";
            setTimeout(() => {
                messagePopup.style.display = "none";
            }, 2000);
        }
    });
// })
