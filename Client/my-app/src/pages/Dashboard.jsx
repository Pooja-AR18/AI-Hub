import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import DocCard from "../components/DocCard";


const API_BASE = "http://localhost:5000/api";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // states for modal results
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [history, setHistory] = useState([]);
  const [modalType, setModalType] = useState(""); // 'summary'|'tags'|'history'
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/docs`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to fetch documents");
        }

        const data = await res.json();
        setDocs(data);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [token]);

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.title}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/docs/${doc._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to delete document");
      }

      setDocs((prev) => prev.filter((d) => d._id !== doc._id));
    } catch (err) {
      alert(err.message);
    }
  }


// --- Summarize ---
const handleSummarize = async (doc) => {
  setModalOpen(true);
  setModalType("summary");
  setModalLoading(true);

  try {
    const res = await fetch(`${API_BASE}/docs/${doc._id}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: doc.content }),
    });

    if (!res.ok) throw new Error("Error generating summary");
    const data = await res.json();
    setSummary(data.summary);
  } catch (err) {
    setSummary(`❌ ${err.message}`);
  } finally {
    setModalLoading(false);
  }
};

// --- Generate Tags ---
const handleGenTags = async (doc) => {
  setModalOpen(true);
  setModalType("tags");
  setModalLoading(true);

  try {
    const res = await fetch(`${API_BASE}/docs/${doc._id}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: doc.content }),
    });

    if (!res.ok) throw new Error("Error generating tags");
    const data = await res.json();
    setTags(data.tags);
  } catch (err) {
    setTags([`❌ ${err.message}`]);
  } finally {
    setModalLoading(false);
  }
};

// --- View History ---
const handleViewHistory = async (doc) => {
  setModalOpen(true);
  setModalType("history");
  setModalLoading(true);

  try {
    const res = await fetch(`${API_BASE}/docs/${doc._id}/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error fetching history");
    const data = await res.json();
    setHistory(data.history || []);
  } catch (err) {
    setHistory([{ action: `❌ ${err.message}` }]);
  } finally {
    setModalLoading(false);
  }
};



  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name || "User"} 👋</h2>
     <div className="info">
      <p>All Documents.
       Only you can edit your own documents!</p>
     </div>
      {docs.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="doc-list">
                  {docs.map((doc) => (
       <DocCard
  key={doc._id}
  doc={doc}
  currentUser={user}   // 👈 FIX: Pass user here
  onDelete={handleDelete}
  onFilterTag={(tag) => alert(`Filter docs by tag: ${tag}`)}
  onSummarize={() => handleSummarize(doc)}
  onGenTags={() => handleGenTags(doc)}
  onViewVersions={() => handleViewHistory(doc)}
/>



          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setModalOpen(false)}>✖ Close</button>
            {modalLoading && <p>Loading...</p>}

            {modalType === "summary" && !modalLoading && (
              <>
                <h3>AI Summary</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
              </>
            )}

            {modalType === "tags" && !modalLoading && (
              <>
                <h3>Generated Tags</h3>
                <ul>
                  {tags.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </>
            )}

            {modalType === "history" && !modalLoading && (
              <>
                <h3>Document History</h3>
                <ul>
                  {history.length === 0 && <li>No history yet.</li>}
                  {history.map((h, i) => (
                    <li key={i}>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {h.at ? new Date(h.at).toLocaleString() : ''} {h.by?.name ? `by ${h.by.name}` : ''}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <strong>{h.action}</strong>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{h.snapshot ? JSON.stringify(h.snapshot) : ''}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
