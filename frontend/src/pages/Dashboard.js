import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      navigate('/');
    } else {
      // Normally you’d fetch user info here
      setUser({ name: 'Student User' }); // fake user for now
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome to the Dashboard</h2>
        {user && <p>Hello, {user.name}!</p>}

        {localStorage.getItem('role') === 'admin' ? (
            <button style={styles.linkButton} onClick={() => navigate('/admin')}>
                Go to Admin Panel
            </button>
        ) : (
            <button style={styles.linkButton} onClick={() => navigate('/register-course')}>
                Go to Course Registration
            </button>
        )}

        <button onClick={handleLogout} style={styles.button}>Logout</button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(to right, #e0c3fc, #8ec5fc)',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  linkButton: {
    padding: '10px 20px',
     marginTop: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    marginTop: '20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#8e44ad',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Dashboard;
