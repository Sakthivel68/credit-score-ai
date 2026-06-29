import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLoanApplication } from '../api/api';

// ==============================
// Initial Form State
// ==============================
const initialForm = {
  age: '',
  sex: '',
  job: '',
  housing: '',
  saving_accounts: '',
  checking_account: '',
  credit_amount: '',
  duration: '',
  purpose: '',
};

// ==============================
// LoanForm Component
// ==============================
const LoanForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert all values to numbers
      const payload = {
        age             : parseInt(form.age),
        sex             : parseInt(form.sex),
        job             : parseInt(form.job),
        housing         : parseInt(form.housing),
        saving_accounts : parseInt(form.saving_accounts),
        checking_account: parseInt(form.checking_account),
        credit_amount   : parseFloat(form.credit_amount),
        duration        : parseInt(form.duration),
        purpose         : parseInt(form.purpose),
      };

      const result = await submitLoanApplication(payload);

      // Navigate to result page with data
      navigate('/result', { state: { result } });

    } catch (err) {
      setError(typeof err === 'string' ? err : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a8a' }}>
          Loan Application
        </h1>
        <p style={{ color: '#6b7280', marginTop: '6px' }}>
          Fill in the customer details below to get an instant credit decision.
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>

            {/* Age */}
            <div>
              <label style={labelStyle}>Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 35"
                required
                style={inputStyle}
              />
            </div>

            {/* Sex */}
            <div>
              <label style={labelStyle}>Sex</label>
              <select name="sex" value={form.sex} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
            </div>

            {/* Job */}
            <div>
              <label style={labelStyle}>Job Type</label>
              <select name="job" value={form.job} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="0">Unskilled (Non-Resident)</option>
                <option value="1">Unskilled (Resident)</option>
                <option value="2">Skilled</option>
                <option value="3">Highly Skilled</option>
              </select>
            </div>

            {/* Housing */}
            <div>
              <label style={labelStyle}>Housing</label>
              <select name="housing" value={form.housing} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="0">Free</option>
                <option value="1">Own</option>
                <option value="2">Rent</option>
              </select>
            </div>

            {/* Saving Accounts */}
            <div>
              <label style={labelStyle}>Saving Accounts</label>
              <select name="saving_accounts" value={form.saving_accounts} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="0">None</option>
                <option value="1">Little</option>
                <option value="2">Moderate</option>
                <option value="3">Quite Rich</option>
                <option value="4">Rich</option>
              </select>
            </div>

            {/* Checking Account */}
            <div>
              <label style={labelStyle}>Checking Account</label>
              <select name="checking_account" value={form.checking_account} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="0">None</option>
                <option value="1">Little</option>
                <option value="2">Moderate</option>
                <option value="3">Rich</option>
              </select>
            </div>

            {/* Credit Amount */}
            <div>
              <label style={labelStyle}>Credit Amount (DM)</label>
              <input
                type="number"
                name="credit_amount"
                value={form.credit_amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                required
                style={inputStyle}
              />
            </div>

            {/* Duration */}
            <div>
              <label style={labelStyle}>Duration (Months)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 24"
                required
                style={inputStyle}
              />
            </div>

            {/* Purpose */}
            <div>
              <label style={labelStyle}>Purpose</label>
              <select name="purpose" value={form.purpose} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="0">Car</option>
                <option value="1">Furniture/Equipment</option>
                <option value="2">Radio/TV</option>
                <option value="3">Domestic Appliances</option>
                <option value="4">Repairs</option>
                <option value="5">Education</option>
                <option value="6">Business</option>
                <option value="7">Vacation/Others</option>
              </select>
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '200px' }}
            >
              {loading ? 'Analyzing...' : '🔍 Predict Credit Score'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ==============================
// Reusable Input Styles
// ==============================
const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '15px',
  outline: 'none',
  backgroundColor: '#f9fafb',
};

export default LoanForm;