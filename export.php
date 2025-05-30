<?php
// 1. Include PhpSpreadsheet
// will load all the necessary libraries
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

// 2. DB connection
$conn = new mysqli('localhost', 'root', 'naohchan', 'customerdb'); // Ajusta tus credenciales si es necesario

// 3. Getting filters from frontend 
$name = $_GET['name'] ?? '';
$email = $_GET['email'] ?? '';
$ageMin = $_GET['ageMin'] ?? 0;
$ageMax = $_GET['ageMax'] ?? 150;

// 4. Prepare the SQL query using filters
$sql = "SELECT id, name, age, email FROM clients 
        WHERE name LIKE ? AND email LIKE ? AND age BETWEEN ? AND ?";
$stmt = $conn->prepare($sql);

// 5. Change placeholders with filtered values
$name = "%$name%";
$email = "%$email%";
$stmt->bind_param('ssii', $name, $email, $ageMin, $ageMax);
$stmt->execute();
$result = $stmt->get_result();

// 6. Create a spreadsheet file
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// 7. Headers
$sheet->fromArray(['ID', 'Name', 'Age', 'Email'], NULL, 'A1');

// 8. Add data from DB
$rowIndex = 2;
while ($row = $result->fetch_assoc()) {
    $sheet->fromArray(array_values($row), NULL, "A{$rowIndex}");
    $rowIndex++;
}

// 9. Send the file like a csv download file 
header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename="customer_filtered.csv"');
header('Cache-Control: max-age=0');

$writer = new Csv($spreadsheet);
$writer->save('php://output'); // Download directly on browser
exit;