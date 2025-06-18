// Navigation
document.getElementById("ViewResultsId")?.addEventListener("click", () => {
  location.href = "ViewResult.html";
});
document.getElementById("fillOutId")?.addEventListener("click", () => {
  location.href = "Index.html";
});

// Handle form submission
const form = document.getElementById("surveyForm");
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    // ✅ Correctly handle multiple checkboxes as array
    const foodCheckboxes = document.querySelectorAll("input[name='food']:checked");
    data.food = Array.from(foodCheckboxes).map(cb => cb.value);

    fetch("http://localhost:3000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) throw new Error("Submission failed");
        return response.text();
      })
      .then(() => {
        window.location.href = "ViewResult.html";
      })
      .catch(error => {
        alert("Error: " + error.message);
      });
  });
}
// Wait for the DOM to load
window.addEventListener("DOMContentLoaded", function () {
  const today = new Date();

  // Create date range based on age rules
  const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

  // Format the date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const dobInput = document.getElementById("dob");
  if (dobInput) {
    dobInput.min = formatDate(minDate);
    dobInput.max = formatDate(maxDate);
  }
});
