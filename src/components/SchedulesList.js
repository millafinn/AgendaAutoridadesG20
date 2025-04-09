import React from "react";
import "./SchedulesList.css";

const SchedulesList = ({ schedules }) => {
  const sortedSchedules = [...schedules].sort(
    (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );

  return (
    <div className="schedules-container">
      <h2>Agendas</h2>
      <ul className="schedules-list">
        {sortedSchedules.map((schedule, index) => (
          <li key={index}>
            <strong>
              {schedule.date} {schedule.time}
            </strong>
            {schedule.authority}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulesList;
