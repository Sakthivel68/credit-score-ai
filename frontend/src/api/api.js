import axios from 'axios';

// ==============================
// Base URL — FastAPI Backend
// ==============================
const BASE_URL = 'http://127.0.0.1:8000';

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
    console.error('Full error:', error);
    console.error('Response:', error.response);
    console.error('Message:', error.message);
    if (error.response) {
      throw `Server error: ${error.response.status} — ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      throw 'Cannot reach backend. Is FastAPI running on port 8000?';
    } else {
      throw error.message;
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
    console.error('History error:', error.message);
    if (error.request) {
      throw 'Cannot reach backend. Is FastAPI running on port 8000?';
    }
    throw error.response?.data?.detail || 'Could not fetch history.';
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
    throw 'Backend is not reachable.';
  }
};