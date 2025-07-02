import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib

# Load the dataset
data = pd.read_csv('data/simulated_bme680_data.csv')

# Features (temperature, humidity, pressure, gas_resistance)
X = data[['temperature', 'humidity', 'pressure', 'gas_resistance']]

# Target (AQI category)
# For simplicity, we will treat AQI as a continuous value based on gas_resistance
y = data['gas_resistance']  # You can modify this depending on how you want to predict AQI

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize and train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate the model
print("Model score (R^2) on test data:", model.score(X_test_scaled, y_test))

# Save the trained model and scaler
joblib.dump(model, 'model/aqi_model.pkl')
joblib.dump(scaler, 'model/scaler.pkl')

print("Model and scaler saved successfully.")
