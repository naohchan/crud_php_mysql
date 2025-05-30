<?php
require "../includes/init_database.php";
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Error of connection"]));
}

$sql = "SELECT age, COUNT(*) as count FROM clients GROUP BY age ORDER BY age";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);
$conn->close();
?>