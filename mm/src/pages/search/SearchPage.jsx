import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './SearchPage.css';

const API_BASE =
  'https://matcha-composite-service-578543055940.us-central1.run.app';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';

  // TODO: get this from auth / context
  const userId = 'demo-user-id';

  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_BASE}/summary/users/${userId}`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        // Adapt this to the real shape of your summary JSON.
        // Example assumption:
        // {
        //   "user_name": "Alex",
        //   "sessions": [
        //     {
        //       "id": 1,
        //       "matcha_name": "Kiyona Kettl Matcha",
        //       "type": "Ceremonial Grade",
        //       "location": "home",
        //       "rating": 5,
        //       "date": "2025-12-17",
        //       "notes": "Best classic matcha"
        //     }
        //   ]
        // }

        setUser({
          name: data.user_name || 'Matcha fan',
        });

        const mappedSessions = (data.sessions || []).map((s, index) => ({
          id: s.id ?? index,
          company: s.matcha_name || 'Unknown Matcha',
          role: s.type || 'Unknown type',
          location: s.location || 'Unknown location',
          posted: s.date || 'Unknown date',
          type: 'Session',
          views: s.rating ?? 0,
          applied: s.rating ?? 0, // reuse rating as a stat
          salary: s.notes || '',
        }));

        // Optional: basic text filter by query on matcha name
        const filtered = mappedSessions.filter(session =>
          session.company.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        console.error(err);
        setError('Unable to load your matcha summary. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [query, userId]);

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-page__content">
        <div className="search-page__header">
          <h1 className="search-page__title">
            {user ? `${user.name}'s Matcha sessions` : 'Matcha sessions'}{' '}
            <span>{query ? `for "${query}"` : ''}</span>
          </h1>
          <div className="search-page__filters">
            <button className="pill pill--pink">All sessions</button>
            <button className="pill pill--green pill--outline">
              Top rated
            </button>
            <select className="search-page__select">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {loading && <p>Loading sessions...</p>}
        {error && <p className="search-page__error">{error}</p>}

        {!loading && !error && (
          <div className="search-page__list">
            {results.length === 0 && (
              <p>No sessions found for this search.</p>
            )}

            {results.map((session, index) => (
              <div
                key={session.id}
                className={`job-card ${
                  index % 2 === 0 ? 'job-card--pink' : 'job-card--green'
                }`}
              >
                <div className="job-card__left">
                  <div className="job-card__logo">
                    {session.company[0]}
                  </div>
                  <div>
                    <h2 className="job-card__company">
                      {session.company}
                    </h2>
                    <p className="job-card__role">{session.role}</p>
                    <div className="job-card__meta">
                      <span>{session.location}</span>
                      <span>• {session.posted}</span>
                      <span>• {session.type}</span>
                    </div>
                  </div>
                </div>

                <div className="job-card__right">
                  <div className="job-card__stats">
                    <span>Rating: {session.views}/5</span>
                  </div>
                  <div className="job-card__salary">
                    {session.salary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
