import Nota from "./Nota";

const ListaNotas = ({ notes, onDelete }) => (
    <div className="note-container">
        {notes.map((note, index) => (
            <Nota
                key={index}
                title={note.title}
                content={note.content}
                color={note.color}
                onDelete={() => onDelete(index)} // Manejo de eliminación
            />
        ))}
    </div>
);

export default ListaNotas;
