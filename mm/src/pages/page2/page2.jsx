import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./page2.css";
import Navbar from "../../components/Navbar/Navbar";

const API_BASE_URL =
  "https://matchamania-rankings-api-945802238964.us-central1.run.app";

const Page2 = () => {
  const { userId, loading: authLoading } = useAuth();

  const [data, setData] = useState([]); // rows with rankingId + itemIndex
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false); // global edit mode

  const [newRow, setNewRow] = useState({
    "Product Name": "",
    Rating: "",
    Origin: "cafe",
    "Rating/Price per g": "",
  });

  // Flatten rankings from API into rows that keep rankingId + itemIndex
  const formatRankingsToRows = (rankings) => {
    if (!Array.isArray(rankings)) return [];
    const rows = [];

    rankings.forEach((ranking) => {
      const rankingId = ranking.id;
      const items = Array.isArray(ranking.items) ? ranking.items : [];
      items.forEach((item, index) => {
        rows.push({
          rowId: `${rankingId}-${index}`,
          rankingId,
          itemIndex: index,
          "Product Name": item.name ?? "",
          Rating: item.rating ?? "",
          Origin: item.origin ?? "",
          "Rating/Price per g": item.cost_per_gram ?? "",
        });
      });
    });

    return rows;
  };

  useEffect(() => {
    if (authLoading) return;

    const effectiveUserId = userId || localStorage.getItem("user_id");
    if (!effectiveUserId) {
      setError("Please log in to view rankings");
      setLoading(false);
      return;
    }

    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/ranking?user_id=${effectiveUserId}`
        );
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const json = await response.json();
        const rankings = Array.isArray(json) ? json : [json];
        setData(formatRankingsToRows(rankings));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [userId, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const clampRating = (raw) => {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return 0;
    if (n < 0) return 0;
    if (n > 5) return 5;
    return n;
  };

  const clampGrams = (raw) => {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return 0;
    if (n < 0) return 0;
    if (n > 1000) return 1000;
    return n;
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    const effectiveUserId = userId || localStorage.getItem("user_id");

    const item = {
      name: newRow["Product Name"],
      origin: newRow.Origin,
      rating: clampRating(newRow.Rating),
      cost_per_gram: clampGrams(newRow["Rating/Price per g"]),
    };

    const payload = {
      id: crypto.randomUUID(),
      user_id: effectiveUserId,
      items: [item],
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/ranking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let reason = `Failed to save ranking (${res.status})`;
        try {
          const errJson = await res.json();
          reason += `: ${JSON.stringify(errJson)}`;
        } catch (_) {}
        throw new Error(reason);
      }

      const saved = await res.json();
      setData((prev) => [...prev, ...formatRankingsToRows([saved])]);
      setNewRow({
        "Product Name": "",
        Rating: "",
        Origin: "cafe",
        "Rating/Price per g": "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE /ranking/{id}
  const handleDeleteRanking = async (rankingId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/ranking/${rankingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let reason = `Failed to delete ranking (${res.status})`;
        try {
          const errJson = await res.json();
          reason += `: ${JSON.stringify(errJson)}`;
        } catch (_) {}
        throw new Error(reason);
      }

      setData((prev) => prev.filter((row) => row.rankingId !== rankingId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PATCH /ranking/{id}/item/{item_index}
  const handlePatchItem = async (row) => {
    const { rankingId, itemIndex, Rating, ["Rating/Price per g"]: price } = row;

    const body = {
      rating: clampRating(Rating),
      cost_per_gram: clampGrams(price),
    };

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/ranking/${rankingId}/item/${itemIndex}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        let reason = `Failed to update item (${res.status})`;
        try {
          const errJson = await res.json();
          reason += `: ${JSON.stringify(errJson)}`;
        } catch (_) {}
        throw new Error(reason);
      }

      const updatedRanking = await res.json();
      setData((prev) => {
        const others = prev.filter((r) => r.rankingId !== rankingId);
        const updatedRows = formatRankingsToRows([updatedRanking]);
        return [...others, ...updatedRows];
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // update fields while in global edit mode (used before calling handlePatchItem manually if you want)
  const handleEditFieldChange = (rowId, field, value) => {
    setData((prev) =>
      prev.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  if (authLoading) {
    return <div className="loading-screen">Authenticating...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="page2">
        <div className="page2-inner">
          <header className="page2-header">
            <h1 className="page2-title">Your Matcha Rankings</h1>

            <div className="delete-toggle-wrapper">
              {/* Edit toggle */}
              {!editMode ? (
                <button
                  type="button"
                  className="delete-toggle-button"
                  onClick={() => {
                    setEditMode(true);
                    setDeleteMode(false);
                  }}
                >
                  Edit Rankings
                </button>
              ) : (
                <button
                  type="button"
                  className="delete-toggle-button done"
                  onClick={async () => {
                    // optional: batch-save all rows here if needed
                    setEditMode(false);
                  }}
                >
                  Done Editing
                </button>
              )}

              {/* Delete toggle */}
              {!deleteMode ? (
                <button
                  type="button"
                  className="delete-toggle-button"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => {
                    setDeleteMode(true);
                    setEditMode(false);
                  }}
                >
                  Delete Rankings
                </button>
              ) : (
                <button
                  type="button"
                  className="delete-toggle-button done"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => setDeleteMode(false)}
                >
                  Done Deleting
                </button>
              )}
            </div>
          </header>

          <main className="card">
            {error && <div className="error-banner">⚠️ {error}</div>}

            <div className="card-table">
              {/* Header row */}
              <div className="table-header">
                <div className="th-client">Product</div>
                <div className="th-date">Origin</div>
                <div className="th-status">Rating</div>
                <div className="th-amount">$/g</div>
                <div className="th-delete" />
              </div>

              {loading && <div className="loader">Updating...</div>}

              {/* Table body */}
              <div className="table-scroll">
                {data.map((row, index) => (
                  <div
                    key={row.rowId}
                    className={`table-row ${
                      index % 2 === 0 ? "row-pink" : "row-green"
                    } ${(deleteMode || editMode) ? "with-delete" : ""}`}
                  >
                    {/* Product */}
                    <div className="col-client">
                      <div className="client-main">
                        {row["Product Name"]}
                      </div>
                      <div className="client-sub">{row.Origin}</div>
                    </div>

                    {/* Origin */}
                    <div className="col-date">
                      <div className="date-main">{row.Origin}</div>
                      <div className="date-sub">Single origin</div>
                    </div>

                    {/* Rating */}
                    <div className="col-status">
                      {editMode ? (
                        <input
                          type="number"
                          step="0.1"
                          value={row.Rating}
                          onChange={(e) =>
                            handleEditFieldChange(
                              row.rowId,
                              "Rating",
                              e.target.value
                            )
                          }
                          style={{ width: "70px", borderRadius: "999px" }}
                        />
                      ) : (
                        <span className="status-pill status-rating">
                          ⭐ {row.Rating}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="col-amount">
                      {editMode ? (
                        <input
                          type="number"
                          step="0.01"
                          value={row["Rating/Price per g"]}
                          onChange={(e) =>
                            handleEditFieldChange(
                              row.rowId,
                              "Rating/Price per g",
                              e.target.value
                            )
                          }
                          style={{ width: "90px", borderRadius: "999px" }}
                        />
                      ) : (
                        <>
                          <div className="amount-main">
                            ${row["Rating/Price per g"]}/g
                          </div>
                          <div className="amount-sub">Rating/price</div>
                        </>
                      )}
                    </div>

                    {/* Actions column */}
                    <div className="col-delete">
                      {deleteMode ? (
                        <button
                          type="button"
                          className="row-delete-button"
                          onClick={() => handleDeleteRanking(row.rankingId)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddRow} className="inline-form-row">
                <input
                  name="Product Name"
                  value={newRow["Product Name"]}
                  onChange={handleInputChange}
                  placeholder="Product name"
                  required
                />

                <select
                  name="Origin"
                  value={newRow.Origin}
                  onChange={handleInputChange}
                  required
                  className="origin-select"
                >
                  <option value="cafe">Cafe</option>
                  <option value="home">Home</option>
                </select>

                <input
                  name="Rating"
                  type="number"
                  step="0.1"
                  value={newRow.Rating}
                  onChange={handleInputChange}
                  placeholder="Rating"
                  required
                />
                <input
                  name="Rating/Price per g"
                  type="number"
                  step="0.01"
                  value={newRow["Rating/Price per g"]}
                  onChange={handleInputChange}
                  placeholder="$/g"
                  required
                />
                <button type="submit" disabled={loading}>
                  Add
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Page2;
