<?php
require '../includes/conexion.php';

header('Content-Type: application/json');

$name = $_POST['name'] ?? '';
$age = $_POST['age'] ?? '';
$email = $_POST['email'] ?? '';

// Validación simple
if ($name === '' || $email === '' || !is_numeric($age)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO clients (name, age, email) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $name, $age, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Customer inserted correctly"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error at inserting"]);
}

$stmt->close();
$conn->close();