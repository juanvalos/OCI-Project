import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import "../Assets/CreateTask.css";

const CreateTask = ({ onClose }) => {
  const { sprintId } = useContext(SprintContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [taskDetails, setTaskDetails] = useState({
    name: "",
    description: "",
    difficulty: "Media",
    priority: "Media",
    state: "Sin empezar",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setTaskDetails({ ...taskDetails, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    if (!selectedUser || !taskDetails.name || !taskDetails.description) {
      alert("Selecciona un usuario, escribe un nombre y una descripción para la tarea.");
      return;
    }

    const newTask = {
      name: taskDetails.name,
      description: taskDetails.description,
      difficulty: taskDetails.difficulty,
      priority: taskDetails.priority,
      state: taskDetails.state,
      sprintId: sprintId,
      oracleUserId: selectedUser,
    };

    console.log("Tarea a enviar:", newTask);

    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        alert("Tarea creada con éxito");
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        alert("Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error al enviar la tarea:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Crear Nueva Tarea</h2>

        <label>Asignar a:</label>
        <select onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Nombre de la tarea"
          value={taskDetails.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={taskDetails.description}
          onChange={handleChange}
        />

        <label>Dificultad:</label>
        <select name="difficulty" value={taskDetails.difficulty} onChange={handleChange}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <label>Prioridad:</label>
        <select name="priority" value={taskDetails.priority} onChange={handleChange}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <label>Estado:</label>
        <select name="state" value={taskDetails.state} onChange={handleChange}>
          <option value="Sin empezar">Sin empezar</option>
          <option value="En progreso">En progreso</option>
          <option value="Terminada">Terminada</option>
        </select>

        <div className="buttons-container">
          <button className="close-button" onClick={handleCreateTask}>
            Crear Task
          </button>
          <button className="close-button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
