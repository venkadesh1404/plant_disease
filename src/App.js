// src/App.js
import React from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to AgriCare AI 🌱</h1>
      <p className="mb-6">React frontend is running successfully 🚀</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/plant")}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl shadow-lg text-lg font-semibold"
        >
          🌿 Plant Disease Detection
        </button>

        <button
          onClick={() => navigate("/soil")}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-2xl shadow-lg text-lg font-semibold"
        >
          🌍 Soil Health Prediction
        </button>
      </div>
    </div>
  );
}

export default App;