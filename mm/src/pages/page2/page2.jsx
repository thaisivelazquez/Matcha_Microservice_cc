import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './page2.css';
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page2 = () => {
  const { userId, loading: authLoading } = useAuth();

  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    image: null,
    'Product Name': '',
    Rating: '',
    Origin: '',
    'Rating/Price per g': ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Product',
        accessor: 'Product Name',
        Cell: ({ row }) => (
          <div className="client-cell">
            <div className="client-logo">
              {row.original.image ? (
                <img src={row.original.image} alt="product" />
              ) : (
                <span className="logo-placeholder">🍵</span>
              )}
            </div>
            <div className="client-main">
              <div className="client-title">
                {row.original['Product Name']}
              </div>
              <div className="client-sub">{row.original.Origin}</div>
            </div>
          </div>
        ),
      },
      { Header: 'Rating', accessor: 'Rating' },
      { Header: 'Value/g', accessor: 'Rating/Price per g' },
    ],
    []
  );

  useEffect(() => {
    if (authLoading) return;

    const effectiveUserId = userId || localStorage.getItem('user_id');
    if (!effectiveUserId) {
      setLoading(false);
      setError('Please log in first');
      return;
    }

    const url =
      `https://matchamania-rankings-api-945802238964.us-central1.run.app/ranking` +
      `?user_id=${encodeURIComponent(effectiveUserId)}`;

    const idToken = localStorage.getItem('google_id_token');

    setLoading(true);
    setError(null);

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((json) => {
        const outer = Array.isArray(json) ? json : [];
        const rankings = Array.isArray(outer[0]) ? outer[0] : [];

        const ranking =
          rankings.find((r) => r.user_id === effectiveUserId) || rankings[0];

        const items =
          ranking && Array.isArray(ranking.items) ? ranking.items : [];

        const formatted = items.map((item) => ({
          image: null,
          'Product Name': item.name ?? '',
          Rating: item.rating ?? '',
          Origin: item.origin ?? '',
          'Rating/Price per g': item.cost_per_gram ?? '',
        }));

        setData(formatted);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch rankings', err);
        setError(err.message || 'Failed to fetch rankings');
      })
      .finally(() => setLoading(false));
  }, [userId, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setNewRow((prev) => ({ ...prev, image: url }));
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    setData((prev) => [...prev, newRow]);
    setNewRow({
      image: null,
      'Product Name': '',
      Rating: '',
      Origin: '',
      'Rating/Price per g': ''
    });
    setPreviewUrl(null);
  };

  const handleDeleteRow = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  if (authLoading) return <div>Loading user...</div>;

  return (
    <>
      <Navbar />

      <div className="page2">
        <div className="page2-inner">
          <div className="page2-header">
            <h1 className="page2-title">Your Matcha Rankings</h1>
            <div className="page2-header-actions">
              <button className="btn-filters">Filters</button>
              <button className="btn-new-matcha">+ New Matcha</button>
            </div>
          </div>

          <div className="card">
            <div className="card-toolbar">
              <input
                className="search-input"
                placeholder="Search Matcha"
              />
            </div>

            <div className="card-table">
              {loading && <p>Fetching rankings...</p>}
              {error && <p className="error-text">Error: {error}</p>}
              {!loading && !error && data.length === 0 && (
                <p>No ranking items available yet.</p>
              )}
              {!loading && !error && data.length > 0 && (
                <Table
                  columns={columns}
                  data={data}
                  handleDeleteRow={handleDeleteRow}
                />
              )}

              <form onSubmit={handleAddRow} className="inline-form-row">
                <div className="client-cell">
                  <label className="upload-logo">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" />
                    ) : (
                      <span className="logo-placeholder">+</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                  <div className="client-main">
                    <input
                      className="input-plain"
                      name="Product Name"
                      value={newRow['Product Name']}
                      onChange={handleInputChange}
                      placeholder="Product name"
                      required
                    />
                    <input
                      className="input-plain sub"
                      name="Origin"
                      value={newRow.Origin}
                      onChange={handleInputChange}
                      placeholder="Origin"
                      required
                    />
                  </div>
                </div>

                <input
                  className="inline-number"
                  type="number"
                  name="Rating"
                  value={newRow.Rating}
                  onChange={handleInputChange}
                  placeholder="Rating"
                  max="5"
                  step="0.1"
                  required
                />
                <input
                  className="inline-number"
                  type="number"
                  name="Rating/Price per g"
                  value={newRow['Rating/Price per g']}
                  onChange={handleInputChange}
                  placeholder="Value/g"
                  step="0.01"
                  required
                />
                <button type="submit" className="btn-add-row">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page2;
