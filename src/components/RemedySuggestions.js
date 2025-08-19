import React from 'react';

const RemedySuggestions = ({ treatment }) => {
  if (!treatment) return null;

  return (
    <div className="treatment-section">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Treatment Recommendations
      </h2>
      
      {treatment.description && (
        <div style={{ 
          background: '#e3f2fd', 
          padding: '1rem', 
          borderRadius: '10px', 
          marginBottom: '2rem',
          borderLeft: '4px solid #2196F3'
        }}>
          <h3 style={{ color: '#1976D2', marginBottom: '0.5rem' }}>About This Disease</h3>
          <p style={{ color: '#333', lineHeight: '1.6' }}>{treatment.description}</p>
          {treatment.symptoms && (
            <p style={{ color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
              <strong>Common symptoms:</strong> {treatment.symptoms}
            </p>
          )}
        </div>
      )}

      <div className="treatment-grid">
        {treatment.treatment && treatment.treatment.length > 0 && (
          <div className="treatment-card">
            <h3>🏥 Treatment Steps</h3>
            <ul className="treatment-list">
              {treatment.treatment.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {treatment.prevention && treatment.prevention.length > 0 && (
          <div className="treatment-card">
            <h3>🛡️ Prevention Tips</h3>
            <ul className="treatment-list">
              {treatment.prevention.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#fff3e0', 
        borderRadius: '10px',
        borderLeft: '4px solid #ff9800'
      }}>
        <h4 style={{ color: '#f57c00', marginBottom: '0.5rem' }}>⚠️ Important Note</h4>
        <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: '1.5' }}>
          This AI diagnosis is for guidance only. For severe infections or valuable crops, 
          please consult with a local agricultural extension office or plant pathologist 
          for professional advice and treatment recommendations.
        </p>
      </div>
    </div>
  );
};

export default RemedySuggestions;