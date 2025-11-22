import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query: ", searchQuery);
  };

  return (
    <div className='navbar'>
      <Link to='/home' className='logo'>Matchamania</Link>

      <ul className='navbar-menu'>
        <li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
          <Link to="/home">Home</Link>
        </li>
        <li onClick={() => setMenu("page-1")} className={menu === "page-1" ? "active" : ""}>
          <Link to="/page1">Budget tracker</Link>
        </li>
        <li onClick={() => setMenu("page-2")} className={menu === "page-2" ? "active" : ""}>
          <Link to="/page2">Ranking</Link>
        </li>
      
      </ul>
    <div className = "right">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input 
          type="text" 
          placeholder="Search by matcha or username" 
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
    </div>
  );
};

export default Navbar;
