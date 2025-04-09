import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScheduleForm.css";

const ScheduleForm = ({ authorities, schedules, setSchedules }) => {
  const [formData, setFormData] = useState({
    authority: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateSchedule = () => {
    const { date, time } = formData;

    const newDateTime = new Date(`${date}T${time}`);
    for (const schedule of schedules) {
      const existingDateTime = new Date(`${schedule.date}T${schedule.time}`);
      const diff = Math.abs(existingDateTime - newDateTime);

      if (diff < 15 * 60 * 1000) {
        return "Horário em conflito com outro agendamento.";
      }
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const conflictError = validateSchedule();
    if (conflictError) {
      setError(conflictError);
      return;
    }

    setSchedules((prev) => [...prev, formData]);
    navigate("/agendas");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agendar Apresentação</h2>

      {error && <p>{error}</p>}

      <div>
        <label>Autoridade:</label>
        <select
          name="authority"
          value={formData.authority}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione</option>
          {authorities.map((auth, index) => (
            <option key={index} value={`${auth.name}/${auth.role}`}>
              {`${auth.country}/${auth.name}/${auth.role}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Data:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          min="2025-11-18"
          max="2025-11-19"
          required
        />
      </div>

      <div>
        <label>Hora:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit">Agendar</button>
    </form>
  );
};

export default ScheduleForm;
