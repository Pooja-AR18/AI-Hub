import axios from 'axios';

// Perform a search with the given payload and token
export async function search(payload, token) {
  const res = await axios.post('http://localhost:5000/api/search', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
