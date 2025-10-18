import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState("Home");

  return (
    <div className='navbar'>
      <Link to='/' className='logo'>Matchamania</Link>

      <ul className='navbar-menu'>
        <li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li onClick={() => setMenu("page-1")} className={menu === "page-1" ? "active" : ""}>
          <Link to="/page1">Page1</Link>
        </li>
        <li onClick={() => setMenu("page-2")} className={menu === "page-2" ? "active" : ""}>
          <Link to="/page2">page2</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
