document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Please fill in all fields!");
    return;
  }

  try {
    const response = await fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("✅ Login successful!");

      switch (result.role) {
        case "doctor":
          window.location.href = "doctordashboard.html";
          break;
        case "pharmacy":
          window.location.href = "pharmacy_dashboard.html";
          break;
        default:
          window.location.href = "patientdashboard.html";
      }
    } else {
      alert("❌ " + result.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("⚠️ Server error. Please try again later.");
  }
});
