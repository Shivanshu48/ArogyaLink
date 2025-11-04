<?php
$host = "localhost";
$dbname = "aroyalink_db"; // change this if your DB name is different
$username = "root";
$password = "Rohan@2005"; // leave blank if no password is set in MySQL

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "✅ Database connected successfully!";
} catch (PDOException $e) {
    die("❌ Database connection failed: " . $e->getMessage());
}
?>
