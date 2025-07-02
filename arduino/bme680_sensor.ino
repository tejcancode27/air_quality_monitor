#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>

#define BME680_I2C_ADDR_PRIMARY 0x76  // Use 0x76 for the address

Adafruit_BME680 bme; // I2C

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!bme.begin(BME680_I2C_ADDR_PRIMARY)) {
    Serial.println("Could not find a valid BME680 sensor, check wiring!");
    while (1);
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320°C for 150 ms
}

void loop() {
  // Perform a reading
  if (!bme.performReading()) {
    Serial.println("Failed to perform reading :(");
    return;
  }

  // Get all the BME680 parameters
  float temperature = bme.temperature;   // Temperature in Celsius
  float humidity = bme.humidity;         // Humidity in %
  float pressure = bme.pressure;         // Pressure in hPa
  float gas_resistance = bme.gas_resistance; // Gas resistance in Ohms
  
  // Calculate AQI (based on gas resistance)
  String aqi_category = getAQICategory(gas_resistance);
  
  // Print all parameters
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C, Humidity: ");
  Serial.print(humidity);
  Serial.print(" %, Pressure: ");
  Serial.print(pressure);
  Serial.print(" hPa, Gas Resistance: ");
  Serial.print(gas_resistance);
  Serial.print(" Ω, AQI Category: ");
  Serial.println(aqi_category);

  delay(2000);
}

String getAQICategory(float gas_resistance) {
  if (gas_resistance > 50000) {
    return "Good";
  } else if (gas_resistance > 30000) {
    return "Moderate";
  } else if (gas_resistance > 10000) {
    return "Unhealthy";
  } else {
    return "Hazardous";
  }
}