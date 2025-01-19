import React, { useState, useEffect } from "react";
import "./styles/main.css";
import Login from "./pages/Login.jsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para el login
  const [token, setToken] = useState(null); // Guardar el token JWT
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [criterioBusqueda, setCriterioBusqueda] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    if (token) {
      obtenerNotas();
    }
  }, [token]);

  const obtenerNotas = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotas(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener las notas:", error);
    }
  };

  const agregarNota = async () => {
    if (!titulo) {
      setMensajeError("El título no puede estar vacío.");
      setTimeout(() => setMensajeError(""), 3000);
      return;
    }

    if (!contenido) {
      setMensajeError("El contenido no puede estar vacío.");
      setTimeout(() => setMensajeError(""), 3000);
      return;
    }

    const nuevaNota = {
      titulo,
      contenido,
      estado: "Nueva carga",
    };

    try {
      const response = await fetch("http://localhost:5000/api/notas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaNota),
      });

      const data = await response.json();

      if (response.ok) {
        setNotas([...notas, data]); // Agregar la nota al estado
        setTitulo("");
        setContenido("");
      } else {
        setMensajeError(data.message || "Error al guardar la nota.");
        setTimeout(() => setMensajeError(""), 3000);
      }
    } catch (error) {
      setMensajeError("Error al conectar con el servidor.");
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  const cambiarEstadoNota = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        setNotas((notas) =>
          notas.map((nota) =>
            nota.id === id ? { ...nota, estado: nuevoEstado } : nota
          )
        );
      } else {
        console.error("Error al actualizar el estado.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const eliminarNota = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotas(notas.filter((nota) => nota.id !== id));
      } else {
        console.error("Error al eliminar la nota.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const realizarBusqueda = () => {
    setBusqueda(criterioBusqueda);
  };

  const notasFiltradas = notas.filter((nota) =>
    nota.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const notasNuevas = notasFiltradas.filter(
    (nota) => nota.estado === "Nueva carga"
  );
  const notasEnProceso = notasFiltradas.filter(
    (nota) => nota.estado === "En proceso"
  );
  const notasFinalizadas = notasFiltradas.filter(
    (nota) => nota.estado === "Finalizado"
  );

  return loggedIn ? (
    <div className="app">
      <div className="header-container">
        <h1>Bloc de Notas</h1>
        {mensajeError && <div className="error-message">{mensajeError}</div>}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="Contenido (máximo 120 caracteres)"
            maxLength="120"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <button type="button" onClick={agregarNota}>
            Guardar
          </button>
        </form>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar por título..."
            value={criterioBusqueda}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          <button className="search-btn" onClick={realizarBusqueda}>
            🔍
          </button>
        </div>
      </div>

      <div className="estado-container">
        <div className="estado">
          <h2>Nueva carga</h2>
          <div className="note-container">
            {notasNuevas.map((nota, index) => (
              <Nota
                key={nota.id}
                nota={nota}
                cambiarEstadoNota={cambiarEstadoNota}
                eliminarNota={eliminarNota}
              />
            ))}
          </div>
        </div>
        <div className="estado">
          <h2>En proceso</h2>
          <div className="note-container">
            {notasEnProceso.map((nota, index) => (
              <Nota
                key={nota.id}
                nota={nota}
                cambiarEstadoNota={cambiarEstadoNota}
                eliminarNota={eliminarNota}
              />
            ))}
          </div>
        </div>
        <div className="estado">
          <h2>Finalizadas</h2>
          <div className="note-container">
            {notasFinalizadas.map((nota, index) => (
              <Nota
                key={nota.id}
                nota={nota}
                cambiarEstadoNota={cambiarEstadoNota}
                eliminarNota={eliminarNota}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Login
      onLogin={(token) => {
        setLoggedIn(true);
        setToken(token);
      }}
    />
  );
}

function Nota({ nota, cambiarEstadoNota, eliminarNota }) {
  return (
    <div className="note">
      <select
        value={nota.estado}
        onChange={(e) => cambiarEstadoNota(nota.id, e.target.value)}
      >
        <option value="Nueva carga">Nueva carga</option>
        <option value="En proceso">En proceso</option>
        <option value="Finalizado">Finalizado</option>
      </select>
      <h3>{nota.titulo}</h3>
      <p>{nota.contenido}</p>
      <button onClick={() => eliminarNota(nota.id)}>🗑️</button>
    </div>
  );
}

export default App;
