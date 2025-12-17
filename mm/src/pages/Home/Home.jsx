import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import mmm from '../../assets/mmm.jpg';

const Home = () => {
  return (
    <div>
      <Navbar />
      <img src={mmm} alt="Description" className="background-img" />

      
      <div className="description-box">
        <p className="description-text">
          Own your matcha journey from homemade lattes to cafe favorites
          Track smarter. Spend wiser. Taste Better.
        </p>
      </div>
    
    <h1>Current Favorites</h1>
    </div>
  );
}

export default Home;
