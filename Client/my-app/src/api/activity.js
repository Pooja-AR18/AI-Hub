import axios from 'axios';
const API_BASE = 'http://localhost:5000/api';

export async function getActivities(token) {
  const res = await axios.get(`${API_BASE}/activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function logActivity(payload, token) {
  const res = await axios.post(`${API_BASE}/activity`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
