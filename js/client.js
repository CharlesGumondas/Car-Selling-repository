
                // Retrieve data from local storage
                let billingData = JSON.parse(localStorage.getItem("billingData")) || [];
            
                // Check if the table body exists
                const tableBody = document.getElementById("billing-table");
                const modal = document.getElementById("edit-modal");
                const closeModal = document.querySelector(".close-btn");
                const saveChangesBtn = document.getElementById("save-changes");
            
                let currentEditIndex = null; // To track the index of the record being edited
            
                if (tableBody) {
    // Populate the table
    billingData.forEach((info, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${info.name}</td>
            <td>${info.phone}</td>
            <td>${info.fullAddress}</td>
            <td>${info.paymentType === "Installment Payment" ? "Installment" : "Cash"}</td>
            <td>${info.paymentType === "Installment Payment" ? info.monthlyPayment : "N/A"}</td>
            <td>
                <button class="action-btn edit-btn" data-index="${index}">Edit</button>
                <button class="action-btn delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
            
                    // Add event listener to handle delete and edit button clicks
                    tableBody.addEventListener("click", function (event) {
                        const target = event.target;
            
                        // Handle delete button
                        if (target.classList.contains("delete-btn")) {
                            const index = target.getAttribute("data-index"); // Get the index of the row
                            billingData.splice(index, 1); // Remove the item from the array
                            localStorage.setItem("billingData", JSON.stringify(billingData)); // Update localStorage
                            target.closest("tr").remove(); // Remove the row from the table
                            alert("Record deleted successfully!");
                        }
            
                        // Handle edit button
                        if (target.classList.contains("edit-btn")) {
                            const index = target.getAttribute("data-index"); // Get the index of the row
                            const info = billingData[index]; // Get the data for the selected row
                            currentEditIndex = index; // Store the index for saving changes
            
                            // Populate the modal fields
                            document.getElementById("edit-name").value = info.name;
                            document.getElementById("edit-phone").value = info.phone;
                            document.getElementById("edit-address").value = info.fullAddress;
                            document.getElementById("edit-payment-type").value = info.paymentType;
                            document.getElementById("edit-monthly-payment").value = info.paymentType === "Installment Payment" ? info.monthlyPayment : "";
            
                            // Show or hide the monthly payment field based on payment type
                            const monthlyPaymentGroup = document.getElementById("edit-monthly-payment-group");
                            if (info.paymentType === "Installment Payment") {
                                monthlyPaymentGroup.style.display = "block";
                            } else {
                                monthlyPaymentGroup.style.display = "none";
                            }
            
                            // Show the modal
                            modal.style.display = "block";
                        }
                    });
            
                    // Handle save changes button
                    saveChangesBtn.addEventListener("click", function () {
                        const newName = document.getElementById("edit-name").value.trim();
                        const newPhone = document.getElementById("edit-phone").value.trim();
                        const newAddress = document.getElementById("edit-address").value.trim();
                        const newPaymentType = document.getElementById("edit-payment-type").value;
                        const newMonthlyPayment = newPaymentType === "Installment Payment"
                            ? document.getElementById("edit-monthly-payment").value.trim()
                            : "N/A";
            
                        // Update the data in the array
                        billingData[currentEditIndex] = {
                            name: newName,
                            phone: newPhone,
                            fullAddress: newAddress,
                            paymentType: newPaymentType,
                            monthlyPayment: newMonthlyPayment,
                        };
            
                        // Update localStorage
                        localStorage.setItem("billingData", JSON.stringify(billingData));
            
                        // Reload the table
                        alert("Record updated successfully!");
                        location.reload();
                    });
            
                    // Close the modal
                    closeModal.addEventListener("click", function () {
                        modal.style.display = "none";
                    });
            
                    // Close the modal when clicking outside of it
                    window.addEventListener("click", function (event) {
                        if (event.target === modal) {
                            modal.style.display = "none";
                        }
                    });
                } else {
                    console.error("Table body with ID 'billing-table' not found.");
                }
        