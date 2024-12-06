document.getElementById('returnForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const prn = document.getElementById('prn').value;
    const component_name = document.getElementById('component_name').value;
    const quantity = document.getElementById('quantity').value;

    fetch('/returnComponent', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
       // body: JSON.stringify({ prn, component_name, quantity })
        body: new URLSearchParams({
            prn: prn,
            component_name: component_name,
            quantity: quantity,
        })
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.success) {
            messageDiv.innerHTML = `<p style="color:green;">${data.message}</p>`;
        } else {
            messageDiv.innerHTML = `<p style="color:red;">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById('message').innerHTML = "<p style='color:red;'>Error returning component.</p>";
    });
});