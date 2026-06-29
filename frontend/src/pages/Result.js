import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ==============================
// Result Component
// ==============================
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  // If no result, redirect to form
  if (!result) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          No prediction data found.
        </p>
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

  const isApproved = result.prediction === 'Approved';

  // ==============================
  // Credit Score Color
  // ==============================
  const getScoreColor = (score) => {
    if (score >= 800) return '#16a34a';
    if (score >= 650) return '#d97706';
    return '#dc2626';
  };

  // ==============================
  // SHAP Chart Data
  // Positive = green, Negative = red
  // ==============================
  const chartData = result.top_reasons.map((item) => ({
    feature: item.feature,
    contribution: parseFloat(item.contribution.toFixed(4)),
    fill: item.contribution >= 0 ? '#16a34a' : '#dc2626',
  }));

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a' }}>
          Prediction Result
        </h1>
        <p style={{ color: '#6b7280', marginTop: '6px' }}>
          Application ID: #{result.application_id} —{' '}
          {new Date(result.predicted_at).toLocaleString()}
        </p>
      </div>

      {/* Decision Card */}
      <div className="card" style={{
        borderLeft: `6px solid ${isApproved ? '#16a34a' : '#dc2626'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Left — Decision */}
        <div>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
            Loan Decision
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: '800',
            color: isApproved ? '#16a34a' : '#dc2626'
          }}>
            {isApproved ? '✅ Approved' : '❌ Rejected'}
          </p>
          <p style={{ color: '#6b7280', marginTop: '6px' }}>
            Approval Probability:{' '}
            <strong>{(result.probability * 100).toFixed(1)}%</strong>
          </p>
        </div>

        {/* Right — Credit Score */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
            Credit Score
          </p>
          <p style={{
            fontSize: '56px',
            fontWeight: '900',
            color: getScoreColor(result.credit_score),
            lineHeight: 1
          }}>
            {result.credit_score}
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '6px',
            color: getScoreColor(result.credit_score)
          }}>
            {result.risk_level}
          </p>
        </div>
      </div>

      {/* SHAP Chart Card */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#1e3a8a' }}>
          Why this decision?
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
          Green bars pushed toward <strong>Approval</strong>.
          Red bars pushed toward <strong>Rejection</strong>.
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 120, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="feature"
              tick={{ fontSize: 13 }}
              width={120}
            />
            <Tooltip
              formatter={(value) => [value.toFixed(4), 'SHAP Contribution']}
            />
            <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Contributions Table */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e3a8a' }}>
          Feature Contributions
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={thStyle}>Feature</th>
              <th style={thStyle}>SHAP Value</th>
              <th style={thStyle}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {result.top_reasons.map((item, index) => (
              <tr key={index} style={{
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
              }}>
                <td style={tdStyle}>{item.feature}</td>
                <td style={tdStyle}>{item.contribution.toFixed(4)}</td>
                <td style={tdStyle}>
                  <span style={{
                    color: item.contribution >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: '600'
                  }}>
                    {item.contribution >= 0 ? '▲ Approval' : '▼ Rejection'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          New Application
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/history')}
        >
          View History
        </button>
      </div>
    </div>
  );
};

// ==============================
// Table Styles
// ==============================
const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '700',
  color: '#374151',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#374151',
};

export default Result;