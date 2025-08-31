import { useEffect, useState } from 'react';
import * as searchApi from '../api/search';
import { useAuth } from '../context/AuthContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('text'); // 'text' | 'semantic'
  const [tags, setTags] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const runSearch = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        query,
        mode,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      console.log('Sending payload to API:', payload);

      const res = await searchApi.search(payload, token); // your API call
      console.log('Search results from API:', res);

      setResults(res.results || []);
    } catch (err) {
      console.error('Search API error:', err);
      setError(err.message || 'Error during search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optional: auto search on mount
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Search</h2>
        <form className="row" onSubmit={runSearch}>
          <div className="col">
            <label>Query</label>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. onboarding docs"
            />
          </div>
          <div className="col">
            <label>Mode</label>
            <select
              className="input"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="semantic">Semantic (AI)</option>
            </select>
          </div>
          <div className="col">
            <label>Tags (optional)</label>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma separated"
            />
          </div>

          {error && (
            <div className="small" style={{ color: '#ff9b9b' }}>
              {error}
            </div>
          )}

          <button className="btn" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      <div style={{ height: 16 }} />

      <div className="grid">
        {results.length > 0 ? (
          results.map((r) => (
            <div key={r._id || Math.random()} className="card">
              <div className="header">
                <h3 style={{ margin: 0 }}>{r.title || 'Untitled'}</h3>
                <span className="small">
                  Score: {typeof r.score === 'number' ? r.score.toFixed(3) : '0.000'}
                </span>
              </div>

              <p className="small" style={{ whiteSpace: 'pre-wrap' }}>
                {r.summary
                  ? r.summary.length > 300
                    ? r.summary.slice(0, 300) + '…'
                    : r.summary
                  : r.content?.slice(0, 200) + '…'}
              </p>

              <div>
                {(r.tags || []).map((t) => (
                  <span key={t} className="badge">#{t}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="small">No results yet.</div>
        )}
      </div>
    </div>
  );
}
