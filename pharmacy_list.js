import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://hijzqdwdfxngstwmgsxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpanpxZHdkZnhuZ3N0d21nc3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzMwODcsImV4cCI6MjA3NzgwOTA4N30.dzdHM-OB5Na46ZjzuSDyHSd7XtxQv1E_GEiag9XvOmc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allPharmacies = [];
let allMedicines = [];

async function loadPharmaciesWithMedicines() {
    try {
        const { data: pharmacies, error: pharmacyError } = await supabase
            .from('pharmacies')
            .select('*')
            .order('name');

        if (pharmacyError) throw pharmacyError;

        const { data: medicines, error: medicineError } = await supabase
            .from('medicines')
            .select('*');

        if (medicineError) throw medicineError;

        allPharmacies = pharmacies || [];
        allMedicines = medicines || [];

        displayPharmacies(allPharmacies);
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('pharmacyList').innerHTML = `
            <div class="col-12">
                <p class="text-center text-danger">Error loading pharmacies. Please try again.</p>
            </div>
        `;
    }
}

function displayPharmacies(pharmacies) {
    const pharmacyList = document.getElementById('pharmacyList');

    if (pharmacies.length === 0) {
        pharmacyList.innerHTML = `
            <div class="col-12">
                <p class="text-center text-muted">No pharmacies found.</p>
            </div>
        `;
        return;
    }

    pharmacyList.innerHTML = pharmacies.map(pharmacy => {
        const pharmacyMedicines = allMedicines.filter(m => m.pharmacy_id === pharmacy.id);
        const inStock = pharmacyMedicines.filter(m => m.availability === 'In Stock').length;
        const lowStock = pharmacyMedicines.filter(m => m.availability === 'Low Stock').length;
        const outOfStock = pharmacyMedicines.filter(m => m.availability === 'Out of Stock').length;

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card pharmacy-card shadow-sm rounded-4 border-0">
                    <div class="card-body p-4">
                        <h5 class="mb-3">${pharmacy.name}</h5>
                        <p class="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill me-2" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
                            ${pharmacy.address}
                        </p>
                        ${pharmacy.phone ? `
                            <p class="mb-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill me-2" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                                </svg>
                                ${pharmacy.phone}
                            </p>
                        ` : ''}

                        <div class="stock-info">
                            <p class="mb-2 fw-semibold" style="color: #333; font-size: 0.9rem;">Medicine Stock Status:</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge badge-success">${inStock} In Stock</span>
                                <span class="badge badge-warning">${lowStock} Low Stock</span>
                                <span class="badge badge-danger">${outOfStock} Out</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterPharmacies(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
        displayPharmacies(allPharmacies);
        return;
    }

    const filtered = allPharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(term) ||
        pharmacy.address.toLowerCase().includes(term)
    );

    displayPharmacies(filtered);
}

document.getElementById('searchBar').addEventListener('input', (e) => {
    filterPharmacies(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
    loadPharmaciesWithMedicines();
});