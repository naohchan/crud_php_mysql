let sortCurrent = 'asc';
let columnCurrent = 'id';
let currentPage = 1;
let registersPerPage = 10;

function sorting(column) {
    // Alternate order
    if (column === columnCurrent) {
        sortCurrent = (sortCurrent === 'asc') ? 'desc' : 'asc';
    } else {
        columnCurrent = column;
        sortCurrent = 'asc';
    }
    loadTable(columnCurrent, sortCurrent);
}

function loadTable(sort, order,filters = {}) {
    const tbody = document.getElementById("tabla-clientes");
        
    // Show loader as a table row
    tbody.innerHTML = `
        <tr>
        <td colspan="5" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2">Loading Data</div>
        </td>
        </tr>
    `;

    // build params
    const params = new URLSearchParams({
        sort: sort,
        order: order,
        page: currentPage, //<--check the current page
        limit: registersPerPage,//<- check 
        name: filters.name || '',
        email: filters.email || '',
        ageMin: filters.ageMin || '',
        ageMax: filters.ageMax || ''
    });
    // request GET to table.php with the params
    fetch(`api/table.php?${params.toString()}`)
        .then(res => res.text())
        .then(html => {
            tbody.innerHTML = html;
            //update pagination buttons
            updatePagination();

        })
        .catch(error => {
            tbody.innerHTML = "<tr><td colspan='4' class='text-center text-danger'>❌ Error at loading table</td></tr>";
            console.error("Error at loading table:", error);
        });
}
//update pagination buttons in dinamyc table
function updatePagination() {
    // search for elements where 
    const container = document.getElementById("pagination");
    // Stop if they don't exist
    if (!container) return;

    // getting the filter values
    const name = document.getElementById("filterName").value.trim();
    const email = document.getElementById("filterEmail").value.trim();
    const ageMin = document.getElementById("ageMin").value.trim();
    const ageMax = document.getElementById("ageMax").value.trim();

    // send request to total.php
    fetch(`api/total.php?name=${name}&email=${email}&ageMin=${ageMin}&ageMax=${ageMax}`)
        .then(res => res.json())
        .then(data => {
            // calculate the number of registers
            const totalRegistros = data.total;
            //round up the number of pages
            const totalPages = Math.ceil(totalRegistros / registersPerPage);

            // if we have content, we update the count of registers
            const recordCount = document.getElementById("recordCount");
            if (recordCount) {
                recordCount.textContent = `Number of records: ${totalRegistros}`;
            }

            //clean the actual pagination
            container.innerHTML = '';
            
            // button previous
            const liPrev = document.createElement('li');
            // if curren page is 1, is disabled
            liPrev.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
            liPrev.innerHTML = `<a class="page-link" href="#">«</a>`;
            liPrev.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    loadTable(columnCurrent, sortCurrent);
                }
            };
            container.appendChild(liPrev);

            // Dynamic range of pages
            const rango = 3;
            let start = Math.max(1, currentPage - rango);
            let end = Math.min(totalPages, currentPage + rango);

            if (start > 1) {
                container.appendChild(createButtonPage(1));
                if (start > 2) container.appendChild(createEllipsis());
            }

            for (let i = start; i <= end; i++) {
                container.appendChild(createButtonPage(i));
            }

            if (end < totalPages) {
                if (end < totalPages - 1) container.appendChild(createEllipsis());
                container.appendChild(createButtonPage(totalPages));
            }

            // Botón next
            const liNext = document.createElement('li');
            liNext.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
            liNext.innerHTML = `<a class="page-link" href="#">»</a>`;
            liNext.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    loadTable(columnCurrent, sortCurrent);
                }
            };
            container.appendChild(liNext);
        });
}

// create button pagination for an specific page
function createButtonPage(page) {
    const li = document.createElement('li');
    li.className = 'page-item' + (page === currentPage ? ' active' : '');
    li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
    li.onclick = () => {
        currentPage = page;
        loadTable(columnCurrent, sortCurrent);
    };
    // return the <li> element and ready to insert it in DOM 
    return li;
}

// create (...) to show there are intermediate pages
function createEllipsis() {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = `<span class="page-link">...</span>`;
    return li;
}

function loadGraphAge() {
    // GET request to age_stats.php that should response with a json
    fetch('api/age_stats.php')
        .then(res => res.json())
        .then(data => {
            // extract age and count
            const ages = data.map(item => item.age);
            const quantities = data.map(item => item.count);
            // get the canvas
            const ctx = document.getElementById('ageChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar', // bar graphics
                data: {
                    labels: ages,
                    datasets: [{
                        label: 'Customers by Age',
                        data: quantities, // customers per age
                        // graph style
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        // because we just have 1 serie
                        legend: { display: false },
                        //tittle of graph
                        title: {
                            display: true,
                            text: 'Customer distributions by Age'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {stepSize: 1}
                        }
                    }
                }
            });
        });
}


function filter() {
    const name = document.getElementById("filterName").value.trim();
    const email = document.getElementById("filterEmail").value.trim();
    const ageMin = document.getElementById("ageMin").value.trim();
    const ageMax = document.getElementById("ageMax").value.trim();

    loadTable(columnCurrent, sortCurrent, {
        name,
        email,
        ageMin,
        ageMax
    });
}

function addCustomer(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("newName").value.trim();
    const age = document.getElementById("newAge").value.trim();
    const email = document.getElementById("newEmail").value.trim();

    if (!name || !age || !email) {
        alert("Please complete all fields.");
        return false;
    }

    fetch('api/create.php', {
        method: 'POST',
        // using traditional format
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            name: name,
            age: age,
            email: email
        })
    })
    .then(res => res.text())
    .then(text => {
        console.log("Raw answer", text);
        try {
            const data = JSON.parse(text);
            if (data.success) {
                alert("✅ Customer added");
                // AFTER SUCCESS, WE CLEAN THE FIELDS
                document.getElementById("newName").value = "";
                document.getElementById("newAge").value = "";
                document.getElementById("newEmail").value = "";
                // load again the table
                loadTable(columnCurrent, sortCurrent);
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (e) {
            console.error("❌ JSON malformed:", e);
            alert("❌ Invalid answer of server");
        }
    })
    .catch(err => {
        console.error("❌ Error of red:", err);
        alert("❌ Error of red or of the server");
    });

    return false; // to not reload
}

function toggleEdition(id, button) {
    const fila = document.getElementById(`fila-${id}`);
    const celdas = fila.querySelectorAll('.editable');

    if (button.textContent === 'Edit') {
        // Activate edition fields
        celdas.forEach(td => {
            td.setAttribute('contenteditable', 'true');
            td.classList.add('bg-warning');
        });
        // change the button name and class
        button.textContent = 'Save';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');

    } else {
            
        // Save changes
        // create an empty array
        const data = {};
        // store the data with the values
        celdas.forEach(td => {
            const field = td.dataset.field;
            const value = td.textContent.trim();
            data[field] = value;
        });
        //do fetch per any field
        Promise.all(
            Object.entries(data).map(([field, value]) => {
            return fetch('api/update.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ id, field, value })
            }).then(res => res.json());
        })).then(results => {
            if (results.every(r => r.success)) {
                alert('✅ Changes saved!');
                celdas.forEach(td => {
                    td.removeAttribute('contenteditable');
                    td.classList.remove('bg-warning');
                });
                button.textContent = 'Edit';
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            } else {
                alert('❌ There was a problem at saving');
            }
        }).catch(err => {
            console.error(err);
            alert('❌ Error of red');
        });
    }
}

function deleteCustomer(id) {
                
    if (!confirm("¿Are you sure you want to delete this customer?")) return;

        fetch('api/delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
                body: new URLSearchParams({ id: id })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("🗑️ Customer deleted successfully");
                    loadTable(columnCurrent, sortCurrent);
                } else {
                    alert("❌ Error: " + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("❌ Error of red");
            });
}


function exportData() {
    const name = document.getElementById('filterName').value;
    const email = document.getElementById('filterEmail').value;
    const ageMin = document.getElementById('ageMin').value || 0;
    const ageMax = document.getElementById('ageMax').value || 150;

    const url = `export.php?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&ageMin=${ageMin}&ageMax=${ageMax}`;
    window.open(url, '_blank');
}

// At loading the page, bring the initial table
document.addEventListener("DOMContentLoaded", () => {
    loadTable(columnCurrent, sortCurrent);
        
    document.getElementById("recordsPerPage").addEventListener("change", e => {
        registersPerPage = parseInt(e.target.value);
        currentPage = 1;
        loadTable(columnCurrent, sortCurrent);
    });
        
    document.getElementById("filterName").addEventListener("input", filter);
    document.getElementById("filterEmail").addEventListener("input", filter);
    document.getElementById("ageMin").addEventListener("input", filter);
    document.getElementById("ageMax").addEventListener("input", filter);

    // Activate graph at changing to tab "Analytics"
    const tabAnalytics = document.querySelector('button[data-bs-target="#analytics"]');
    if (tabAnalytics) {
        tabAnalytics.addEventListener('shown.bs.tab', () => {
            loadGraphAge();
        });
    }

});