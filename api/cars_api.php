<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'database.php';
include '../class/car.php';

// Create database connection
$database = new Database();
$db = $database->getConnection();

// Initialize car class
$car = new Car($db);

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $carData = $car->getCarById($_GET['id']);
            if ($carData) {
                echo json_encode(["status" => "success", "car" => $carData]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Car not found"]);
            }
        } else {
            $cars = $car->getAllCars();
            echo json_encode(["status" => "success", "cars" => $cars]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['model']) || !isset($data['price']) || !isset($data['year']) || !isset($data['condition']) || !isset($data['mileage'])) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Missing required fields. Please provide model, price, year, condition, and mileage."
            ]);
            break;
        }

        try {
            $result = $car->addCar($data['model'], $data['price'], $data['year'], $data['condition'], $data['mileage']);
            if ($result) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Car created successfully",
                    "car_id" => $result
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to create car"
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Error creating car: " . $e->getMessage()
            ]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id']) || !isset($data['model']) || !isset($data['price']) || !isset($data['year']) || !isset($data['condition']) || !isset($data['mileage'])) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Missing required fields. Please provide id, model, price, year, condition, and mileage."
            ]);
            break;
        }
        try {
            $result = $car->updateCar($data['id'], $data['model'], $data['price'], $data['year'], $data['condition'], $data['mileage']);
            if ($result) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Car updated successfully"
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    "status" => "error",
                    "message" => "Car not found or no changes made"
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Error updating car: " . $e->getMessage()
            ]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Missing car ID."
            ]);
            break;
        }
        try {
            $result = $car->deleteCar($_GET['id']);
            if ($result) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Car deleted successfully"
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    "status" => "error",
                    "message" => "Car not found"
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Error deleting car: " . $e->getMessage()
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid request method"
        ]);
}