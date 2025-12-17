import "./pref_page.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrefPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchaBrand, setMatchaBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [favoritePlace, setFavoritePlace] = useState("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
    setMatchaBrand(profile.favorite_matcha_powder || "");
    setBudget(profile.matcha_budget?.toString() || "");
    setFavoritePlace(profile.favorite_matcha_place || "");
  }, []);

  const isValid = matchaBrand.trim() && favoritePlace.trim() && budget && Number(budget) >= 0;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      favorite_matcha_powder: matchaBrand.trim(),
      matcha_budget: Number(budget),
      favorite_matcha_place: favoritePlace.trim()
    };

    try {
      const res = await fetch(`https://matcha-api-ktr6lb33ta-uc.a.run.app/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        localStorage.setItem("user_profile", JSON.stringify({ ...payload, id: userId }));
        setFadeOut(true);
        setTimeout(() => navigate("/page2"), 800);
      } else {
        alert("Save failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pref-container${fadeOut ? " fade-out" : ""}`}>
      <h1>🍵 Your Matcha Profile</h1>
      <form onSubmit={handleSave}>
        <input
          placeholder="Favorite brand (Ippodo, Encha...)"
          value={matchaBrand}
          onChange={e => setMatchaBrand(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Monthly budget ($)"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          min="0"
          step="1"
          required
        />
        <input
          placeholder="Favorite place (Cha Cha Matcha...)"
          value={favoritePlace}
          onChange={e => setFavoritePlace(e.target.value)}
          required
        />
        <button disabled={!isValid || loading}>
          {loading ? "Saving..." : "Save → See Rankings"}
        </button>
      </form>
    </div>
  );
};

export default PrefPage;
