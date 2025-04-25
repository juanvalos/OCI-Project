import React, { useState } from "react";
import "../Assets/CreateSprint.css";

const CreateSprint = ({ onClose, onCreate }) => {
  const [newSprint, setNewSprint] = useState({
    name: "",
    description: "",
    project: "Telegram-Bot-Oracle",
    dueDate: "",
  });

  const handleCreateSprint = async () => {
    try {
      const response = await fetch("/sprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSprint),
      });

      if (response.ok) {
        alert("Sprint creado con éxito.");
        onCreate();
      } else {
        alert("Error al crear el Sprint.");
      }
    } catch (error) {
      console.error("Error creando el Sprint:", error);
      alert("No se pudo crear el Sprint.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Nuevo Sprint</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newSprint.name}
          onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newSprint.description}
          onChange={(e) =>
            setNewSprint({ ...newSprint, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Proyecto"
          value={newSprint.project}
          readOnly
        />

        <label>Fecha de Entrega:</label>
        <input
          type="date"
          name="dueDate"
          placeholder="mm / dd / aaaa"
          value={newSprint.dueDate}
          onChange={(e) =>
            setNewSprint({ ...newSprint, dueDate: e.target.value })
          }
        />

        {/* Contenedor de botones alineados */}
        <div className="buttons-container">
          <button className="close-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="close-button" onClick={handleCreateSprint}>
            Crear Sprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSprint;
