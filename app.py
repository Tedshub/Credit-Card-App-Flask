import os
import joblib
import numpy as np
import pandas as pd
import time
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Tambahkan import ini
from math import radians, sin, cos, sqrt, atan2

# --- KONFIGURASI APLIKASI ---
app = Flask(__name__)
CORS(app)  # Tambahkan ini untuk mengaktifkan CORS untuk semua rute

# --- LOAD MODEL ---
MODEL_PATH = 'models/xgboost_optimized.pkl'
pipeline = joblib.load(MODEL_PATH)

# --- FITUR MODEL ---
feature_names = [
    'cc_num', 'category', 'amt', 'gender', 'city', 'state', 'zip',
    'lat', 'long', 'city_pop', 'merch_lat', 'merch_long',
    'hour', 'dayofweek', 'month', 'age'
]

# --- DATA UNTUK DROPDOWN (USA) ---
# Kategori transaksi yang umum di AS
category_options = {
    "Grocery": 10.0,
    "Online Shopping": 5.0,
    "Gas Transport": 3.0,
    "Restaurant": 7.0,
    "Jewelry": 9.0,
    "Misc": 5.0,
    "Personal Care": 12.0,
    "Home": 13.0
}

gender_options = {
    "Female": 1.0,
    "Male": 0.0
}

# Data Negara Bagian dan Kota di AS
state_options = {
    "North Carolina": 40.0,
    "Utah": 44.0,
    "New York": 34.0,
    "Florida": 9.0,
    "Michigan": 22.0
}

city_options = {
    "Charlotte": {"encoded": 168.0, "population": 897720, "zip": 28202, "lat": 35.2271, "long": -80.8431},
    "Raleigh": {"encoded": 16.0, "population": 474069, "zip": 27601, "lat": 35.7796, "long": -78.6382},
    "Salt Lake City": {"encoded": 64.0, "population": 200591, "zip": 84101, "lat": 40.7608, "long": -111.8910},
    "New York": {"encoded": 261.0, "population": 8336817, "zip": 10001, "lat": 40.7128, "long": -74.0060},
    "Buffalo": {"encoded": 55.0, "population": 255284, "zip": 14201, "lat": 42.8864, "long": -78.8784},
    "Miami": {"encoded": 803.0, "population": 470914, "zip": 33101, "lat": 25.7617, "long": -80.1918},
    "Detroit": {"encoded": 12.0, "population": 639111, "zip": 48201, "lat": 42.3314, "long": -83.0458}
}

# Opsi untuk hari, bulan, dan jam (tidak berubah)
day_of_week_options = {
    "Monday": 0.0, "Tuesday": 1.0, "Wednesday": 2.0, "Thursday": 3.0,
    "Friday": 4.0, "Saturday": 5.0, "Sunday": 6.0
}

month_options = {
    "January": 1.0, "February": 2.0, "March": 3.0, "April": 4.0, "May": 5.0, "June": 6.0,
    "July": 7.0, "August": 8.0, "September": 9.0, "October": 10.0, "November": 11.0, "December": 12.0
}

hour_options = {str(i): float(i) for i in range(24)}

# --- FUNGSI PENDUKUNG ---
def haversine(lat1, lon1, lat2, lon2):
    """Menghitung jarak antara dua titik koordinat (dalam kilometer)."""
    R = 6371.0
    lat1_rad, lon1_rad, lat2_rad, lon2_rad = radians(lat1), radians(lon1), radians(lat2), radians(lon2)
    dlon, dlat = lon2_rad - lon1_rad, lat2_rad - lat1_rad
    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))

# --- ROUTING FLASK ---
@app.route('/')
def home():
    """Menampilkan halaman utama dengan form."""
    return render_template(
        'index.html',
        category_options=category_options,
        gender_options=gender_options,
        city_options=city_options,
        state_options=state_options,
        day_of_week_options=day_of_week_options,
        month_options=month_options,
        hour_options=hour_options
    )

@app.route('/get_city_data/<city_name>')
def get_city_data(city_name):
    """Mengembalikan data kota (encoded, populasi, zip, lat, long) berdasarkan nama kota."""
    if city_name in city_options:
        return jsonify(city_options[city_name])
    return jsonify({"encoded": 0.0, "population": 0, "zip": 0, "lat": 0.0, "long": 0.0})

@app.route('/predict', methods=['POST'])
def predict():
    """Menerima data dari form, melakukan prediksi, dan mengembalikan hasilnya."""
    try:
        form_data = request.form.to_dict()
        
        input_data = {
            'cc_num': float(form_data.get('cc_num')),
            'category': float(form_data.get('category')),
            'amt': float(form_data.get('amt')),
            'gender': float(form_data.get('gender')),
            'city': float(form_data.get('city')),
            'state': float(form_data.get('state')),
            'zip': float(form_data.get('zip')),
            'lat': float(form_data.get('lat')),
            'long': float(form_data.get('long')),
            'city_pop': float(form_data.get('city_pop')),
            'merch_lat': float(form_data.get('merch_lat')),
            'merch_long': float(form_data.get('merch_long')),
            'hour': float(form_data.get('hour')),
            'dayofweek': float(form_data.get('dayofweek')),
            'month': float(form_data.get('month')),
            'age': float(form_data.get('age'))
        }
        
        distance_km = haversine(input_data['lat'], input_data['long'], input_data['merch_lat'], input_data['merch_long'])
        input_df = pd.DataFrame([input_data])
        input_df = input_df[feature_names]

        probability = pipeline.predict_proba(input_df)[0, 1]
        prediction = (probability > 0.5).astype(int)
        
        description_parts = []
        if prediction == 1:
            description_parts.append("FRAUD")
            if input_data['amt'] > 1000: description_parts.append("High amount")
            if input_data['hour'] < 6 or input_data['hour'] > 22: description_parts.append("Unusual time")
            if distance_km > 100: description_parts.append("Distant location")
        else:
            description_parts.append("Normal")
            description_parts.append("Low risk transaction")
        
        description = " - ".join(description_parts)

        result = {
            'prediction': int(prediction),
            'probability': f"{probability:.6f}",
            'status': 'FRAUD 🚨' if prediction == 1 else 'Normal ✅',
            'distance_km': f"{distance_km:.2f}",
            'full_result': {
                "id": 1,
                "description": description,
                "input": input_data,
                "prediction": int(prediction),
                "fraud_probability": float(probability),
                "is_fraud": bool(prediction == 1)
            }
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- API ROUTES ---
@app.route('/api/categories')
def api_categories():
    """API endpoint untuk mendapatkan semua kategori transaksi."""
    return jsonify(category_options)

@app.route('/api/genders')
def api_genders():
    """API endpoint untuk mendapatkan semua opsi gender."""
    return jsonify(gender_options)

@app.route('/api/states')
def api_states():
    """API endpoint untuk mendapatkan semua negara bagian."""
    return jsonify(state_options)

@app.route('/api/cities')
def api_cities():
    """API endpoint untuk mendapatkan semua kota beserta data lengkapnya."""
    return jsonify(city_options)

@app.route('/api/days_of_week')
def api_days_of_week():
    """API endpoint untuk mendapatkan semua hari dalam seminggu."""
    return jsonify(day_of_week_options)

@app.route('/api/months')
def api_months():
    """API endpoint untuk mendapatkan semua bulan."""
    return jsonify(month_options)

@app.route('/api/hours')
def api_hours():
    """API endpoint untuk mendapatkan semua jam."""
    return jsonify(hour_options)

@app.route('/api/predict', methods=['POST'])
def api_predict():
    """API endpoint untuk prediksi fraud detection."""
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        
        # Validasi input
        required_fields = feature_names
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Buat dataframe dari input
        input_df = pd.DataFrame([data])
        input_df = input_df[feature_names]
        
        # Lakukan prediksi
        probability = pipeline.predict_proba(input_df)[0, 1]
        prediction = (probability > 0.5).astype(int)
        
        # Hitung jarak
        distance_km = haversine(
            float(data['lat']), float(data['long']), 
            float(data['merch_lat']), float(data['merch_long'])
        )
        
        # Buat deskripsi
        description_parts = []
        if prediction == 1:
            description_parts.append("FRAUD")
            if float(data['amt']) > 1000: description_parts.append("High amount")
            if float(data['hour']) < 6 or float(data['hour']) > 22: description_parts.append("Unusual time")
            if distance_km > 100: description_parts.append("Distant location")
        else:
            description_parts.append("Normal")
            description_parts.append("Low risk transaction")
        
        description = " - ".join(description_parts)
        
        result = {
            "id": 1,
            "description": description,
            "input": data,
            "prediction": int(prediction),
            "fraud_probability": float(probability),
            "is_fraud": bool(prediction == 1),
            "distance_km": distance_km
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)