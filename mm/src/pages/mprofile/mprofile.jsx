import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./mprofile.css";
import matchaIcon from "../../assets/matcha-tea.png";

const DEFAULT_API_BASE = "https://matcha-api-ktr6lb33ta-uc.a.run.app";

const MatchaProfile = ({ initialSessions, apiBaseUrl = DEFAULT_API_BASE }) => {
  const [sessions, setSessions] = useState(initialSessions || []);
  const [loading, setLoading] = useState(!initialSessions);
  const [error, setError] = useState(null);
  const [editingIds, setEditingIds] = useState(new Set()); // per‑card edit state

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all"); // "all", "01".."12"

  /* FETCH MATCHA SESSIONS */
  useEffect(() => {
    if (initialSessions) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${apiBaseUrl}/matcha-sessions`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        setSessions(data);
      } catch (err) {
        setError(err.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [apiBaseUrl, initialSessions]);

/* CREATE NEW SESSION */
const handleCreateSession = async () => {
  try {
    const newSession = {
      brand: "",
      matcha_type: "Ceremonial Grade",
      location: "",
      rating: 0,
      notes: "",
      session_date: new Date().toISOString().slice(0, 10),
    };

    const res = await fetch(`${apiBaseUrl}/matcha-sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession),
    });

    if (!res.ok) throw new Error("Failed to create session");

    const created = await res.json();

    // Put the new session at the beginning so it shows first
    setSessions((prev) => [created, ...prev]);

    // Start this new card in edit mode
    setEditingIds((prev) => new Set(prev).add(created.id));
  } catch (err) {
    console.error(err);
    alert("Could not create new session: " + err.message);
  }
};

  /* EDIT / VIEW PER CARD */
  const isEditing = (id) => editingIds.has(id);

  const toggleEditing = (id) => {
    setEditingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFieldChange = (id, field, value) => {
    if (!isEditing(id)) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (session) => {
    if (!isEditing(session.id)) return;

    try {
      const res = await fetch(`${apiBaseUrl}/matcha-sessions/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      if (!res.ok) throw new Error("Save failed");

      const updated = await res.json();
      setSessions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      toggleEditing(session.id);
      alert("Session saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save session");
    }
  };

  /* DELETE SESSION */
  const handleDelete = async (sessionId) => {
    const confirmed = window.confirm(
      "Delete this matcha entry? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiBaseUrl}/matcha-sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setEditingIds((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete session");
    }
  };

  /* FILTERED SESSIONS (search + type + month) */
  const filteredSessions = sessions.filter((session) => {
    // search by name (brand)
    const nameMatch = session.brand
      ? session.brand.toLowerCase().includes(searchTerm.toLowerCase())
      : searchTerm.trim() === "";

    // filter by type
    const typeMatch =
      filterType === "all" || session.matcha_type === filterType;

    // filter by month from session_date "YYYY-MM-DD"
    let monthMatch = true;
    if (filterMonth !== "all" && session.session_date) {
      const parts = session.session_date.split("-");
      const month = parts[1]; // "01".."12"
      monthMatch = month === filterMonth;
    }

    return nameMatch && typeMatch && monthMatch;
  });

  if (loading) return <div>Loading matcha sessions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />

      <div className="matcha-title-bar">
        <h2 className="matcha-title">Track your matcha sessions</h2>
      </div>

{/* Filters + New button */}
<div className="matcha-filters-bar">
  {/* New first */}
  <div className="matcha-create-btn">
    <button onClick={handleCreateSession}>+ New Matcha Entry</button>
  </div>

  <div className="matcha-filter-group">
    <label>
      Search by name
      <input
        type="text"
        className="matcha-filter-input"
        placeholder="e.g. Morning matcha"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </label>
  </div>

  <div className="matcha-filter-group">
    <label>
      Type
      <select
        className="matcha-filter-select"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All types</option>
        <option value="Ceremonial Grade">Ceremonial Grade</option>
        <option value="Premium Grade">Premium Grade</option>
        <option value="Culinary Grade">Culinary Grade</option>
        <option value="Latte Grade">Latte Grade</option>
      </select>
    </label>
  </div>

  <div className="matcha-filter-group">
    <label>
      Month
      <select
        className="matcha-filter-select"
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
      >
        <option value="all">All months</option>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </label>
  </div>
</div>


      <div className="matcha-profile-container">
        {sessions.length === 0 ? (
          <div className="matcha-empty-state">
            <p>You do not have any matcha entries yet.</p>
            <p>Tap &ldquo;+ New Matcha Entry&rdquo; to start your collection.</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="matcha-empty-state">
            <p>No sessions match your filters.</p>
          </div>
        ) : (
          <div className="matcha-card-grid">
            {filteredSessions.map((session, index) => {
              const editing = isEditing(session.id);
              return (
                <div key={session.id} className="matcha-card">
                  <div className="matcha-card-header">
                    <span className="matcha-card-title">
                      {session.brand && session.brand.trim().length > 0
                        ? session.brand
                        : "New Matcha"}
                    </span>
                    <span className="matcha-card-chip">
                      Session {index + 1}
                    </span>
                  </div>

                  <div className="matcha-card-icon">
                    <img
                      src={matchaIcon}
                      alt="Matcha bowl"
                      className="matcha-card-icon-img"
                    />
                  </div>

                  <div className="matcha-card-meta">
                    <span className="matcha-card-type">
                      {session.matcha_type}
                    </span>
                    {session.location && (
                      <span className="matcha-card-location">
                        {session.location}
                      </span>
                    )}
                  </div>

                  <div className="matcha-card-body">
                    <label>
                      Matcha name
                      <input
                        type="text"
                        value={session.brand}
                        disabled={!editing}
                        onChange={(e) =>
                          handleFieldChange(
                            session.id,
                            "brand",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Type
                      <select
                        value={session.matcha_type}
                        disabled={!editing}
                        onChange={(e) =>
                          handleFieldChange(
                            session.id,
                            "matcha_type",
                            e.target.value
                          )
                        }
                      >
                        <option value="Ceremonial Grade">
                          Ceremonial Grade
                        </option>
                        <option value="Premium Grade">Premium Grade</option>
                        <option value="Culinary Grade">Culinary Grade</option>
                        <option value="Latte Grade">Latte Grade</option>
                      </select>
                    </label>

                    <label>
                      Location
                      <input
                        type="text"
                        value={session.location}
                        disabled={!editing}
                        onChange={(e) =>
                          handleFieldChange(
                            session.id,
                            "location",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Rating
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.5}
                        value={session.rating}
                        disabled={!editing}
                        onChange={(e) =>
                          handleFieldChange(
                            session.id,
                            "rating",
                            Number(e.target.value)
                          )
                        }
                      />
                    </label>

                    <label>
                      Date
                      <input
                        type="date"
                        value={session.session_date}
                        disabled={!editing}
                        onChange={(e) =>
                          handleFieldChange(
                            session.id,
                            "session_date",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Notes
                      <textarea
                        rows={3}
                        value={session.notes || ""}
                        disabled={!editing}
                        onChange={(e) =>
                          handleFieldChange(
                            session.id,
                            "notes",
                            e.target.value
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="matcha-card-footer">
                    <div className="matcha-card-footer-left">
                      <button
                        className="matcha-card-mode-btn"
                        onClick={() => toggleEditing(session.id)}
                      >
                        {editing ? "View only" : "Edit entry"}
                      </button>
                      {editing && (
                        <button
                          className="matcha-card-save-btn"
                          onClick={() => handleSave(session)}
                        >
                          Save
                        </button>
                      )}
                    </div>

                    {editing && (
                      <button
                        className="matcha-card-delete-btn"
                        onClick={() => handleDelete(session.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MatchaProfile;
