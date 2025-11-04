<?php
include 'db_connect.php'; // connection file

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'] ?? '';
    $specialization = $_POST['specialization'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $pharmacyAddress = $_POST['pharmacy-address'] ?? ''; // matches your form field name

    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, specialization, phone, pharmacyAddress) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $password, $role, $specialization, $phone, $pharmacyAddress]);
        echo "✅ Registration successful!";
    } catch (PDOException $e) {
        echo "❌ Error: " . $e->getMessage();
    }
}
?>
