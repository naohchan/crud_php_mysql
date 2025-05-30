<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "credentials.php";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("❌ Error conecting to database: " . $conn->connect_error);
}
