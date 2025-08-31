import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import TagChips from './TagChips';


// A card component to display document details and actions
export default function DocCard({ doc, currentUser, onSummarize, onGenTags, onDelete, onFilterTag, onViewVersions }) {
  const canEdit =
  currentUser?.role === "admin" || currentUser?._id === doc.createdBy?._id;


  return (
    <div className="card">
      <div className="header">
        <div>
          <h3 style={{ margin: '0 0 6px 0' }}>{doc.title}</h3>
          <div className="small">
            by {doc.createdBy?.name || '—'} · {dayjs(doc.updatedAt || doc.createdAt).format('MMM D, YYYY HH:mm')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={() => onViewVersions?.(doc)}>History</button>
          <button className="btn secondary" onClick={() => onSummarize?.(doc)}>Summarize with Gemini</button>
          <button className="btn secondary" onClick={() => onGenTags?.(doc)}>Generate Tags</button>
          {canEdit && <Link className="btn" to={`/edit/${doc._id}`}>Edit</Link>}
          {canEdit && <button className="btn warning" onClick={() => onDelete?.(doc)}>Delete</button>}
        </div>
      </div>
      <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{doc.summary || 'No summary yet.'}</p>
      <TagChips tags={doc.tags || []} onClick={onFilterTag} />
    </div>
  );
}
