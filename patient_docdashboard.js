// Simulated Data for Patients
const doctors = [
  { name: "Dr. Asha Sharma", specialization: "Cardiologist" },
  { name: "Dr. Rajesh Kumar", specialization: "Dermatologist" },
  { name: "Dr. Priya Mehta", specialization: "General Physician" }
];

const appointments = [
  { doctor: "Dr. Asha Sharma", date: "2025-11-05", time: "10:00 AM", status: "Confirmed" },
  { doctor: "Dr. Rajesh Kumar", date: "2025-11-06", time: "2:00 PM", status: "Pending" }
];

// Display Doctors
const doctorList = document.getElementById("doctorList");
if (doctorList) {
  doctors.forEach(doc => {
    doctorList.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 text-center">
          <h5>${doc.name}</h5>
          <p class="text-muted">${doc.specialization}</p>
          <button class="btn btn-primary" onclick="scheduleCall('${doc.name}')">Schedule Call</button>
        </div>
      </div>`;
  });
}

// Display Appointments (Patient)
const appointmentTable = document.getElementById("appointmentTable");
if (appointmentTable) {
  appointments.forEach(a => {
    appointmentTable.innerHTML += `
      <tr>
        <td>${a.doctor}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>${a.status}</td>
      </tr>`;
  });
}

// Doctor Dashboard: Appointments
const doctorAppointments = document.getElementById("doctorAppointments");
if (doctorAppointments) {
  appointments.forEach(a => {
    doctorAppointments.innerHTML += `
      <tr>
        <td>${a.doctor === "Dr. Asha Sharma" ? "Suhani" : "Ravi"}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="joinCall()">Join Call</button>
          <button class="btn btn-primary btn-sm" onclick="openPrescription('${a.doctor === 'Dr. Asha Sharma' ? 'Suhani' : 'Ravi'}')">Add Prescription</button>
        </td>
      </tr>`;
  });
}

// Button Actions
function scheduleCall(doctorName) {
  window.location.href = `php/schedule_call.php?doctor=${encodeURIComponent(doctorName)}`;
}

function joinCall() {
  window.open("https://meet.google.com/static-meet-link", "_blank");
}

function openPrescription(patientName) {
  const modal = new bootstrap.Modal(document.getElementById('prescriptionModal'));
  document.getElementById("patientName").value = patientName;
  modal.show();
}

const prescriptionForm = document.getElementById("prescriptionForm");
if (prescriptionForm) {
  prescriptionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Prescription saved successfully!");
    bootstrap.Modal.getInstance(document.getElementById('prescriptionModal')).hide();
  });
}
