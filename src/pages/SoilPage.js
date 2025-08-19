// src/pages/SoilPage.js
import React, { useState } from "react";

function SoilPage() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    moisture: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/predict_soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend!");
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className="text-2xl font-bold mb-4">🌍 Soil Health Prediction</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow-lg w-96"
      >
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.toUpperCase()}
            className="border rounded-lg px-3 py-2"
            required
          />
        ))}

        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow-lg"
        >
          🌱 Predict Soil Health
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md w-96">
          <h3 className="text-xl font-semibold">Result:</h3>
          <p className="mt-2">{JSON.stringify(result)}</p>
        </div>
      )}
    </div>
  );
}

export default SoilPage;
