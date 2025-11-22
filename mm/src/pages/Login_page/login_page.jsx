import './login_page.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function LoginPage() {
  const [slide, setSlide] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  
  const handleClick = (e) => {
    e.preventDefault();
    setSlide(!slide);
  };

  
  const handleSignup = (e) => {
    e.preventDefault();
    
    setFadeOut(true);
    setTimeout(() => {
      navigate("/Setpreferances");
    }, 800); 
  };

 
  const handleLogin = (e) => {
    e.preventDefault();
    
    setFadeOut(true);
    setTimeout(() => {
      navigate("/home");
    }, 800); 
  };

 
  const validateEmail = (email) => {
    if (!email) {
      setEmailError("Email is required.");
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(""); 
    }
  };

 
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required.");
    } else {
      setPasswordError(""); 
    }
  };

 
  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };

  return (
    <div className={`signup${fadeOut ? " page-wrapper fade-out" : ""}`}>
      <div className={slide ? "container slide" : "container"}></div>

      {/* Sign-Up Section */}
      <div className={slide ? 'sign-up sign-up-hidden' : "sign-up"}>
        <div className="sign-up-left">
          <div className={`content ${slide ? "fade-out" : "fade-in-left"}`}>
            <h1>Sign Up</h1>
            <p>Create an account to start ranking your matcha brands, track your spending, and keep a journal on your favorite matcha-flavored items!</p>
          </div>
          <img className={`${slide ? "fade-out" : "fade-in-left"}`} />
        </div>
        <div className={`sign-up-right ${slide ? "fade-out" : "fade-in-right"}`}>
          <form className="sign-up-form" onSubmit={handleSignup}>
            <div className="sign-upper-text">
              <h1>Welcome!</h1>
              <p>Sign up to start managing your matcha habits</p>
            </div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
            />
            {emailError && <div className="error-message">{emailError}</div>}

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}

            <button
              className="sign-btn"
              type="submit"
              disabled={!isFormValid()}
            >
              Sign up
            </button>
            <div className="or">
              <span></span>or<span></span>
            </div>
            <p className="login-instead-btn">
              <button onClick={handleClick} className={`${slide && "cursor"}`}>
                Already have an account?
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Login Section */}
      <div className={!slide ? 'login sign-up-hidden' : "login"}>
        <div className="sign-up-left login-left">
          <div className={`content ${!slide ? "fade-out" : "fade-in-right"}`}>
            <h1>Log back in</h1>
            <p>Login to view your matcha profile!</p>
          </div>
          <img className={`${!slide ? "fade-out" : "fade-in-right"}`} />
        </div>
        <div className={`sign-up-right ${!slide ? "fade-out" : "fade-in-left"}`}>
          <form className="sign-up-form" onSubmit={handleLogin}>
            <div className="sign-upper-text">
              <h1>Welcome back!</h1>
              <p>Sign in to manage your matcha habits</p>
            </div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
            />
            {emailError && <div className="error-message">{emailError}</div>}

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}

            <button
              className="sign-btn"
              type="submit"
              disabled={!isFormValid()}
            >
              Login
            </button>
            <div className="or">
              <span></span>or<span></span>
            </div>
            <p className="login-instead-btn">
              New here? 
              <button onClick={handleClick} className={`${!slide && "cursor"}`}>
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
