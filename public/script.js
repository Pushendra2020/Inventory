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
});
