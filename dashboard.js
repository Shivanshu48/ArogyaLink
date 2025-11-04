import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://hijzqdwdfxngstwmgsxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpanpxZHdkZnhuZ3N0d21nc3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzMwODcsImV4cCI6MjA3NzgwOTA4N30.dzdHM-OB5Na46ZjzuSDyHSd7XtxQv1E_GEiag9XvOmc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentPharmacyId = null;

async function loadPharmacies() {
    try {
        const { data, error } = await supabase
            .from('pharmacies')
            .select('*')
            .order('name');

        if (error) throw error;

        const select = document.getElementById('pharmacySelect');
        select.innerHTML = '<option value="">Choose pharmacy...</option>';

        if (data && data.length > 0) {
            data.forEach(pharmacy => {
                const option = document.createElement('option');
                option.value = pharmacy.id;
                option.textContent = pharmacy.name;
                select.appendChild(option);
            });
        } else {
            await createSamplePharmacy();
            loadPharmacies();
        }
    } catch (error) {
        console.error('Error loading pharmacies:', error);
    }
}

async function createSamplePharmacy() {
    try {
        const { data, error } = await supabase
            .from('pharmacies')
            .insert([
                { name: 'Central Pharmacy', address: '123 Main Street, City Center', phone: '555-0101' },
                { name: 'Green Cross Pharmacy', address: '456 Oak Avenue, Downtown', phone: '555-0102' },
                { name: 'HealthCare Pharmacy', address: '789 Elm Road, Westside', phone: '555-0103' }
            ])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating sample pharmacy:', error);
    }
}

async function loadMedicines(pharmacyId) {
    try {
        const { data, error } = await supabase
            .from('medicines')
            .select('*')
            .eq('pharmacy_id', pharmacyId)
            .order('name');

        if (error) throw error;

        const medicineList = document.getElementById('medicineList');

        if (data && data.length > 0) {
            medicineList.innerHTML = data.map(medicine => `
                <div class="medicine-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${medicine.name}</h6>
                            <p class="mb-1">Quantity: <strong>${medicine.quantity}</strong></p>
                            <p class="mb-0">
                                <span class="badge ${getAvailabilityClass(medicine.availability)}">
                                    ${medicine.availability}
                                </span>
                            </p>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="editMedicine('${medicine.id}', '${medicine.name}', ${medicine.quantity}, '${medicine.availability}')">
                            Edit
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            medicineList.innerHTML = '<p class="text-muted text-center">No medicines found. Add your first medicine above.</p>';
        }
    } catch (error) {
        console.error('Error loading medicines:', error);
        document.getElementById('medicineList').innerHTML = '<p class="text-danger text-center">Error loading medicines</p>';
    }
}

function getAvailabilityClass(availability) {
    switch(availability) {
        case 'In Stock':
            return 'badge-success';
        case 'Low Stock':
            return 'badge-warning';
        case 'Out of Stock':
            return 'badge-danger';
        default:
            return 'badge-secondary';
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'Pending':
            return 'badge-warning';
        case 'Fulfilled':
            return 'badge-success';
        case 'Cancelled':
            return 'badge-danger';
        default:
            return 'badge-secondary';
    }
}

async function loadPrescriptions(pharmacyId) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('pharmacy_id', pharmacyId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        const prescriptionList = document.getElementById('prescriptionList');

        if (data && data.length > 0) {
            prescriptionList.innerHTML = data.map(prescription => `
                <tr>
                    <td>${prescription.patient_name}</td>
                    <td>${prescription.medicine_name}</td>
                    <td>${prescription.dosage || 'N/A'}</td>
                    <td><span class="badge ${getStatusClass(prescription.status)}">${prescription.status}</span></td>
                    <td>${new Date(prescription.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            prescriptionList.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No prescriptions found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        document.getElementById('prescriptionList').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading prescriptions</td></tr>';
    }
}

window.editMedicine = async function(id, name, quantity, availability) {
    document.getElementById('medicineName').value = name;
    document.getElementById('medicineQuantity').value = quantity;
    document.getElementById('medicineAvailability').value = availability;

    const submitBtn = document.querySelector('#medicineForm button[type="submit"]');
    submitBtn.textContent = 'Update Medicine';
    submitBtn.dataset.medicineId = id;
}

document.getElementById('pharmacySelect').addEventListener('change', async (e) => {
    currentPharmacyId = e.target.value;

    if (currentPharmacyId) {
        await loadMedicines(currentPharmacyId);
        await loadPrescriptions(currentPharmacyId);
    } else {
        document.getElementById('medicineList').innerHTML = '<p class="text-muted text-center">Please select a pharmacy</p>';
        document.getElementById('prescriptionList').innerHTML = '<tr><td colspan="5" class="text-center text-muted">Please select a pharmacy</td></tr>';
    }
});

document.getElementById('medicineForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const pharmacyId = document.getElementById('pharmacySelect').value;
    const name = document.getElementById('medicineName').value;
    const quantity = parseInt(document.getElementById('medicineQuantity').value);
    const availability = document.getElementById('medicineAvailability').value;

    if (!pharmacyId) {
        alert('Please select a pharmacy');
        return;
    }

    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const medicineId = submitBtn.dataset.medicineId;

        if (medicineId) {
            const { error } = await supabase
                .from('medicines')
                .update({
                    name,
                    quantity,
                    availability,
                    updated_at: new Date().toISOString()
                })
                .eq('id', medicineId);

            if (error) throw error;

            submitBtn.textContent = 'Add Medicine';
            delete submitBtn.dataset.medicineId;
        } else {
            const { error } = await supabase
                .from('medicines')
                .insert([{
                    pharmacy_id: pharmacyId,
                    name,
                    quantity,
                    availability
                }]);

            if (error) throw error;
        }

        e.target.reset();
        document.getElementById('pharmacySelect').value = pharmacyId;
        await loadMedicines(pharmacyId);

        const successMessage = medicineId ? 'Medicine updated successfully!' : 'Medicine added successfully!';
        alert(successMessage);
    } catch (error) {
        console.error('Error saving medicine:', error);
        alert('Error saving medicine. Please try again.');
    }
});

async function createSampleData() {
    try {
        const { data: pharmacies } = await supabase
            .from('pharmacies')
            .select('id')
            .limit(1);

        if (pharmacies && pharmacies.length > 0) {
            const pharmacyId = pharmacies[0].id;

            const { data: existingMedicines } = await supabase
                .from('medicines')
                .select('id')
                .eq('pharmacy_id', pharmacyId)
                .limit(1);

            if (!existingMedicines || existingMedicines.length === 0) {
                await supabase
                    .from('medicines')
                    .insert([
                        { pharmacy_id: pharmacyId, name: 'Aspirin 500mg', quantity: 150, availability: 'In Stock' },
                        { pharmacy_id: pharmacyId, name: 'Amoxicillin 250mg', quantity: 30, availability: 'Low Stock' },
                        { pharmacy_id: pharmacyId, name: 'Ibuprofen 400mg', quantity: 200, availability: 'In Stock' }
                    ]);
            }

            const { data: existingPrescriptions } = await supabase
                .from('prescriptions')
                .select('id')
                .eq('pharmacy_id', pharmacyId)
                .limit(1);

            if (!existingPrescriptions || existingPrescriptions.length === 0) {
                await supabase
                    .from('prescriptions')
                    .insert([
                        { pharmacy_id: pharmacyId, patient_name: 'John Smith', medicine_name: 'Aspirin 500mg', dosage: 'Twice daily', status: 'Fulfilled' },
                        { pharmacy_id: pharmacyId, patient_name: 'Sarah Johnson', medicine_name: 'Amoxicillin 250mg', dosage: 'Three times daily', status: 'Pending' },
                        { pharmacy_id: pharmacyId, patient_name: 'Michael Brown', medicine_name: 'Ibuprofen 400mg', dosage: 'As needed', status: 'Fulfilled' }
                    ]);
            }
        }
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadPharmacies();
    await createSampleData();

    const firstPharmacy = document.querySelector('#pharmacySelect option:nth-child(2)');
    if (firstPharmacy) {
        document.getElementById('pharmacySelect').value = firstPharmacy.value;
        currentPharmacyId = firstPharmacy.value;
        await loadMedicines(currentPharmacyId);
        await loadPrescriptions(currentPharmacyId);
    }
});