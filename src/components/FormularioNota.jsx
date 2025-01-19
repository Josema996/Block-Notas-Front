import React, { useState } from "react";

const FormularioNota = ({ onAdd }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const handleAddNote = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("¡Ups! Debes agregar un título para la nota.");
            return;
        }
        if (!content.trim()) {
            setError("¡Oh no! Debes agregar contenido a la nota.");
            return;
        }
        setError(""); // Limpia el error si todo está bien
        onAdd({ title, content });
        setTitle("");
        setContent("");
    };

    return (
        <form onSubmit={handleAddNote}>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Contenido (máximo 120 caracteres)"
                value={content}
                maxLength={120}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Crear Nota</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default FormularioNota;
