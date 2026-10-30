// Booking page: live price + validation

const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tourSelect = document.getElementById("tour");
const travellersInput = document.getElementById("travellers");
const totalBox = document.getElementById("total");
const message = document.getElementById("message");

// Returns the total price, 10% off for groups of 5 or more
function calculateTotal() {
    const price = Number(tourSelect.value);
    let people = Number(travellersInput.value);

    if (people < 1) people = 1;
    if (people > 12) people = 12;

    let total = price * people;
    let text = "Total: " + people + " × " + price + " USD = " + total + " USD";

    if (people >= 5) {
        total = Math.round(total * 0.9 * 100) / 100;
        text = "Total: " + people + " × " + price + " USD − 10% = " + total + " USD" +
               "<span>Group discount applied (5+ travellers)</span>";
    }

    totalBox.innerHTML = text;
    return total;
}

// "Book this tour" on the Home page opens booking.html?tour=120 — pre-select that tour
const tourFromUrl = new URLSearchParams(window.location.search).get("tour");
const tourValues = Array.from(tourSelect.options).map(function (option) { return option.value; });
if (tourValues.includes(tourFromUrl)) {
    tourSelect.value = tourFromUrl;
}

tourSelect.addEventListener("change", calculateTotal);
travellersInput.addEventListener("input", calculateTotal);
calculateTotal();

form.addEventListener("submit", function (event) {
    event.preventDefault();             // no page reload

    nameInput.classList.remove("error");
    emailInput.classList.remove("error");
    travellersInput.classList.remove("error");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const people = Number(travellersInput.value);
    let errors = [];

    if (name === "") {
        errors.push("Please enter your name.");
        nameInput.classList.add("error");
    }
    if (!email.includes("@")) {
        errors.push("Please enter a valid email (it must contain @).");
        emailInput.classList.add("error");
    }
    if (!Number.isInteger(people) || people < 1 || people > 12) {
        errors.push("Number of travellers must be from 1 to 12.");
        travellersInput.classList.add("error");
    }

    if (errors.length > 0) {
        message.className = "message error-msg";
        message.innerHTML = errors.join("<br>");
        return;
    }

    const total = calculateTotal();
    message.className = "message success-msg";
    message.textContent = "Thank you, " + name + "! Your request was received. Total: " + total + " USD.";
    form.reset();
    calculateTotal();
});
