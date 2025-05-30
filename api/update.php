<?php
require "../includes/conexion.php";

$id = $_POST['id'] ?? null;
$field = $_POST['field'] ?? null;
$value = $_POST['value'] ?? null;

$fieldsPermitidos = ['name', 'age', 'email'];

if (!$id || !$field || !$value || !in_array($field, $fieldsPermitidos)) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$stmt = $conn->prepare("UPDATE clients SET $field = ? WHERE id = ?");
$stmt->bind_param("si", $value, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error in DB']);
}

?>