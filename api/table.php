<?php

require "../includes/init_database.php";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}

$allowedSorts = ['id', 'name', 'age', 'email'];
$allowedOrder = ['asc', 'desc'];

$sort = isset($_GET['sort']) && in_array($_GET['sort'], $allowedSorts) ? $_GET['sort'] : 'id';
$order = isset($_GET['order']) && in_array($_GET['order'], $allowedOrder) ? $_GET['order'] : 'asc';

$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? intval($_GET['limit']) : 10;
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, intval($_GET['page'])) : 1;

$offset = ($page - 1) * $limit;


//filters
$name = $_GET['name'] ?? '';
$email = $_GET['email'] ?? '';
$ageMin = $_GET['ageMin'] ?? '';
$ageMax = $_GET['ageMax'] ?? '';


$conditions = [];
if ($name !== '') {
    $nameSafe = $conn->real_escape_string($name);
    $conditions[] = "name LIKE '%$nameSafe%'";
}
if ($email !== '') {
    $emailSafe = $conn->real_escape_string($email);
    $conditions[] = "email LIKE '%$emailSafe%'";
}
if (is_numeric($ageMin)) {
    $conditions[] = "age >= " . intval($ageMin);
}
if (is_numeric($ageMax)) {
    $conditions[] = "age <= " . intval($ageMax);
}

$where = count($conditions) > 0 ? "WHERE " . implode(" AND ", $conditions) : "";
$sql = "SELECT * FROM clients $where ORDER BY $sort $order LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    echo "<tr id='fila-{$row['id']}'>
            <td>{$row['id']}</td>
            <td class='editable' data-field='name'>" . htmlspecialchars($row['name']) . "</td>
            <td class='editable' data-field='age'>" . htmlspecialchars($row['age']) . "</td>
            <td class='editable' data-field='email'>" . htmlspecialchars($row['email']) . "</td>
            <td>
                <button class='btn btn-sm btn-primary' style='width: 65px; height: 30px;' onclick='toggleEdition({$row['id']}, this)'>Edit</button>
                <button class='btn btn-sm btn-danger' style='width: 65px; height: 30px;' onclick='deleteCustomer({$row['id']})' >Delete</button>
            </td>
          </tr>";
}

$conn->close();
?>

