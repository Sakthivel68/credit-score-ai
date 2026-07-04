import axios from 'axios';

// ==============================
// Base URL — FastAPI Backend
// ==============================
const BASE_URL = 'https://credit-score-aicredit-score-ai-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// Submit Loan Application
// ==============================
export const submitLoanApplication = async (formData) => {
  try {
    const response = await api.post('/predict', formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Cannot reach backend. Is FastAPI running?');
    } else {
      throw new Error(error.message);
    }
  }
};

// ==============================
// Get Prediction History
// ==============================
export const getPredictionHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    if (error.request) {
      throw new Error('Cannot reach backend.');
    }
    throw new Error(error.response?.data?.detail || 'Could not fetch history.');
  }
};

// ==============================
// Health Check
// ==============================
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend is not reachable.');
  }
};