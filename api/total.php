<?php
require "../includes/init_database.php";
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['total' => 0]));
}

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

$sql = "SELECT COUNT(*) as total FROM clients $where";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

echo json_encode(['total' => $row['total']]);
$conn->close();
?>