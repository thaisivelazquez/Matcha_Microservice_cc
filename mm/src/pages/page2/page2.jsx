import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './page2.css';
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page2 = () => {
  const { userId, loading: authLoading } = useAuth();

  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    'Product Name': '',
    Rating: '',
    Origin: '',
    'Rating/Price per g': ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = useMemo(
    () => [
      { Header: 'Product Name', accessor: 'Product Name' },
      { Header: 'Rating', accessor: 'Rating' },
      { Header: 'Origin', accessor: 'Origin' },
      { Header: 'Value/g', accessor: 'Rating/Price per g' },
    ],
    []
  );

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setLoading(false);
      setError('Please log in first');
      return;
    }

    const url =
      `https://matchamania-rankings-api-945802238964.us-central1.run.app/ranking` +
      `?user_id=${encodeURIComponent(userId)}`;

    console.log('Fetching ranking for user_id:', userId, 'URL:', url);

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // only add if your API actually uses it:
        // 'Authorization': `Bearer ${userId}`,
      }
    })
      .then(async (res) => {
        console.log('Rankings API status:', res.status);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((json) => {
        // Expect shape:
        // {
        //   id: "...",
        //   user_id: "...",
        //   items: [{ cost_per_gram, name, origin, rating }]
        // }
        console.log('Ranking JSON:', json);
        const items = json.items || [];

        const formatted = items.map((item) => ({
          'Product Name': item.name,
          Rating: item.rating,
          Origin: item.origin,
          'Rating/Price per g': item.cost_per_gram,
        }));

        setData(formatted);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching ranking:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [userId, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    setData((prev) => [...prev, newRow]);
    setNewRow({
      'Product Name': '',
      Rating: '',
      Origin: '',
      'Rating/Price per g': ''
    });
  };

  const handleDeleteRow = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  if (authLoading) return <div>Loading user...</div>;

  return (
    <div>
      <Navbar />
      <h1>🍵 Matcha Rankings (user: {userId?.slice(0, 8)}…)</h1>

      {loading && <p>Fetching rankings...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

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

      <form onSubmit={handleAddRow} className="table-input-form">
        <input
          name="Product Name"
          value={newRow['Product Name']}
          onChange={handleInputChange}
          placeholder="Product"
          required
        />
        <input
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
          name="Origin"
          value={newRow.Origin}
          onChange={handleInputChange}
          placeholder="Origin"
          required
        />
        <input
          type="number"
          name="Rating/Price per g"
          value={newRow['Rating/Price per g']}
          onChange={handleInputChange}
          placeholder="Value/g"
          step="0.01"
          required
        />
        <button type="submit">Add Matcha</button>
      </form>
    </div>
  );
};

export default Page2;
