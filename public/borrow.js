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
                if (data.success) {
                    showMessagePopup("Borrow is successfull");
                } else {
                    showMessagePopup("Borrow is Not successfull");
                }
            })
            .catch(error => {
                showMessagePopup("Error Borrowing component");
            })
    })
})