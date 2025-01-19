const Nota = ({ title, content, color, onDelete }) => (
    <div className="note" style={{ backgroundColor: color }}>
        <div className="pin"></div> {/* Pin rojo */}
        <h3>{title}</h3>
        <p>{content}</p>
        <button className="delete-btn" onClick={onDelete}>🗑️</button>
    </div>
);

export default Nota;