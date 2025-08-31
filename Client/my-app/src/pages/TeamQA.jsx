import { useState } from 'react';
import * as qaApi from '../api/qa';

export default function TeamQA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setError('');
    setLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const res = await qaApi.ask(question);
      setAnswer(res.answer || '');
      setSources(res.sources || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Team Q&A</h2>
        <form className="row" onSubmit={onAsk}>
          <div className="col" style={{ flex: 1 }}>
            <label>Ask a question</label>
            <input
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is our API throttling policy?"
            />
          </div>
          <button className="btn" disabled={loading || !question.trim()}>
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </form>
      </div>

      {error && <div className="small" style={{ color: '#ff9b9b', marginTop: 8 }}>{error}</div>}

      {answer && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Answer</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>

          {sources.length > 0 && (
            <>
              <hr className="sep" />
              <div className="small">Sources</div>
              <div style={{ marginTop: 6 }}>
                {sources.map((s, i) => (
                  <div key={i} className="small">
                    • {s.title || s._id || 'Doc'}
                    {s.score ? ` (score: ${s.score.toFixed?.(3)})` : ''}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
