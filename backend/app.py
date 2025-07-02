from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simulated sensor data (replace this with real sensor values if available)
def generate_sensor_data():
    return {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "temperature": round(random.uniform(25, 30), 2),
        "humidity": round(random.uniform(50, 70), 2),
        "pressure": round(random.uniform(1000, 1020), 2),
        "gas_resistance": round(random.uniform(40000, 60000), 2),
        "aqi": round(random.uniform(50, 150), 2),
    }

@app.route("/latest")
def latest_data():
    data = generate_sensor_data()
    print(f"Latest data: {data}")
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
