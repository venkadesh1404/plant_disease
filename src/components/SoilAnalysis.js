import React, { useState, useRef, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SoilAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError(null);
      setAnalysis(null);
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setError(null);
        setAnalysis(null);
        
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setError('Please drop a valid image file');
      }
    }
  }, []);

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setCameraActive(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'soil-sample.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setImagePreview(canvas.toDataURL());
        setAnalysis(null);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  // Analyze soil
  const analyzeSoil = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch(`${API_BASE_URL}/predict-soil`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (err) {
      console.error('Soil analysis error:', err);
      setError('Failed to analyze soil. Please try again.');
      
      // Fallback demo analysis
      setAnalysis({
        soil_type: 'Loamy',
        health_score: 75,
        health_rating: 'Good',
        organic_matter: 'Medium',
        texture: 'Medium (Loamy)',
        drainage: 'Good',
        color_analysis: {
          hue: 25,
          saturation: 45,
          brightness: 85
        },
        texture_metrics: {
          roughness: 22.5,
          particle_density: 0.08
        },
        recommendations: {
          immediate_actions: [
            'Maintain current organic matter levels',
            'Continue regular composting',
            'Monitor pH levels regularly'
          ],
          long_term_improvements: [
            'Add aged manure annually',
            'Plant cover crops during off-season'
          ],
          fertilizer_suggestions: [
            'Use organic fertilizers to maintain health',
            'Apply compost tea monthly'
          ],
          planting_recommendations: [
            'Suitable for most vegetables and flowers',
            'Consider crop rotation for optimal results'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 65) return '#8BC34A';
    if (score >= 50) return '#FFC107';
    if (score >= 35) return '#FF9800';
    return '#F44336';
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="soil-analysis">
      <div className="section-header">
        <h2>🌱 Soil Health Analysis</h2>
        <p>Upload a photo of your soil sample to get detailed health analysis and improvement recommendations</p>
      </div>

      {!imagePreview && (
        <section className="upload-section">
          <div
            className="upload-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">🌍</div>
            <div className="upload-text">
              Click to upload soil sample or drag and drop
            </div>
            <div className="upload-subtext">
              Take a clear photo of your soil sample for best results
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
          </div>

          <div className="camera-section">
            <p style={{ marginBottom: '1rem' }}>Or use your camera:</p>
            {!cameraActive ? (
              <button onClick={startCamera} className="camera-button">
                📷 Open Camera
              </button>
            ) : (
              <div className="camera-preview">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-video"
                />
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={capturePhoto} className="camera-button">
                    📸 Capture Sample
                  </button>
                  <button onClick={stopCamera} className="camera-button" style={{ background: '#f44336' }}>
                    ❌ Close Camera
                  </button>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </section>
      )}

      {imagePreview && (
        <section className="preview-section">
          <img src={imagePreview} alt="Soil sample" className="preview-image" />
          
          {!analysis && !loading && (
            <button onClick={analyzeSoil} className="analyze-button">
              🔬 Analyze Soil Health
            </button>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing your soil sample...</p>
            </div>
          )}

          <button onClick={resetAnalysis} className="reset-button">
            🔄 New Analysis
          </button>
        </section>
      )}

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysis && (
        <section className="results-section">
          <div className="result-header">
            <h2 className="soil-type">
              {analysis.soil_type} Soil
            </h2>
            <div className="health-rating" style={{ color: getHealthColor(analysis.health_score) }}>
              Health Rating: {analysis.health_rating}
            </div>
            <div className="health-score">
              Score: {analysis.health_score}/100
            </div>
            <div className="health-bar">
              <div 
                className="health-fill"
                style={{ 
                  width: `${analysis.health_score}%`,
                  background: getHealthColor(analysis.health_score)
                }}
              ></div>
            </div>
          </div>

          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>📊 Soil Properties</h3>
              <div className="property-list">
                <div className="property-item">
                  <span className="property-label">Soil Type:</span>
                  <span className="property-value">{analysis.soil_type}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Texture:</span>
                  <span className="property-value">{analysis.texture}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Organic Matter:</span>
                  <span className="property-value">{analysis.organic_matter}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Drainage:</span>
                  <span className="property-value">{analysis.drainage}</span>
                </div>
              </div>
            </div>

            <div className="analysis-card">
              <h3>🎨 Color Analysis</h3>
              <div className="color-metrics">
                <div className="metric">
                  <span>Hue: {analysis.color_analysis.hue.toFixed(1)}°</span>
                  <div className="metric-bar">
                    <div style={{ width: `${(analysis.color_analysis.hue / 360) * 100}%` }}></div>
                  </div>
                </div>
                <div className="metric">
                  <span>Saturation: {analysis.color_analysis.saturation.toFixed(1)}%</span>
                  <div className="metric-bar">
                    <div style={{ width: `${(analysis.color_analysis.saturation / 255) * 100}%` }}></div>
                  </div>
                </div>
                <div className="metric">
                  <span>Brightness: {analysis.color_analysis.brightness.toFixed(1)}%</span>
                  <div className="metric-bar">
                    <div style={{ width: `${(analysis.color_analysis.brightness / 255) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h2>💡 Improvement Recommendations</h2>
            
            <div className="recommendation-grid">
              {analysis.recommendations.immediate_actions.length > 0 && (
                <div className="recommendation-card">
                  <h3>⚡ Immediate Actions</h3>
                  <ul className="recommendation-list">
                    {analysis.recommendations.immediate_actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations.long_term_improvements.length > 0 && (
                <div className="recommendation-card">
                  <h3>📈 Long-term Improvements</h3>
                  <ul className="recommendation-list">
                    {analysis.recommendations.long_term_improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations.fertilizer_suggestions.length > 0 && (
                <div className="recommendation-card">
                  <h3>🧪 Fertilizer Suggestions</h3>
                  <ul className="recommendation-list">
                    {analysis.recommendations.fertilizer_suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations.planting_recommendations.length > 0 && (
                <div className="recommendation-card">
                  <h3>🌿 Planting Recommendations</h3>
                  <ul className="recommendation-list">
                    {analysis.recommendations.planting_recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SoilAnalysis;