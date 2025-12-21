import React, { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import tea from '../../assets/teas.png';
import gtea from '../../assets/green-tea.png';
import teas from '../../assets/teas.png';
import pot from '../../assets/pot.png';
import money from '../../assets/money.png';
import d from '../../assets/download1.jpg';

const Home = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('access_token');

        if (!userId || !token) {
          throw new Error('User ID or Access Token missing. Please log in.');
        }

        const response = await fetch(
          `https://matcha-composite-service-578543055940.us-central1.run.app/summary/users/${userId}?limit=10`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
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

  const formatMoney = (value) =>
    typeof value === 'number' ? `$${value.toFixed(0)}` : '—';


  return (
    <div className="home-root">
      <Navbar />

      <div className="matcha-title-bar">
        <h2 className="matcha-title">Welcome to your Matcha Sessions summary</h2>
      </div>

      <div className="dashboard">
        {/* TOP-LEFT: leaderboard card */}
        <section className="card card-shop top-left">
          <div className="card-header">
            <img
              src={pot}
              alt="teapot badge"
              className="badge-icon badge-header-icon"
            />
            <h2 className="card-title">Most Worth Matcha Leaderboard</h2>
          </div>

          <div className="card-shop-content">
            <div className="card-shop-item">
              <h3 className="card-subtitle">Top Value Matcha</h3>
              <p className="card-text">Best worth score from recent tastings.</p>
              {summary && summary.mostWorthLeaderboard?.length > 0 ? (
                <div className="shop-item-row">
                  <img
                    src={tea}
                    alt="top matcha badge"
                    className="badge-icon badge-item-icon"
                  />
                  <div className="item-info">
                    <p className="item-name">
                      {summary.mostWorthLeaderboard[0].name}
                    </p>
                    <p className="item-price">
                      Worth score:{' '}
                      {summary.mostWorthLeaderboard[0].worth.toFixed(2)} · Rating{' '}
                      {summary.mostWorthLeaderboard[0].rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="card-text">No leaderboard data yet.</p>
              )}
            </div>

            <div className="card-shop-turnip">
              <h3 className="card-subtitle">Spending Snapshot</h3>
              <p className="card-text">Budget vs total matcha expenses.</p>
              <div className="turnip-row">
                <div className="turnip-label">Budget</div>
                <div className="turnip-value">
                  {summary ? formatMoney(summary.matcha_budget) : '—'}
                </div>
              </div>
              <div className="turnip-row">
                <div className="turnip-label">Total Spent</div>
                <div className="turnip-value">
                  {summary ? formatMoney(summary.totalExpenses) : '—'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of your code remains unchanged */}
        {/* TOP-RIGHT: profile card */}
        <section className="card card-profile top-right">
          <div className="profile-top">
            <img src={d} alt="profile icon" className="badge-icon avatar-icon" />
            <div className="profile-main">
              <div className="profile-name-row">
                <h2 className="profile-name">
                  {summary?.username || 'Matcha Traveler'}
                </h2>
              </div>
              <div className="profile-favorite">
               Average ranking score:{' '}
               {summary?.averageRankingScore != null 
                 ? summary.averageRankingScore.toFixed(1) 
                 : "0.0"}
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="stat-label">Budget</div>
              <div className="stat-value">
                {summary ? formatMoney(summary.matcha_budget) : '—'}
              </div>
            </div>
            <div className="profile-stat">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">
                {summary ? formatMoney(summary.totalExpenses) : '—'}
              </div>
            </div>
            <div className="profile-stat">
              <div className="stat-label">Items Rated</div>
              <div className="stat-value">
                {summary?.mostWorthLeaderboard
                  ? summary.mostWorthLeaderboard.length
                  : 0}
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM: full-width daily updates card */}
        <section className="card card-daily bottom-full">
          <div className="daily-header">
            <h2 className="card-title">Recent Updates</h2>
            <div className="daily-time" />
          </div>

          <div className="daily-message">
            <img
              src={gtea}
              alt="message badge"
              className="badge-icon message-icon"
            />
            <div className="message-text">
              <p className="message-title">
                {summary && summary.mostWorthLeaderboard?.[0]
                  ? `Sip of the day: ${summary.mostWorthLeaderboard[0].name}`
                  : 'Start logging to get your sip of the day'}
              </p>
              {summary && summary.mostWorthLeaderboard?.[0] && (
                <p className="message-meta">
                  Worth {summary.mostWorthLeaderboard[0].worth.toFixed(2)} · Rating{' '}
                  {summary.mostWorthLeaderboard[0].rating.toFixed(1)}
                </p>
              )}
            </div>
          </div>

          <div className="daily-lists">
            <div className="daily-column">
              <h3 className="card-subtitle">Recent Summary</h3>
              {summary &&
                summary.mostWorthLeaderboard
                  ?.filter((m) => m.origin === 'home')
                  .slice(0, 2)
                  .map((item, idx) => (
                    <div className="visitor-row" key={item.name}>
                      <img
                        src={idx % 2 === 0 ? teas : tea}
                        alt="home brew"
                        className="badge-icon visitor-icon"
                      />
                      <span className="visitor-name">
                        {item.name} · {item.rating.toFixed(1)}★
                      </span>
                    </div>
                  ))}
              {!summary && (
                <p className="card-text">
                  Track a few tastings to see them here.
                </p>
              )}
            </div>

            <div className="daily-column">
              <h3 className="card-subtitle">Quick Stats</h3>

              <div className="event-row">
                <img
                  src={money}
                  alt="budget used"
                  className="badge-icon small-badge-icon"
                />
                <div className="event-info">
                  <p className="event-name">Budget used</p>
                  <p className="event-meta">
                    {summary && summary.matcha_budget > 0
                      ? `${Math.min(
                          100,
                          (summary.totalExpenses / summary.matcha_budget) * 100
                        ).toFixed(0)}%`
                      : 'No budget set'}
                  </p>
                </div>
              </div>

              <div className="event-row">
                <img
                  src={gtea}
                  alt="leaderboard size"
                  className="badge-icon small-badge-icon"
                />
                <div className="event-info">
                  <p className="event-name">Leaderboard size</p>
                  <p className="event-meta">
                    {summary?.mostWorthLeaderboard
                      ? `${summary.mostWorthLeaderboard.length} items`
                      : '0 items'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading && <p className="card-text">Loading summary...</p>}
          {error && <p className="card-text error-text">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default Home;
