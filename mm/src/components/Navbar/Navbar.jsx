import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='logo'>Matchamania</div>

      <ul className='navbar-menu'>
        <NavLink to="/home">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Home</li>
          )}
        </NavLink>

        <NavLink to="/matchasession">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Matcha Sessions</li>
          )}
        </NavLink>

        <NavLink to="/BudgetLog">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Budget tracker</li>
          )}
        </NavLink>

        <NavLink to="/RatingsLog">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Ranking</li>
          )}
        </NavLink>

        <NavLink to="/profile">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>Profile</li>
          )}
        </NavLink>
      </ul>
    </div>
  );
};

export default Navbar;
