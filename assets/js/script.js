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

    // Construir parámetros
    const params = new URLSearchParams({
        sort: sort,
        order: order,
        page: currentPage, //<--
        limit: registersPerPage,//<- check
        name: filters.name || '',
        email: filters.email || '',
        ageMin: filters.ageMin || '',
        ageMax: filters.ageMax || ''
    });

    fetch(`api/table.php?${params.toString()}`)
        .then(res => res.text())
        .then(html => {
            tbody.innerHTML = html;
            updatePagination();

        })
        .catch(error => {
            tbody.innerHTML = "<tr><td colspan='4' class='text-center text-danger'>❌ Error at loading table</td></tr>";
            console.error("Error at loading table:", error);
        });
}

function updatePagination() {
    const container = document.getElementById("pagination");
    if (!container) return;

    const name = document.getElementById("filterName").value.trim();
    const email = document.getElementById("filterEmail").value.trim();
    const ageMin = document.getElementById("ageMin").value.trim();
    const ageMax = document.getElementById("ageMax").value.trim();

    fetch(`api/total.php?name=${name}&email=${email}&ageMin=${ageMin}&ageMax=${ageMax}`)
        .then(res => res.json())
        .then(data => {
            const totalRegistros = data.total;
            const totalPages = Math.ceil(totalRegistros / registersPerPage);


            const recordCount = document.getElementById("recordCount");
            if (recordCount) {
                recordCount.textContent = `Number of records: ${totalRegistros}`;
            }

            container.innerHTML = '';
            
            // Botón previous
            const liPrev = document.createElement('li');
            liPrev.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
            liPrev.innerHTML = `<a class="page-link" href="#">«</a>`;
            liPrev.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    loadTable(columnCurrent, sortCurrent);
                }
            };
            container.appendChild(liPrev);

            // Rango dinámico de páginas
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

function createButtonPage(page) {
    const li = document.createElement('li');
    li.className = 'page-item' + (page === currentPage ? ' active' : '');
    li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
    li.onclick = () => {
        currentPage = page;
        loadTable(columnCurrent, sortCurrent);
    };
    return li;
}

function createEllipsis() {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = `<span class="page-link">...</span>`;
    return li;
}

function loadGraphAge() {
    fetch('api/age_stats.php')
        .then(res => res.json())
        .then(data => {
            const ages = data.map(item => item.age);
            const quantities = data.map(item => item.count);

            const ctx = document.getElementById('ageChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ages,
                    datasets: [{
                        label: 'Customers by Age',
                        data: quantities,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
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

                    document.getElementById("newName").value = "";
                    document.getElementById("newAge").value = "";
                    document.getElementById("newEmail").value = "";

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

    function toggleEdition(id, boton) {
        const fila = document.getElementById(`fila-${id}`);
        const celdas = fila.querySelectorAll('.editable');

        if (boton.textContent === 'Edit') {
            // Activar edición
            celdas.forEach(td => {
                td.setAttribute('contenteditable', 'true');
                td.classList.add('bg-warning');
            });

            boton.textContent = 'Save';
            boton.classList.remove('btn-primary');
            boton.classList.add('btn-success');

        } else {
            
            // Save changes
            const data = {};
            celdas.forEach(td => {
                const field = td.dataset.field;
                const value = td.textContent.trim();
                data[field] = value;
            });

            Promise.all(Object.entries(data).map(([field, value]) => {
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
                    boton.textContent = 'Edit';
                    boton.classList.remove('btn-success');
                    boton.classList.add('btn-primary');
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


function exportarTodo() {
    const name = document.getElementById('filterName').value;
    const email = document.getElementById('filterEmail').value;
    const ageMin = document.getElementById('ageMin').value || 0;
    const ageMax = document.getElementById('ageMax').value || 150;

    const url = `export.php?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&edadMin=${ageMin}&edadMax=${ageMax}`;
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