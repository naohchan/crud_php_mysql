<?php
// 1. Include PhpSpreadsheet
// will load all the necessary libraries
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

// 2. DB connection
$conn = new mysqli('localhost', 'root', 'naohchan', 'customerdb'); // Ajusta tus credenciales si es necesario

// 3. Obtener los filtros desde el frontend
$name = $_GET['name'] ?? '';
$email = $_GET['email'] ?? '';
$ageMin = $_GET['ageMin'] ?? 0;
$ageMax = $_GET['ageMax'] ?? 150;

// 4. Preparar la consulta SQL usando filtros
$sql = "SELECT id, name, age, email FROM clients 
        WHERE name LIKE ? AND email LIKE ? AND age BETWEEN ? AND ?";
$stmt = $conn->prepare($sql);

// 5. Reemplazar los placeholders con los valores filtrados
$name = "%$name%";    // Para usar con LIKE
$email = "%$email%";
$stmt->bind_param('ssii', $name, $email, $ageMin, $ageMax);
$stmt->execute();
$result = $stmt->get_result();

// 6. Crear un archivo de hoja de cálculo
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// 7. Encabezados
$sheet->fromArray(['ID', 'Name', 'Age', 'Email'], NULL, 'A1');

// 8. Agregar los datos de la base de datos
$rowIndex = 2;
while ($row = $result->fetch_assoc()) {
    $sheet->fromArray(array_values($row), NULL, "A{$rowIndex}");
    $rowIndex++;
}

// 9. Enviar el archivo como descarga CSV
header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename="clientes_filtrados.csv"');
header('Cache-Control: max-age=0');

$writer = new Csv($spreadsheet);
$writer->save('php://output'); // Lo descarga directamente al navegador
exit;
