// document.addEventListener('DOMContentLoaded', () => {
//     const inventoryTable = document.getElementById("inventoryTable");
//     const searchInput = document.getElementById("searchInput");
//     fetch("/data")
//         .then(response => response.json())
//         .then(data => {
//             function renderTable(filteredData) {
//                 inventoryTable.innerHTML = "";
//                 filteredData.forEach(item => {
//                     const row = document.createElement('tr');
//                     row.classList.add('bg-white', 'dark:bg-gray-800');
//                     row.innerHTML = `
//                         <td class="px-4 py-4">${item.component_name}</td>
//                         <td class="px-6 py-4">${item.quantity}</td>
//                         <td class="px-6 py-4">${item.descrip}</td>
//                         <td class="px-6 py-4"> <a href="${item.link}" class="text-blue-400 cursor-pointer" target="_blank">Click to go Link</a>
//                         <td class="px-6 py-4"><button type="button" onclick="removeitem('${item.component_name}')">Remove</button></td>
//                         `
//                         ;
//                     inventoryTable.appendChild(row);
//                 });
//             }

//             renderTable(data);
//             searchInput.addEventListener('input', () => {
//                 const searchQuery = searchInput.value.toLowerCase();
//                 const filteredData = data.filter(item =>
//                     item.component_name.toLowerCase().includes(searchQuery) ||
//                     item.quantity.toString().includes(searchQuery)
//                 );
//                 renderTable(filteredData);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching product data:', error);
//         });

// function removeitem(name) {
// console.log(name);
// }
// });




document.addEventListener('DOMContentLoaded', () => {
    const inventoryTable = document.getElementById("inventoryTable");
    const searchInput = document.getElementById("searchInput");

    fetch("/data")
        .then(response => response.json())
        .then(data => {
            function renderTable(filteredData) {
                inventoryTable.innerHTML = "";
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.classList.add('bg-white', 'dark:bg-gray-800');
                    row.innerHTML = `
                        <td class="px-4 py-4">${item.component_name}</td>
                        <td class="px-6 py-4">${item.quantity}</td>
                        <td class="px-6 py-4">${item.descrip}</td>
                        <td class="px-6 py-4"> <a href="${item.link}" class="text-blue-400 cursor-pointer" target="_blank">Click to go Link</a></td>
                        <td class="px-6 py-4"><button type="button" 
                        class="text-white cursor-pointer bg-red-600 rounded-md py-2 px-3 hover:bg-red-900" 
                        onclick="removeitem('${item.component_name}', this)">Remove</button></td>
                    `;
                    inventoryTable.appendChild(row);
                });
            }

            renderTable(data);

            searchInput.addEventListener('input', () => {
                const searchQuery = searchInput.value.toLowerCase();
                const filteredData = data.filter(item =>
                    item.component_name.toLowerCase().includes(searchQuery) ||
                    item.quantity.toString().includes(searchQuery)
                );
                renderTable(filteredData);
            });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });

    window.removeitem = (name,buttonElement) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            console.log(name);
            fetch('/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ component_name: name })
            })
                .then(response => {
                    if (response.ok) {
                        const row = buttonElement.closest('tr');
                        row.remove();
                        console.log(`${name} removed successfully.`);
                    } else {
                        console.error('Failed to delete the item.');
                    }
                })
                .catch(error => {
                    console.error('Error during deletion:', error);
                });
        }
    };
});
