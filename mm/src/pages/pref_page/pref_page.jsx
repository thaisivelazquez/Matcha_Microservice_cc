import './pref_page.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function PrefPage() {
  const [slide, setSlide] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); 
  const navigate = useNavigate(); 

  const handleClick = (e) => {
    e.preventDefault();
    setSlide((s) => !s);
  };

  
  const handleSignup = (e) => {
    e.preventDefault();
    setFadeOut(true); 
    setTimeout(() => {
      
      navigate("/home"); 
    }, 800); 
  };

  return (
    <div className={`signup${fadeOut ? " page-wrapper fade-out" : ""}`}>
      <div className={slide ? "container slide" : "container"}></div>
      <div className={slide ? 'sign-up sign-up-hidden' : "sign-up"}>
        <div className="sign-up-left">
          <div className={`content ${slide ? "fade-out" : "fade-in-left"}`}>
            <h1>Set your profile</h1>
            <p>
              Answer the following questions about your favorite matcha brands so we can get an idea of who you are and what your matcha spending habits look like!
            </p>
          </div>
          <img className={`${slide ? "fade-out" : "fade-in-left"}`} />
        </div>
        <div className={`sign-up-right ${slide ? "fade-out" : "fade-in-right"}`}>
          <form className='sign-up-form' onSubmit={handleSignup}>
            <div className='sign-upper-text'>
              <h1>Create Your Matcha Profile!</h1>
              <p>Answer the following questions so we can set up your profile</p>
            </div>
            <label>Matcha brand</label>
            <input type="text" placeholder='Matcha brand' />
            <label htmlFor="">Starting Ranking</label>
            <input type='text' placeholder='Starting ranking' />
            <label htmlFor="">Starting budget</label>
            <input type='number' placeholder='Starting budget' />
            <label htmlFor="">Place holder</label>
            <input type='number' placeholder='Place holder' />

            <button className='sign-btn' type="submit">Finished setting up my profile</button>
            <div className='or'>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PrefPage;
