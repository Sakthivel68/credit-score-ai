import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPredictionHistory } from '../api/api';

// ==============================
// History Component
// ==============================
const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch history on page load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getPredictionHistory();
        setHistory(data);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Could not load history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ==============================
  // Credit Score Color
  // ==============================
  const getScoreColor = (score) => {
    if (score >= 800) return '#16a34a';
    if (score >= 650) return '#d97706';
    return '#dc2626';
  };

  // ==============================
  // Loading State
  // ==============================
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <div className="spinner" />
        <p style={{ color: '#6b7280', marginTop: '12px' }}>
          Loading history...
        </p>
      </div>
    );
  }

  // ==============================
  // Error State
  // ==============================
  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: '#dc2626', fontSize: '16px' }}>⚠️ {error}</p>
        <button
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
          onClick={() => navigate('/')}
        >
          Go to Loan Form
        </button>
      </div>
    );
  }

  // ==============================
  // Empty State
  // ==============================
  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <p style={{ fontSize: '48px' }}>📭</p>
        <p style={{ color: '#6b7280', fontSize: '18px', marginTop: '12px' }}>
          No predictions yet.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
          onClick={() => navigate('/')}
        >
          Make First Prediction
        </button>
      </div>
    );
  }

  // ==============================
  // History Table
  // ==============================
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a' }}>
            Prediction History
          </h1>
          <p style={{ color: '#6b7280', marginTop: '6px' }}>
            {history.length} prediction{history.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          + New Application
        </button>
      </div>

      {/* History Table Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Decision</th>
              <th style={thStyle}>Credit Score</th>
              <th style={thStyle}>Risk Level</th>
              <th style={thStyle}>Probability</th>
              <th style={thStyle}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr
                key={record.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                  transition: 'background 0.15s',
                }}
              >
                {/* Application ID */}
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: '#eff6ff',
                    color: '#1e3a8a',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    #{record.application_id}
                  </span>
                </td>

                {/* Decision */}
                <td style={tdStyle}>
                  <span style={{
                    color: record.prediction === 'Approved' ? '#16a34a' : '#dc2626',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}>
                    {record.prediction === 'Approved' ? '✅ Approved' : '❌ Rejected'}
                  </span>
                </td>

                {/* Credit Score */}
                <td style={tdStyle}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: getScoreColor(record.credit_score)
                  }}>
                    {record.credit_score}
                  </span>
                </td>

                {/* Risk Level */}
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor:
                      record.risk_level === 'Low Risk' ? '#dcfce7' :
                      record.risk_level === 'Medium Risk' ? '#fef3c7' : '#fee2e2',
                    color:
                      record.risk_level === 'Low Risk' ? '#16a34a' :
                      record.risk_level === 'Medium Risk' ? '#d97706' : '#dc2626',
                  }}>
                    {record.risk_level}
                  </span>
                </td>

                {/* Probability */}
                <td style={tdStyle}>
                  {(record.probability * 100).toFixed(1)}%
                </td>

                {/* Date */}
                <td style={tdStyle}>
                  {new Date(record.predicted_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==============================
// Table Styles
// ==============================
const thStyle = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '600',
  color: '#ffffff',
  letterSpacing: '0.5px',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '14px',
  color: '#374151',
};

export default History;