<!DOCTYPE html>
<html>
    <head>
        <title>CRUD system</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="assets/css/styles.css"> <!-- CSS separado -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>

    <body class="p-4">

        <nav class="navbar navbar-custom px-3">
            <a class="navbar-brand" href="crud.php">
                <img src="https://kurvekiosks.com/wp-content/uploads/Kurve-Logo-Rainbow-v1.svg" alt="Logo" width="150" height="60" class="d-inline-block align-text-top">
            </a>
            <span class="ms-auto text-primary fs-5">Welcome, Admin</span>
        </nav>

        <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="database-tab" data-bs-toggle="tab" data-bs-target="#database" type="button" role="tab">Database</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="analytics-tab" data-bs-toggle="tab" data-bs-target="#analytics" type="button" role="tab">Analytics</button>
            </li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane fade show active" id="database" role="tabpanel" >
                <!-- Database -->
                <div class="row">
                    <div class="col-md-12">
                        <h4>Filter</h4>
                    </div>

                    <div class="col-md-3">
                        <input type="text" id="filterName" placeholder="Name" class="form-control mb-2">
                    </div>

                    <div class="col-md-3">
                        <input type="text" id="filterEmail" placeholder="Email" class="form-control mb-2">
                    </div>

                    <div class="col-md-3">
                        <input type="number" id="ageMin" placeholder="Min. age" class="form-control mb-2">
                    </div>
                    <div class="col-md-3">
                        <input type="number" id="ageMax" placeholder="Max. age" class="form-control mb-2">                    
                    </div>
                            
                    <div class="text-white me-3" id="recordCount">Number of records: ...</div>

                    <div class="col-md-7">

                        <h4>Customers</h4>
                        <?php
                            // lógica para invertir orden
                            $toggleOrder = ($order === 'asc') ? 'desc' : 'asc';
                        ?>
                        <!--<p>Orden actual: <?= $sort ?> (<?= $order ?>)</p> -->
                        
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            

                            <div>
                                <label for="recordsPerPage">Show records: </label>
                                <select id="recordsPerPage" class="form-select d-inline-block w-auto">
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>

                            <div id="pagination" class="pagination pagination-sm"></div>
                        </div>

                        <table class="table table-bordered table-hover table-sm">
                            <thead>
                                <tr>
                                <!--<th><a href="#" onclick="sorting('id')">ID</a></th>-->
                                <th>ID <span onclick="sorting('id')">↕️</span></th>
                                <th><a href="#" onclick="sorting('name')">Name</a></th>
                                <th><a href="#" onclick="sorting('age')">Age</a></th>
                                <th><a href="#" onclick="sorting('email')">Email</a></th>
                                <th> Admin action</th>
                                </tr>
                            </thead>

                            <tbody id="tabla-clientes">
                                <!-- It would load dinamically -->
                            </tbody>
                        </table>
                        <button class="btn btn-success mb-3" onclick="exportData()">Exportar todo (filtro actual)</button>

                    </div>
                    
                    <div class="col-md-5">
                        <h4>Add new user</h4>
                        <form id="formNewCustomer" onsubmit="return addCustomer();">
                            <input id="newName" name="name" placeholder="Name" class="form-control mb-2" required>
                            <input id="newAge" name="age" type="number" placeholder="Age" class="form-control mb-2" required>
                            <input id="newEmail" name="email" type="email" placeholder="Email" class="form-control mb-2" required>
                            <button type="submit" class="btn btn-success">Add</button>
                        </form>
                    </div>

                </div>

            </div>

            <div class="tab-pane fade" id="analytics" role="tabpanel">
                <canvas id="ageChart"></canvas>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="assets/js/script.js"></script>
        
        <footer class="text-center mt-4">
            <p> Designed by <a href="https://github.com/naohchan">Naohchan</a> </p>
        </footer>
    
    </body>
</html>

<?php
    //$conn->close();
?>