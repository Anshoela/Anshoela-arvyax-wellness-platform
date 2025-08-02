import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MySession.css";
import AddSession from "./AddSession";

function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);

  const token = localStorage.getItem("token");

  const fetchSessions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/sessions/my-sessions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSessions(res.data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this session?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSessions();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = async (id) => {
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDesc);
    if (editPhoto) {
      formData.append("photo", editPhoto);
    }

    await axios.put(`http://localhost:5000/api/sessions/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setEditId(null);
    setEditPhoto(null);
    fetchSessions();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "draft" ? "Published" : "draft";
    try {
      await axios.patch(
        `http://localhost:5000/api/sessions/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessions((prev) =>
        prev.map((session) =>
          session._id === id ? { ...session, status: newStatus } : session
        )
      );
    } catch (err) {
      console.error("Status toggle failed:", err);
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="my-sessions-container">
      <h2>My Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li
            key={session._id}
            style={{ marginBottom: "2rem" }}
            className="session-item"
          >
            <img
              src={`http://localhost:5000/uploads/${session.photo}`}
              alt={session.title}
              style={{
                width: "200px",
                height: "auto",
                display: "block",
                marginBottom: "0.5rem",
              }}
            />
            {editId === session._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />
                <br />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description"
                />
                <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditPhoto(e.target.files[0])}
                />
                <br />
                <button onClick={() => handleEdit(session._id)}>Save</button>
              </>
            ) : (
              <>
                <h4>{session.title}</h4>
                <p>{session.description}</p>
                <button
                  onClick={() => {
                    setEditId(session._id);
                    setEditTitle(session.title);
                    setEditDesc(session.description);
                  }}
                >
                  Edit
                </button>
                <p>
                  Status:
                  <span
                    style={{
                      color:
                        session.status === "published" ? "green" : "orange",
                    }}
                  >
                    {session.status}
                  </span>
                </p>
                <button
                  onClick={() =>
                    handleToggleStatus(session._id, session.status)
                  }
                >
                  Set as {session.status === "draft" ? "Published" : "draft"}
                </button>
              </>
            )}
            <button onClick={() => handleDelete(session._id)}>Delete</button>
          </li>
        ))}
      </ul>
       <AddSession/>
    </div>
   
  );
}

export default MySessions;
