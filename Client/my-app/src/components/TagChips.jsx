
// A component to display a list of tags as clickable chips

    export default function TagChips({ tags = [], onClick }) {
        return (
            <div style={{ marginTop: 8 }}>
                {tags.map((t) => (
                <button key={t} className="badge" onClick={() => onClick?.(t)} title="Filter by tag">
                #{t}
                </button>
                ))}
            </div>
            );
    }