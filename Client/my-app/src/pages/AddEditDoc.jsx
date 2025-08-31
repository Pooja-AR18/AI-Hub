import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as docsApi from '../api/docs';
import { useAuth } from '../context/AuthContext';

export default function AddEditDoc() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const { user, token } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [docOwner, setDocOwner] = useState(null);

  // Fetch doc if editing
  useEffect(() => {
    if (!editing) return;
    if (!token) return;

    (async () => {
      try {
        const doc = await docsApi.getDoc(id, token);

        // Save owner id for access control
        setDocOwner(doc.createdBy?._id);

        setTitle(doc.title || '');
        setContent(doc.content || '');
        setSummary(doc.summary || '');
        setTags((doc.tags || []).join(', '));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [editing, id, token]);

  // 🚫 Access Control → Only creator or admin can edit
  if (editing && user && docOwner && user.role !== 'admin' && user._id !== docOwner) {
    return (
      <div className="container">
        <div className="card">
          <h2>Not Authorized</h2>
          <p>You do not have permission to edit this document.</p>
        </div>
      </div>
    );
  }

  async function onSave(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title,
        content,
        summary,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editing) {
        await docsApi.updateDoc(id, payload, token);
      } else {
        await docsApi.createDoc(payload, token);
      }

      navigate('/', { replace: true });
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{editing ? 'Edit Document' : 'New Document'}</h2>

        <form className="row" onSubmit={onSave}>
          <div className="col">
            <label>Title</label>
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="col" style={{ flexBasis: '100%' }}>
            <label>Content</label>
            <textarea
              className="input"
              rows={12}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          <div className="col">
            <label>Summary</label>
            <textarea
              className="input"
              rows={4}
              value={summary}
              readonly
              placeholder="Will be auto-filled"
            />
          </div>

          <div className="col">
            <label>Tags (comma separated)</label>
            <input
              className="input"
              value={tags}
              readonly
              placeholder="knowledge, onboarding"
            />
          </div>

          {error && (
            <div className="small" style={{ color: '#ff9b9b' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" disabled={loading}>
              {editing ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
