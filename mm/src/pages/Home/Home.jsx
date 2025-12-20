import React, { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import mmm from '../../assets/mmm.jpg';

const Home = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const token = localStorage.getItem("access_token");

        if (!userId || !token) {
          throw new Error("User ID or Access Token missing. Please log in.");
        }

        const response = await fetch(
          `https://matcha-composite-service-578543055940.us-central1.run.app/summary/users/${userId}?limit=10`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}` // This fixes the 401 error
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <Navbar />
      <img src={mmm} alt="Description" className="background-img" />

      <div className="description-box">
        <p className="description-text">
          Own your matcha journey from homemade lattes to cafe favorites.
          Track smarter. Spend wiser. Taste Better.
        </p>
      </div>
    
      <h1>Matcha Summary</h1>

      {loading && <p>Loading summary...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {summary && (
        <div className="summary-results">
          {/* Customize this based on what your API returns */}
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Home;