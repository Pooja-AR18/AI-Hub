import api from './index';

// Include token in headers for protected routes
export async function listDocs(token) {
  const { data } = await api.get('/docs', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function getDoc(id, token) {
  const { data } = await api.get(`/docs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function createDoc(payload, token) {
  const { data } = await api.post('/docs', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function updateDoc(id, payload, token) {
  const { data } = await api.put(`/docs/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` } 
  });
  return data;
}


export async function deleteDoc(id, token) {
  const { data } = await api.delete(`/docs/${id}`, {
    headers: { Authorization: `Bearer ${token}` } 
  });
  return data;
}
