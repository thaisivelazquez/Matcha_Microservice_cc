import React from 'react';
import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className='navbar'>
      <div className='logo'>Matchamania</div>

      <ul className='navbar-menu'>
        <NavLink to="/home">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Home</li>
          )}
        </NavLink>

        <NavLink to="/page1">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Budget tracker</li>
          )}
        </NavLink>

        <NavLink to="/page2">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Ranking</li>
          )}
        </NavLink>
      </ul>

      <div className="right">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by matcha or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Navbar;
