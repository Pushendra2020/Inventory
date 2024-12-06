document.addEventListener("DOMContentLoaded", () => {
    const detailsTable = document.getElementById("returnTable");

    fetch("/returnShowData")
        .then(response => response.json())
        .then(data => {
            detailsTable.innerHTML = ""; 
            data.forEach(item => {
                item.components.forEach((component, index) => {
                    const row = document.createElement('tr');
                    row.classList.add('bg-white', 'dark:bg-gray-800');
                    if (index === 0) {
                        row.innerHTML = `
                            <td class="px-4 py-4" rowspan="${item.components.length}">${item.user_name}</td>
                            <td class="px-4 py-4" rowspan="${item.components.length}">${item.prn}</td>
                            <td class="px-4 py-4">${component.component_name}</td>
                            <td class="px-6 py-4">${component.quantity}</td>
                            <td class="px-6 py-4">${component.return_date}</td>
                        `;
                    } else {
                        row.innerHTML = `
                            <td class="px-4 py-4">${component.component_name}</td>
                            <td class="px-6 py-4">${component.quantity}</td>
                            <td class="px-6 py-4">${component.return_date}</td>
                        `;
                    }
                    detailsTable.appendChild(row);
                });
            });
        })
});
