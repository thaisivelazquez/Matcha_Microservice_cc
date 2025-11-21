import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login_page.css";

function LoginPage() {
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
      navigate("/Setpreferances"); 
    }, 800);
  };

  return (
    <div className={`signup${fadeOut ? " page-wrapper fade-out" : ""}`}>
      <div className={slide ? "container slide" : "container"}></div>
      <div className={slide ? 'sign-up sign-up-hidden' : "sign-up"}>
        <div className="sign-up-left">
          <div className={`content ${slide ? "fade-out" : "fade-in-left"}`}>
            <h1>Sign Up</h1>
            <p>
              Create an account to start ranking your matcha brands, track your spending and keep and journal on your favorite types of matcha flavored items!
            </p>
          </div>
          <img className={`${slide ? "fade-out" : "fade-in-left"}`} />
        </div>
        <div className={`sign-up-right ${slide ? "fade-out" : "fade-in-right"}`}>
          <form className='sign-up-form' onSubmit={handleSignup}>
            <div className='sign-upper-text'>
              <h1>Welcome!</h1>
              <p>Sign up to start managing your matcha habits</p>
            </div>
            <label>Email</label>
            <input type="email" placeholder='Email' />
            <label htmlFor="">Password</label>
            <input type='password' placeholder='Password' />
            <button className='sign-btn' type="submit">Sign up</button>
            <div className='or'>
              <span></span>or<span></span>
            </div>
            <p className='login-instead-btn'>
              <button onClick={handleClick} className={`${slide && "cursor"}`}> Already have an account?</button>
            </p>
          </form>
        </div>
      </div>
      <div className={!slide ? 'login sign-up-hidden' : "login"}>
        <div className="sign-up-left login-left">
          <div className={`content ${!slide ? "fade-out" : "fade-in-right"}`}>
            <h1>Log back in</h1>
            <p>Login to view your matcha profile!</p>
          </div>
          <img className={`${!slide ? "fade-out" : "fade-in-right"}`} />
        </div>
        <div className={`sign-up-right ${!slide ? "fade-out" : "fade-in-left"}`}>
          <form className='sign-up-form'>
            <div className='sign-upper-text'>
              <h1>Welcome back!</h1>
              <p>Sign in to manage your matcha habits </p>
            </div>
            <label>Email</label>
            <input type="email" placeholder='Email' />
            <label htmlFor="">Password</label>
            <input type='password' placeholder='Password' />
            <button className='sign-btn'>Login</button>
            <div className='or'>
              <span></span>or<span></span>
            </div>
            <p className='login-instead-btn'>
              New here?
              <button onClick={handleClick} className={`${!slide && "cursor"}`}> Sign Up</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
