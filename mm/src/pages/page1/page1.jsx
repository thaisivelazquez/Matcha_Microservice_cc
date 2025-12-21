import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

const Page1 = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Budget Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');

  const fetchData = async () => {
    if (!userId || !token) {
      setError("User ID or Access Token missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://matcha-composite-service-578543055940.us-central1.run.app/summary/users/${userId}?limit=10`,
        {
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setSummary(data);
      setNewBudget(data.matcha_budget);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateBudget = async () => {
    setUpdateLoading(true);
    try {
      // Method is PUT, No Authorization header, includes user_id in body
      const response = await fetch(
        `https://matcha-api-ktr6lb33ta-uc.a.run.app/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({ 
            user_id: userId,
            matcha_budget: parseFloat(newBudget) 
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to update budget');
      setIsEditing(false);
      fetchData(); 
    } catch (err) {
      alert("Error updating budget: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Button Styles
  const pinkButtonStyle = {
    padding: '8px 16px',
    borderRadius: '20px',
    background: '#FFC0CB', 
    color: '#333',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
  };

  const redButtonStyle = {
    padding: '8px 16px',
    borderRadius: '20px',
    background: '#ffcdd2', 
    color: '#c62828',     
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
  };

  if (!userId || !token) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
          <h2>Please Log In</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', margin: '10px 0' }}>Welcome to your Matcha Sessions Tracker</h1>
          <div style={{ color: '#666' }}>
            Here's a summary of your matcha expenses and budget
          </div>
        </header>

        <main>
          {/* BUDGET SECTION */}
          <section style={{ 
            padding: '24px', 
            marginBottom: '24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            borderRadius: '12px',
            border: '1px solid #eee'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Budget Management</h2>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={pinkButtonStyle}
                >
                  Edit Budget
                </button>
              ) : (
                <div>
                  <button 
                    onClick={handleUpdateBudget} 
                    disabled={updateLoading} 
                    style={{ ...pinkButtonStyle, marginRight: '10px' }}
                  >
                    {updateLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    style={redButtonStyle}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#666', marginBottom: '4px', fontSize: '14px' }}>Budget Limit</p>
                {isEditing ? (
                  <input 
                    type="number" 
                    step="0.01"
                    value={newBudget} 
                    onChange={(e) => setNewBudget(e.target.value)}
                    style={{ fontSize: '24px', width: '120px', fontWeight: 'bold', padding: '5px' }}
                  />
                ) : (
                  <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>${summary?.matcha_budget.toFixed(2)}</p>
                )}
              </div>
              <div>
                <p style={{ color: '#666', marginBottom: '4px', fontSize: '14px' }}>Total Spent</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e57373', margin: 0 }}>${summary?.totalExpenses.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ color: '#666', marginBottom: '4px', fontSize: '14px' }}>Remaining</p>
                <p style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  margin: 0,
                  color: (summary?.matcha_budget - summary?.totalExpenses) < 0 ? '#e57373' : '#81c784' 
                }}>
                  ${(summary?.matcha_budget - summary?.totalExpenses).toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {/* RECENT EXPENSES TABLE SECTION */}
          <section style={{ 
            padding: '24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            borderRadius: '12px',
            border: '1px solid #eee'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Recent Expenses</h2>
            {loading ? (
              <p>Loading expenses...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '12px 0' }}>Date</th>
                      <th style={{ padding: '12px 0' }}>Item</th>
                      <th style={{ padding: '12px 0' }}>Type</th>
                      <th style={{ padding: '12px 0' }}>Location</th>
                      <th style={{ padding: '12px 0' }}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary?.recentExpenses?.map((exp) => (
                      <tr key={exp.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '12px 0' }}>{exp.expense_date}</td>
                        <td style={{ padding: '12px 0' }}>{exp.order_name}</td>
                        <td style={{ padding: '12px 0' }}>
                          <span style={{ 
                            fontSize: '12px', padding: '4px 10px', borderRadius: '15px', 
                            background: exp.type === 'Cafe' ? '#E3F2FD' : '#E8F5E9',
                            color: exp.type === 'Cafe' ? '#1976D2' : '#2E7D32'
                          }}>
                            {exp.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 0' }}>{exp.location}</td>
                        <td style={{ padding: '12px 0', fontWeight: 'bold' }}>${exp.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </section>
        </main>
      </div>
    </>
  );
};

export default Page1;