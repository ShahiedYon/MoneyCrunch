document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("lead-form");
  const phoneInput = document.getElementById("phone");

  // Auto-format phone number (US style)
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 10);

    let formatted = value;
    if (value.length > 6) {
      formatted = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length > 3) {
      formatted = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    }

    e.target.value = formatted;
  });

  // Simple validation before submit
  form.addEventListener("submit", function (e) {
    const debt = document.getElementById("debtRange").value;

    if (!debt) {
      e.preventDefault();
      alert("Please select your debt amount.");
      return;
    }
  });
});