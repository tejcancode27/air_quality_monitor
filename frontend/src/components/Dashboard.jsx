import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles.css';  // Ensure CSS is imported

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState({});
  const [history, setHistory] = useState({
    labels: [],
    temperature: [],
    humidity: [],
    pressure: [],
    gas_resistance: [],
    aqi: [],
  });

  // Fetch data every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to fetch data from Flask backend
  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/latest");
      const json = await res.json();
      console.log("Fetched data:", json);  // Log data to check response

      // Check if response contains necessary data
      if (!json || json.temperature === undefined) {
        console.warn("API returned incomplete data:", json);
        return;
      }

      setData(json); // Set the data for the current sensor reading

      // Update history with new values (keep only the latest 20 records)
      setHistory((prev) => {
        const updatedLabels = [...prev.labels, new Date().toLocaleTimeString()].slice(-20);
        const updatedTemperature = [...prev.temperature, json.temperature].slice(-20);
        const updatedHumidity = [...prev.humidity, json.humidity].slice(-20);
        const updatedPressure = [...prev.pressure, json.pressure].slice(-20);
        const updatedGasResistance = [...prev.gas_resistance, json.gas_resistance].slice(-20);
        const updatedAqi = [...prev.aqi, json.aqi].slice(-20);

        return {
          labels: updatedLabels,
          temperature: updatedTemperature,
          humidity: updatedHumidity,
          pressure: updatedPressure,
          gas_resistance: updatedGasResistance,
          aqi: updatedAqi,
        };
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Chart.js data for the graphs
  const chartData = (dataArr, label, borderColor) => ({
    labels: history.labels,
    datasets: [
      {
        label: label,
        data: dataArr,
        borderColor: borderColor,
        fill: false,
      },
    ],
  });

  return (
    <div className="container">
      <h1 className="animated fadeIn">Air Quality Dashboard</h1>

      {/* Display the latest data */}
      <div className="row">
        <div className="col-md-4">
          <div className="card animated fadeIn">
            <div className="card-body">
              <h5 className="card-title">Latest Data</h5>
              <p>Time: {data.time}</p>
              <p>Temperature: {data.temperature} °C</p>
              <p>Humidity: {data.humidity} %</p>
              <p>Pressure: {data.pressure} hPa</p>
              <p>Gas Resistance: {data.gas_resistance} Ω</p>
              <p>AQI: {data.aqi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="row">
        <div className="col-md-6">
          <div className="card animated fadeIn">
            <div className="card-body">
              <h5 className="card-title">Temperature (°C)</h5>
              <Line key="temperature" data={chartData(history.temperature, 'Temperature (°C)', 'rgba(75, 192, 192, 1)')} />
            </div>
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="col-md-6">
          <div className="card animated fadeIn">
            <div className="card-body">
              <h5 className="card-title">Humidity (%)</h5>
              <Line key="humidity" data={chartData(history.humidity, 'Humidity (%)', 'rgba(153, 102, 255, 1)')} />
            </div>
          </div>
        </div>
      </div>

      {/* Pressure Chart */}
      <div className="row">
        <div className="col-md-6">
          <div className="card animated fadeIn">
            <div className="card-body">
              <h5 className="card-title">Pressure (hPa)</h5>
              <Line key="pressure" data={chartData(history.pressure, 'Pressure (hPa)', 'rgba(255, 159, 64, 1)')} />
            </div>
          </div>
        </div>

        {/* Gas Resistance Chart */}
        <div className="col-md-6">
          <div className="card animated fadeIn">
            <div className="card-body">
              <h5 className="card-title">Gas Resistance (Ω)</h5>
              <Line key="gas_resistance" data={chartData(history.gas_resistance, 'Gas Resistance (Ω)', 'rgba(255, 99, 132, 1)')} />
            </div>
          </div>
        </div>
      </div>

      {/* AQI Chart */}
      <div className="row">
        <div className="col-md-12">
          <div className="card animated fadeIn">
            <div className="card-body">
              <h5 className="card-title">AQI</h5>
              <Line key="aqi" data={chartData(history.aqi, 'AQI', 'rgba(54, 162, 235, 1)')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
