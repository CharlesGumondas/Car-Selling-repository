document.querySelector(".book-btn").addEventListener("click", function () {
    console.log("Book Now button clicked!"); // Debugging log

    // Retrieve form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();

    // Retrieve the selected payment type
    const paymentType = document.querySelector('input[name="payment"]:checked').nextSibling.textContent.trim();

    // Retrieve the selected monthly payment plan if paymentType is "installment"
    const monthlyPayment = paymentType === "Installment Payment"
        ? document.querySelector('input[name="term"]:checked').nextSibling.textContent.trim()
        : "N/A";

    console.log("Form values:", { name, phone, address, city, paymentType, monthlyPayment }); // Debugging log

    // Validate inputs
    if (!name || !phone || !address || !city || !paymentType) {
        alert("Please fill out all fields.");
        return;
    }

    // Combine address and city into a single field
    const fullAddress = `${address}, ${city}`;

    // Create a billing info object
    const billingInfo = {
        name,
        phone,
        fullAddress, // Use the combined address
        paymentType,
        monthlyPayment,
    };

    console.log("Billing info object:", billingInfo); // Debugging log

    // Retrieve existing data from local storage
    const existingData = JSON.parse(localStorage.getItem("billingData")) || [];
    console.log("Existing data:", existingData); // Debugging log

    // Add the new billing info to the existing data
    existingData.push(billingInfo);

    // Save the updated data back to local storage
    localStorage.setItem("billingData", JSON.stringify(existingData));
    console.log("Data saved to localStorage."); // Debugging log

    // Notify the user
    alert("Booking successful! Thank you for choosing Drive Ease.");

    // Redirect to the client page
    window.location.href = "clientPage.html";
});