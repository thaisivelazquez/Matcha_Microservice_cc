import './pref_page.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function PrefPage() {
  const [slide, setSlide] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [matchaBrand, setMatchaBrand] = useState("");
  const [startingRanking, setStartingRanking] = useState("");
  const [startingBudget, setStartingBudget] = useState("");
  const [placeHolder, setPlaceHolder] = useState("");
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

  
  const isFormValid = () => {
    return matchaBrand && startingRanking && startingBudget && placeHolder;
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
            <input
              type="text"
              placeholder="Matcha brand"
              value={matchaBrand}
              onChange={(e) => setMatchaBrand(e.target.value)}
            />
            <label>Starting Ranking out of 10</label>
            <input
              type="text"
              placeholder="Starting ranking"
              value={startingRanking}
              onChange={(e) => setStartingRanking(e.target.value)}
            />
            <label>Starting budget</label>
            <input
              type="number"
              placeholder="Starting budget"
              value={startingBudget}
              onChange={(e) => setStartingBudget(e.target.value)}
            />
            <label>Place holder</label>
            <input
              type="number"
              placeholder="Place holder"
              value={placeHolder}
              onChange={(e) => setPlaceHolder(e.target.value)}
            />

            <button
              className='sign-btn'
              type="submit"
              disabled={!isFormValid()}  
            >
              Finished setting up my profile
            </button>
            <div className='or'>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PrefPage;
