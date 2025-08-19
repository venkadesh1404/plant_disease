// src/pages/PlantPage.js
import React, { useState } from "react";

function PlantPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("http://10.216.20.101:5000/predict", {
        method: "POST",
        body: formData,
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
      <h2 className="text-2xl font-bold mb-4">🌿 Plant Disease Detection</h2>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
        )}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg"
        >
          🔍 Predict
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Result:</h3>
          <p className="mt-2">{JSON.stringify(result)}</p>
        </div>
      )}
    </div>
  );
}

export default PlantPage;
