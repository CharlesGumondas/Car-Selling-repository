const tableBody = document.querySelector("tbody");

// Fetch car data from the API
async function fetchCars() {
    try {
        const response = await fetch("api/cars_api.php"); // Adjust the path if necessary
        const data = await response.json();

        if (data.status === "success") {
            populateTable(data.cars);
        } else {
            console.error("Failed to fetch cars:", data.message);
        }
    } catch (error) {
        console.error("Error fetching cars:", error);
    }
}

// Populate the table with car data
function populateTable(cars) {
    tableBody.innerHTML = ""; // Clear existing rows
    cars.forEach(car => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="car-cell">
                <img src="${car.image || 'pictures/default.png'}" alt="${car.model}" class="car-img">
                <div class="car-details">
                    <span class="car-model">${car.model}</span>
                    <span class="car-type">${car.type || 'N/A'}</span>
                </div>
            </td>
            <td>₱ ${car.price.toLocaleString()}</td>
            <td>${car.year}</td>
            <td>${car.condition}</td>
            <td>${car.mileage.toLocaleString()} km</td>
            <td>
                <button class="btn btn-edit" data-id="${car.id}">Edit</button>
                <button class="btn btn-delete" data-id="${car.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for Edit and Delete buttons
    addActionListeners();
}

// Add event listeners to Edit and Delete buttons
function addActionListeners() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", () => {
            const carId = button.getAttribute("data-id");
            editCar(carId);
        });
    });

    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", () => {
            const carId = button.getAttribute("data-id");
            deleteCar(carId);
        });
    });
}

// Edit car functionality
function editCar(carId) {
    alert(`Edit car with ID: ${carId}`);
    // Redirect to an edit page or open a modal for editing
}

// Delete car functionality
async function deleteCar(carId) {
    if (confirm("Are you sure you want to delete this car?")) {
        try {
            const response = await fetch(`api/cars_api.php?id=${carId}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (data.status === "success") {
                alert("Car deleted successfully!");
                fetchCars(); // Refresh the table
            } else {
                alert("Failed to delete car: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    }
}

// Fetch cars on page load
fetchCars();