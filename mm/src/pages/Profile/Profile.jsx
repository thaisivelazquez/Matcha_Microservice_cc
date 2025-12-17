import React, { useEffect, useState } from 'react';
import './Profile.css';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import matchaIcon from "../../assets/matcha.png";

const Profile = () => {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('user_profile');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => !localStorage.getItem('user_profile'));
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const localProfileStr = localStorage.getItem('user_profile');

    if (!userId && !localProfileStr) {
      setError('No user logged in');
      setLoading(false);
      return;
    }

    if (!userId && localProfileStr && profile) {
      setLoading(false);
      return;
    }

    if (userId) {
      setLoading(true);
      fetch(`https://matcha-api-ktr6lb33ta-uc.a.run.app/users/${userId}`, {
        headers: { accept: 'application/json' },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch profile');
          }
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          localStorage.setItem('user_profile', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div
        className="miffy-bg"
        style={{
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 35%',
          backgroundColor: '#ffdbe7',
        }}
      >
        {/* wrapper that stacks card + button vertically */}
        <div className="profile-wrapper">
          <div className="about-window">
            <div className={`about-content profile-card ${profile && !error ? 'fade-in' : ''}`}>
<div className="avatar-circle">
  <img
    src={matchaIcon}
    alt="Matcha"
    className={`avatar-image ${!profile || error ? 'skeleton-avatar' : ''}`}
  />
</div>


              <h2 className={`name ${!profile || error ? 'skeleton-text' : ''}`}>
                {profile && !error ? `${profile.first_name} ${profile.last_name}` : ''}
              </h2>

              <p className={`bio ${!profile || error ? 'skeleton-text' : ''}`}>
                {profile && !error
                  ? `${(profile.first_name || profile.username) || 'User'}'s profile`
                  : ''}
              </p>

              <div className="profile-details">
                <p className={!profile || error ? 'skeleton-text' : ''}>
                  {profile && !error ? (
                    <>
                      <strong>Email:</strong> {profile.email}
                    </>
                  ) : ''}
                </p>

                <p className={!profile || error ? 'skeleton-text' : ''}>
                  {profile && !error ? (
                    <>
                      <strong>Username:</strong> {profile.username}
                    </>
                  ) : ''}
                </p>

                <p className={!profile || error ? 'skeleton-text' : ''}>
                  {profile && !error && profile.phone ? (
                    <>
                      <strong>Phone:</strong> {profile.phone}
                    </>
                  ) : ''}
                </p>

                <p className={!profile || error ? 'skeleton-text' : ''}>
                  {profile && !error && profile.favorite_matcha_place ? (
                    <>
                      <strong>Favorite Matcha Place:</strong> {profile.favorite_matcha_place}
                    </>
                  ) : ''}
                </p>

                <p className={!profile || error ? 'skeleton-text' : ''}>
                  {profile && !error && profile.favorite_matcha_powder ? (
                    <>
                      <strong>Favorite Matcha Powder:</strong> {profile.favorite_matcha_powder}
                    </>
                  ) : ''}
                </p>

                <p className={!profile || error ? 'skeleton-text' : ''}>
                  {profile && !error && profile.join_date ? (
                    <>
                      <strong>Join Date:</strong> {profile.join_date}
                    </>
                  ) : ''}
                </p>

                {profile && !error && Array.isArray(profile.matcha_sessions) && profile.matcha_sessions.length > 0 && (
                  <div className="sessions-section">
                    <h3>Matcha Sessions</h3>
                    <ul>
                      {profile.matcha_sessions.map((session, index) => (
                        <li key={index}>
                          {JSON.stringify(session)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {error && (
                <p className="status-text error">
                  Error: {error}
                </p>
              )}
            </div>
          </div>

          {/* Logout button directly below card */}
          <button className="logout-btn" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
