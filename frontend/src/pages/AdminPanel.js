import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied!');
      navigate('/');
    } else {
      fetchRegistrations();
    }
  }, [navigate]);

  const fetchRegistrations = async () => {
    const res = await API.get('/registrations');
    setRegistrations(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/registrations/${id}`, { status });
    fetchRegistrations();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Admin Panel – Approve Course Registrations</h2>
        <button onClick={() => navigate('/admin-analytics')} style={styles.btnApprove}>
            View Analytics
        </button>

        {registrations.length === 0 ? (
          <p>No registrations yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Program</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
              <tr key={reg._id}>
                <td>{reg.studentId?.name || 'Unknown Student'}</td>
                <td>{reg.courseId?.name || 'Unknown Course'}</td>
                <td>{reg.courseId?.program || 'N/A'}</td>
                <td>{reg.status}</td>
                <td>
                    <button style={styles.btnApprove} onClick={() => updateStatus(reg._id, 'approved')}>Approve</button>
                    <button style={styles.btnReject} onClick={() => updateStatus(reg._id, 'rejected')}>Reject</button>
                </td>
              </tr>
              ))}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
    minHeight: '100vh',
    padding: '40px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  btnApprove: {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '8px 14px',
  margin: '15px 0',
  borderRadius: '6px',
  cursor: 'pointer',
  },
  btnReject: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AdminPanel;
