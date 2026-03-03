<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow local testing

// --- UPDATE THESE WITH YOUR cPanel DATABASE CREDENTIALS --- //
$host = 'localhost';
$db   = 'your_cpanel_database_name';
$user = 'your_cpanel_database_user';
$pass = 'your_cpanel_database_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Attempt to connect. Note: This will fail if running locally without MySQL
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // If database connection fails, fall back to mock data for demonstration
    // In production on cPanel, you would want to `throw new \PDOException($e->getMessage(), (int)$e->getCode());`
    echo file_get_contents('../assets/data/products.json'); 
    exit;
}

// If connection successful, fetch from DB
$stmt = $pdo->query('SELECT * FROM products');
$products = $stmt->fetchAll();

// Convert 'is_prime' from tinyint (0/1) to boolean for JS compatibility
foreach ($products as &$product) {
    $product['prime'] = (bool)$product['is_prime'];
    $product['price'] = (int)$product['price'];
    $product['rating'] = (float)$product['rating'];
    $product['reviewCount'] = (int)$product['review_count'];
    
    // Clean up snake_case db columns
    unset($product['is_prime']);
    unset($product['review_count']);
}

echo json_encode($products);
?>
