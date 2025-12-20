import "../Login_page/login_page.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrefPage = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchaBrand, setMatchaBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [favoritePlace, setFavoritePlace] = useState("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
    setMatchaBrand(profile.favorite_matcha_powder || "");
    setBudget(
      profile.matcha_budget !== undefined ? String(profile.matcha_budget) : ""
    );
    setFavoritePlace(profile.favorite_matcha_place || "");
  }, []);

  const isValid =
    matchaBrand.trim() &&
    favoritePlace.trim() &&
    budget !== "" &&
    Number(budget) >= 0;

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Pref form submitted");

    const userId = localStorage.getItem("user_id");
    console.log("userId from localStorage:", userId);
    if (!userId) {
      alert("User not found. Please log in again.");
      navigate("/");
      return;
    }

    setLoading(true);

    const payload = {
      favorite_matcha_powder: matchaBrand.trim(),
      matcha_budget: Number(budget),
      favorite_matcha_place: favoritePlace.trim(),
    };

    try {
      const res = await fetch(
        `https://matcha-api-ktr6lb33ta-uc.a.run.app/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("PUT /users response status:", res.status);

      if (res.ok) {
        const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
        const updatedProfile = { ...profile, ...payload, id: userId };
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
      } else {
        alert("Save failed (but we will still continue to sessions).");
      }
    } catch (err) {
      console.error("Network error saving prefs:", err);
      alert("Network error (but we will still continue to sessions).");
    } finally {
      setLoading(false);
      setFadeOut(true);
      setTimeout(() => navigate("/home"), 800);
    }
  };

  return (
    <div className={`signup${fadeOut ? " page-wrapper fade-out" : ""}`}>
      <div className="container" />

      <div className="sign-up">
        <div className="sign-up-left">
          <div className="content fade-in-left">
            <h1>Set your matcha prefs</h1>
            <p>
              Tell us your favorite matcha brand, budget, and go-to spot so your
              profile feels just right.
            </p>
          </div>
          <img className="fade-in-left" />
        </div>

        <div className="sign-up-right fade-in-right">
          <form className="sign-up-form" onSubmit={handleSave}>
            <h1>Your Matcha Profile</h1>

            <label>Favorite brand</label>
            <input
              type="text"
              placeholder="Ippodo, Encha..."
              value={matchaBrand}
              onChange={(e) => setMatchaBrand(e.target.value)}
              required
            />

            <label>Monthly matcha budget ($)</label>
            <input
              type="number"
              placeholder="50"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
              step="1"
              required
            />

            <label>Favorite place</label>
            <input
              type="text"
              placeholder="Cha Cha Matcha..."
              value={favoritePlace}
              onChange={(e) => setFavoritePlace(e.target.value)}
              required
            />

            <button
              className="sign-btn"
              type="submit"
              disabled={!isValid || loading}
            >
              {loading ? "Saving..." : "Save → Go to Sessions"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrefPage;
