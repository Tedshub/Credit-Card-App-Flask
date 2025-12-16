document.addEventListener('DOMContentLoaded', function() {
    // --- INISIALISASI PETA (Hanya untuk tab manual) ---
    const map = L.map('map').setView([35.2271, -80.8431], 9); // Charlotte, NC
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    let userMarker = L.marker([35.2271, -80.8431], { icon: userIcon, draggable: true }).addTo(map)
                      .bindPopup('Your location (drag to change)').openPopup();

    const merchantIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    let merchantMarker = L.marker([35.2300, -80.8600], { icon: merchantIcon, draggable: true }).addTo(map)
                         .bindPopup('Merchant location (drag to change)');

    function updateCoordinatesAndDistance() {
        const userLatLng = userMarker.getLatLng();
        const merchantLatLng = merchantMarker.getLatLng();

        document.getElementById('lat').value = userLatLng.lat.toFixed(6);
        document.getElementById('long').value = userLatLng.lng.toFixed(6);
        document.getElementById('merch_lat').value = merchantLatLng.lat.toFixed(6);
        document.getElementById('merch_long').value = merchantLatLng.lng.toFixed(6);

        const distance = calculateDistance(userLatLng.lat, userLatLng.lng, merchantLatLng.lat, merchantLatLng.lng);
        document.getElementById('distance_km').value = distance.toFixed(2) + ' km';
    }

    userMarker.on('dragend', updateCoordinatesAndDistance);
    merchantMarker.on('dragend', updateCoordinatesAndDistance);
    updateCoordinatesAndDistance();

    // --- FUNGSI UNTUK MEMPERBARUI DATA KOTA ---
    function updateCityData() {
        const citySelect = document.getElementById('city');
        const cityPopInput = document.getElementById('city_pop');
        const zipInput = document.getElementById('zip');
        const selectedOption = citySelect.options[citySelect.selectedIndex];
        const cityName = selectedOption.text;
        
        if (cityName && cityName !== "Select City...") {
            fetch(`/get_city_data/${cityName}`)
                .then(response => response.json())
                .then(data => {
                    cityPopInput.value = data.population;
                    zipInput.value = data.zip;
                    map.setView([data.lat, data.long], 10);
                    userMarker.setLatLng([data.lat, data.long]);
                    updateCoordinatesAndDistance();
                })
                .catch(error => {
                    console.error('Error:', error);
                    cityPopInput.value = 0;
                    zipInput.value = 0;
                });
        } else {
            cityPopInput.value = 0;
            zipInput.value = 0;
        }
    }

    document.getElementById('city').addEventListener('change', updateCityData);

    // --- FUNGSI BARU: UNTUK MENGISI FORM MANUAL ---
    function populateManualForm(inputData) {
        // DEBUG: Cetak data yang diterima ke konsol
        console.log("Populating form with the following data:", inputData);

        // Isi input teks/angka
        document.getElementById('cc_num').value = inputData.cc_num || '';
        document.getElementById('amt').value = inputData.amt || '';
        document.getElementById('zip').value = inputData.zip || '';
        document.getElementById('age').value = inputData.age || '';

        // Isi dropdown dengan fungsi yang diperbaiki
        setDropdownValue('category', inputData.category);
        setDropdownValue('gender', inputData.gender);
        setDropdownValue('state', inputData.state);
        setDropdownValue('hour', inputData.hour);
        setDropdownValue('dayofweek', inputData.dayofweek);
        setDropdownValue('month', inputData.month);
        
        // Khusus untuk kota
        setDropdownValue('city', inputData.city);
        // Memicu event 'change' untuk mengupdate peta, zip, dan populasi
        document.getElementById('city').dispatchEvent(new Event('change'));

        // Perbarui marker peta
        if (inputData.lat && inputData.long) {
            userMarker.setLatLng([inputData.lat, inputData.long]);
        }
        if (inputData.merch_lat && inputData.merch_long) {
            merchantMarker.setLatLng([inputData.merch_lat, inputData.merch_long]);
        }
        
        // Perbarui jarak
        updateCoordinatesAndDistance();
    }

    /**
     * Fungsi yang sangat andal untuk mengatur nilai dropdown.
     * Mencari opsi yang cocok dan menandainya sebagai terpilih.
     * Jika tidak ditemukan, akan mencetak peringatan ke konsol.
     * @param {string} dropdownId - ID dari elemen select.
     * @param {string|number} value - Nilai yang akan dicari.
     */
    function setDropdownValue(dropdownId, value) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.error(`Dropdown with id "${dropdownId}" not found.`);
            return;
        }

        const targetValue = String(value); // Pastikan perbandingan dilakukan sebagai string
        console.log(`Attempting to set dropdown "${dropdownId}" to value "${targetValue}"`);

        let found = false;
        for (let i = 0; i < dropdown.options.length; i++) {
            if (dropdown.options[i].value === targetValue) {
                dropdown.selectedIndex = i;
                found = true;
                console.log(`Successfully set "${dropdownId}" to option "${dropdown.options[i].text}" at index ${i}.`);
                break; // Keluar dari loop setelah ditemukan
            }
        }

        if (!found) {
            console.warn(`Value "${targetValue}" not found in dropdown "${dropdownId}". Available values are:`);
            for (let i = 0; i < dropdown.options.length; i++) {
                console.warn(`  - "${dropdown.options[i].value}"`);
            }
            dropdown.selectedIndex = 0; // Reset ke placeholder
        }
    }

    // --- FUNGSI UNTUK MENAMPILKAN HASIL (DIMODIFIKASI) ---
    function displayResult(data, sourceInputData = null) {
        const resultArea = document.getElementById('resultArea');
        if (data.error) {
            throw new Error(data.error);
        }
        
        let resultClass = data.prediction === 1 ? 'fraud' : 'normal';
        let resultHtml = `
            <div class="result-container ${resultClass}">
                <p>Status: ${data.status}</p>
                <p>Fraud Probability: ${data.probability}</p>
                <p>Distance: ${data.distance_km}</p>
            </div>
        `;

        if (data.full_result) {
            resultHtml += `
                <div class="mt-4">
                    <h4>Full Result (JSON)</h4>
                    <pre class="bg-light p-3 rounded"><code>${JSON.stringify(data.full_result, null, 2)}</code></pre>
                </div>
            `;
        }

        resultArea.innerHTML = resultHtml;

        // LOGIKA BARU: Isi form manual jika data berasal dari input JSON
        if (sourceInputData) {
            populateManualForm(sourceInputData);
            // Beralih ke tab manual untuk menampilkan form yang telah diisi
            const manualTabEl = document.getElementById('manual-tab');
            const manualTab = new bootstrap.Tab(manualTabEl);
            manualTab.show();
        }
    }

    // --- EVENT LISTENER UNTUK FORM MANUAL ---
    const manualForm = document.getElementById('predictionForm');
    manualForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const lat = document.getElementById('lat').value;
        const long = document.getElementById('long').value;
        const merch_lat = document.getElementById('merch_lat').value;
        const merch_long = document.getElementById('merch_long').value;

        if (!lat || !long || !merch_lat || !merch_long) {
            document.getElementById('resultArea').innerHTML = `
                <div class="alert alert-warning mt-4" role="alert">
                    Please ensure a location has been selected on map.
                </div>
            `;
            return;
        }
        
        document.getElementById('resultArea').innerHTML = '<div class="text-center mt-4"><div class="spinner-border" role="status"></div> Processing...</div>';
        
        const formData = new FormData(manualForm);
        fetch('/predict', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => displayResult(data)) // Panggil tanpa data sumber
            .catch(error => {
                document.getElementById('resultArea').innerHTML = `
                    <div class="alert alert-danger mt-4" role="alert">
                        An error occurred: ${error.message}
                    </div>
                `;
            });
    });

    // --- EVENT LISTENER UNTUK FORM JSON ---
    const jsonForm = document.getElementById('jsonPredictionForm');
    jsonForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const jsonInput = document.getElementById('jsonInput').value;
        const resultArea = document.getElementById('resultArea');
        
        try {
            const jsonData = JSON.parse(jsonInput);
            if (!jsonData.input) {
                throw new Error("JSON must contain an 'input' object.");
            }

            resultArea.innerHTML = '<div class="text-center mt-4"><div class="spinner-border" role="status"></div> Processing...</div>';
            
            const formData = new FormData();
            for (const key in jsonData.input) {
                formData.append(key, jsonData.input[key]);
            }
            
            fetch('/predict', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => displayResult(data, jsonData.input)) // Panggil dengan data sumber
                .catch(error => {
                    resultArea.innerHTML = `
                        <div class="alert alert-danger mt-4" role="alert">
                            An error occurred: ${error.message}
                        </div>
                    `;
                });

        } catch (e) {
            resultArea.innerHTML = `
                <div class="alert alert-danger mt-4" role="alert">
                    Invalid JSON format: ${e.message}
                </div>
            `;
        }
    });

    // --- API TESTING FUNCTIONALITY ---
    function testApi(endpoint, method = 'GET', data = null) {
        const resultsDiv = document.getElementById('apiTestResults');
        resultsDiv.innerHTML = '<div class="text-center"><div class="spinner-border spinner-border-sm" role="status"></div> Testing...</div>';
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && method === 'POST') {
            options.body = JSON.stringify(data);
        }
        
        fetch(endpoint, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                resultsDiv.innerHTML = `
                    <h6>Response from ${endpoint}:</h6>
                    <pre class="bg-white p-2 rounded border">${JSON.stringify(data, null, 2)}</pre>
                `;
            })
            .catch(error => {
                resultsDiv.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Error testing ${endpoint}: ${error.message}
                    </div>
                `;
            });
    }
    
    // API TEST BUTTON EVENT LISTENERS
    document.getElementById('testPredictBtn').addEventListener('click', function() {
        const testData = {
            cc_num: 2291163933867244.0,
            category: 10.0,
            amt: 2.86,
            gender: 1.0,
            city: 168.0,
            state: 40.0,
            zip: 28202,
            lat: 35.2271,
            long: -80.8431,
            city_pop: 897720,
            merch_lat: 35.2300,
            merch_long: -80.8600,
            hour: 14.0,
            dayofweek: 2.0,
            month: 6.0,
            age: 35.0
        };
        testApi('/api/predict', 'POST', testData);
    });
    
    document.getElementById('testCategoriesBtn').addEventListener('click', function() {
        testApi('/api/categories');
    });
    
    document.getElementById('testGendersBtn').addEventListener('click', function() {
        testApi('/api/genders');
    });
    
    document.getElementById('testStatesBtn').addEventListener('click', function() {
        testApi('/api/states');
    });
    
    document.getElementById('testCitiesBtn').addEventListener('click', function() {
        testApi('/api/cities');
    });
    
    document.getElementById('testDaysBtn').addEventListener('click', function() {
        testApi('/api/days_of_week');
    });
    
    document.getElementById('testMonthsBtn').addEventListener('click', function() {
        testApi('/api/months');
    });
    
    document.getElementById('testHoursBtn').addEventListener('click', function() {
        testApi('/api/hours');
    });
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
}