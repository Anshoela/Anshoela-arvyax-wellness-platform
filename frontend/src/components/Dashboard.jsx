import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sessions")
      .then((res) => {
        console.log("Fetched sessions:", res.data);
        setSessions(res.data);
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">All Sessions</h1>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map((session) => (
          <div key={session._id}>
  <div className="session-card">
    <div className="image-card">
      <img src={session.photo} alt={session.title} />
    </div>
    <div className="text-card">
  <div className="title-wrapper">
    <h2>{session.title}</h2>
  </div>
  <p>{session.description}</p>
  <h1>{session.name}</h1>
</div>
  </div>
  <div className="card-divider"></div>
</div>

        ))
      )}
    </div>
  );
};

export default Dashboard;
