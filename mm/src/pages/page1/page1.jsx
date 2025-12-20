import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './page1.css';
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page1 = () => {
  const { userId, loading: authLoading } = useAuth();

  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    'Product Name': '',
    Rating: '',
    Origin: '',
    'Rating/Price per g': ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: 'Product',
  //       accessor: 'Product Name',
  //       Cell: ({ row }) => (
  //         <div className="client-cell">
  //           <div className="client-main">
  //             <div className="client-title">
  //               {row.original['Product Name']}
  //             </div>
  //             <div className="client-sub">{row.original.Origin}</div>
  //           </div>
  //         </div>
  //       ),
  //     },
  //     { Header: 'Rating', accessor: 'Rating' },
  //     { Header: 'Value/g', accessor: 'Rating/Price per g',id: 'valuePerG', },
  //   ],
  //   []
  // );

useEffect(() => {
  setLoading(true);
  setError(null);

  const url = `http://136.110.166.166/expenses/`;

  fetch(url, {
    method: 'GET',
   
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json();
    })
    .then((json) => {
      const items = json || [];
      const formatted = items.map((item) => ({
        image: null,
        'Product Name': item.order_name,
        Rating: item.type,
        Origin: item.location,
        'Rating/Price per g': item.cost,
      }));
      setData(formatted);
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => setLoading(false));
}, []);

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

  const handleAddRow = async (e) => {
    e.preventDefault();

    const effectiveUserId = userId || localStorage.getItem("user_id");
    if (!effectiveUserId) {
      setError("User not logged in");
      return;
    }

    const payload = {
      id: crypto.randomUUID(),
      user_id: effectiveUserId,
      items: [
        {
          name: newRow["Product Name"],
          origin: newRow.Origin,
          rating: parseFloat(newRow.Rating),
          cost_per_gram: parseFloat(newRow["Rating/Price per g"]),
        },
      ],
    };

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/expenses`, {
        method: "POST",
       
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${JSON.stringify(json)}`);
      }

      const items = Array.isArray(json.items) ? json.items : [];
      const formatted = items.map((item) => ({
        image: null,
        "Product Name": item.name ?? "",
        Rating: item.rating ?? "",
        Origin: item.origin ?? "",
        "Rating/Price per g": item.cost_per_gram ?? "",
      }));

      setData((prev) => [...prev, ...formatted]);
      setNewRow({
        image: null,
        "Product Name": "",
        Rating: "",
        Origin: "",
        "Rating/Price per g": "",
      });
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to add ranking", err);
      setError(err.message || "Failed to add ranking");
    } finally {
      setLoading(false);
    }
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
            <h1 className="page2-title">Matcha Budget</h1>
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
                <pre>{JSON.stringify(data, null, 2)}</pre>
              )}
    

              <form onSubmit={handleAddRow} className="inline-form-row">
                <div className="client-cell">
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

export default Page1;