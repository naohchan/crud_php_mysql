<?php
// Show errors in display
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "credentials.php";

// Step 1: Conection to server (no DB)
$conn = new mysqli($host, $user, $password);
if ($conn->connect_error) {
    die("❌ Error of conection: " . $conn->connect_error);
}

// Step 2: Creating db if not exist
if (!$conn->query("CREATE DATABASE IF NOT EXISTS $dbname")) {
    die("❌ Error creating database: " . $conn->error);
}

// Step 3: SELECT database
$conn->select_db($dbname);

// Step 4: Create tabla if not exists
$createTableSQL = "
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    email VARCHAR(100)
)";

if (!$conn->query($createTableSQL)) {
    error_log("❌ Error creating table 'customers': " . $conn->error);
    http_response_code(500);
    die("❌ Error in server.");
}

// Step 5: Verify if no data
$result = $conn->query("SELECT COUNT(*) as total FROM clients");
$row = $result->fetch_assoc();
$total = $row['total'];


if ($total <= 0) {
    $stmt = $conn->prepare("INSERT INTO clients (name, age, email) VALUES (?, ?, ?)");
    for ($i = 1; $i <= 10000; $i++) {
        $name = "client_$i";
        $age = rand(18, 100);
        $email = "client_$i@example.com";
        $stmt->bind_param("sis", $name, $age, $email);
        $stmt->execute();
    }
    $stmt->close();
}

$conn->close();
?>