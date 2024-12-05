// //const { response } = require("express");

// document.addEventListener('DOMContentLoaded', () => {
//     const inventoryTable = document.getElementById("inventoryTable");
//     fetch("/data").then(response => response.json()).then(data => {
//         data.forEach(data => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//             <tr class="bg-white dark:bg-gray-800">
//                 <td class="px-4 py-4">
//                     ${data.component_name}
//                 </td>
                
//                 <td class="px-6 py-4">
//                     ${data.quantity}
//                 </td>
//             </tr>`;
//             inventoryTable.appendChild(row);
//         })
//     }).catch(error => {
//         console.error('Error fetching product:', error);
//     });
// });



document.addEventListener('DOMContentLoaded', () => {
    const inventoryTable = document.getElementById("inventoryTable");
    const searchInput = document.getElementById("searchInput");

    // Fetch data from the backend
    fetch("/data")
        .then(response => response.json())
        .then(data => {
            // Function to display the data in the table
            function renderTable(filteredData) {
                inventoryTable.innerHTML = ""; // Clear existing rows
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.classList.add('bg-white', 'dark:bg-gray-800');
                    row.innerHTML = `
                        <td class="px-4 py-4">${item.component_name}</td>
                        <td class="px-6 py-4">${item.quantity}</td>
                    `;
                    inventoryTable.appendChild(row);
                });
            }

            // Initially render the full table
            renderTable(data);

            // Listen for input changes in the search bar
            searchInput.addEventListener('input', () => {
                const searchQuery = searchInput.value.toLowerCase();

                // Filter data based on the search query
                const filteredData = data.filter(item => 
                    item.component_name.toLowerCase().includes(searchQuery) || 
                    item.quantity.toString().includes(searchQuery)
                );

                // Render filtered data
                renderTable(filteredData);
            });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
});
