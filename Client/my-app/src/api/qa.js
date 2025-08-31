import api from './index'; 

// Ask a question to the backend
export async function ask(question) {
  const { data } = await api.post('/qa', { question });
  return data; // { answer, sources }
}
