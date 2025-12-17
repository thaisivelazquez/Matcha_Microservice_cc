import './login_page.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  function decodeJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }



function LoginPage() {
  
  const [slide, setSlide] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Error handling
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const navigate = useNavigate();


    useEffect(() => {
      /* global google */
      if (window.google) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });

        google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          {
            theme: "outline",
            size: "large",
            width: 280,
          }
        );
      }
    }, []);



    const handleGoogleCredential = (response) => {
  try {
    const idToken = response.credential;

    // Decode token (frontend only — NOT secure for prod)
    const user = decodeJwt(idToken);

    console.log("Google user:", user);

    // Store user like normal login
    localStorage.setItem("user_email", user.email);
    localStorage.setItem("user_profile", JSON.stringify(user));
    localStorage.setItem("google_id_token", idToken);

    setFadeOut(true);
    setTimeout(() => navigate("/home"), 800);

  } catch (err) {
    console.error(err);
    alert("Google sign-in failed");
  }
};     
      
      

  const handleClick = (e) => {
    e.preventDefault();
    setSlide(!slide);
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0,3)}-${digits.slice(3)}`;
    return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6,10)}`;
  };

  const validateFirstName = () => {
    if (!firstName.trim()) setFirstNameError("First name is required.");
    else setFirstNameError("");
  };

  const validateLastName = () => {
    if (!lastName.trim()) setLastNameError("Last name is required.");
    else setLastNameError("");
  };

  const validateEmailField = () => {
    if (!email.trim()) setEmailError("Email is required.");
    else if (!email.includes("@")) setEmailError("Invalid email address.");
    else setEmailError("");
  };

  const validatePasswordField = () => {
    if (!password.trim()) setPasswordError("Password is required.");
    else setPasswordError("");
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== password) setConfirmPasswordError("Passwords do not match");
    else setConfirmPasswordError("");
  };

  const isLoginValid = () => email.trim() && password.trim() && !emailError && !passwordError;
  const isSignupValid = () => {
    return (
      email.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !firstNameError &&
      !lastNameError
    );
  };

  // API calls
  async function getUserByEmail(email) {
    const response = await fetch("https://matcha-api-ktr6lb33ta-uc.a.run.app/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    const users = await response.json();
    return users.find((user) => user.email === email);
  }

  async function createUser(email) {
    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      username: email.split("@")[0],
      favorite_matcha_place: "",
      favorite_matcha_powder: "",
      phone: phoneNumber,
      matcha_budget: 0,
      join_date: new Date().toISOString().split("T")[0],
      matcha_sessions: []
    };
    const response = await fetch("https://matcha-api-ktr6lb33ta-uc.a.run.app/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return response.json();
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    validateFirstName();
    validateLastName();
    validateEmailField();
    validatePasswordField();
    validateConfirmPassword();

    if (!isSignupValid()) return;

    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        alert("Account already exists. Please log in.");
        return;
      }

      const user = await createUser(email);

      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_profile", JSON.stringify(user));

      setFadeOut(true);
      setTimeout(() => navigate("/Setpreferances"), 800);
    } catch (error) {
      console.error(error);
      alert("Failed to create user.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    validateEmailField();
    validatePasswordField();

    if (!isLoginValid()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const user = await getUserByEmail(email);
      if (!user) {
        alert("User not found. Please sign up.");
        return;
      }

      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_profile", JSON.stringify(user));

      setFadeOut(true);
      setTimeout(() => navigate("/home"), 800);
    } catch (error) {
      console.error(error);
      alert("Login failed.");
    }
  };

  return (
 
      <div className={`signup${fadeOut ? " page-wrapper fade-out" : ""}`}>
        <div className={slide ? "container slide" : "container"}></div>

        {/* SIGN UP */}
        <div className={slide ? "sign-up sign-up-hidden" : "sign-up"}>
          <div className="sign-up-left">
            <div className={`content ${slide ? "fade-out" : "fade-in-left"}`}>
              <h1>Sign Up</h1>
              <p>Create an account to start managing your matcha habits!</p>
            </div>
            <img className={`${slide ? "fade-out" : "fade-in-left"}`} />
          </div>

          <div className={`sign-up-right ${slide ? "fade-out" : "fade-in-right"}`}>
            <form className="sign-up-form" onSubmit={handleSignup}>
              <h1>Welcome!</h1>

              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={validateFirstName}
              />
              {firstNameError && <div className="error-message">{firstNameError}</div>}

              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={validateLastName}
              />
              {lastNameError && <div className="error-message">{lastNameError}</div>}

              <label>Phone Number</label>
              <input
                type="text"
                maxLength={12}
                placeholder="347-444-4444"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmailField}
              />
              {emailError && <div className="error-message">{emailError}</div>}

              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePasswordField}
              />
              {passwordError && <div className="error-message">{passwordError}</div>}

              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword}
              />
              {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}

              <button className="sign-btn" type="submit" disabled={!isSignupValid()}>
                Sign up
              </button>

              <p className="login-instead-btn">
                <button type="button" onClick={handleClick}>Already have an account?</button>
              </p>
            </form>
          </div>
        </div>

        {/* LOGIN */}
        <div className={!slide ? "login sign-up-hidden" : "login"}>
          <div className="sign-up-left login-left">
            <div className={`content ${!slide ? "fade-out" : "fade-in-right"}`}>
              <h1>Log back in</h1>
              <p>Login to view your matcha profile!</p>
            </div>
            <img className={`${!slide ? "fade-out" : "fade-in-right"}`} />
          </div>

          <div className={`sign-up-right ${!slide ? "fade-out" : "fade-in-left"}`}>
            <form className="sign-up-form" onSubmit={handleLogin}>
              <h1>Welcome back!</h1>

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmailField}
              />
              {emailError && <div className="error-message">{emailError}</div>}

              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePasswordField}
              />
              {passwordError && <div className="error-message">{passwordError}</div>}

              <button className="sign-btn" type="submit" disabled={!isLoginValid()}>
                Login
              </button>

              <div className="or"><span></span>or<span></span></div>

              <div
                id="googleSignInButton"
                style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
              </div>

              <p className="login-instead-btn">
                New here? <button type="button" onClick={handleClick}>Sign Up</button>
              </p>
            </form>
          </div>
        </div>
      </div>

  );
}

export default LoginPage;
