import React, { useEffect, useState } from 'react';
import API from '../services/api';

function CourseRegistrationPage() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const studentId = localStorage.getItem('userId'); // store this on login

  useEffect(() => {
    const fetchMyCourses = async () => {
        const res = await API.get(`/registrations/${studentId}`);
        setMyCourses(res.data);
     };

    fetchCourses();
    fetchMyCourses();
  }, [studentId]);


  const fetchCourses = async () => {
    const res = await API.get('/courses');
    setCourses(res.data);
  };

  const fetchMyCourses = async () => {
    const res = await API.get(`/registrations/${studentId}`);
    setMyCourses(res.data);
  };

  const handleRegister = async (courseId) => {
    try {
      await API.post('/registrations', { studentId, courseId });
      alert('Registered successfully');
      fetchMyCourses();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error registering');
    }
  };

  const isAlreadyRegistered = (courseId) =>
    myCourses.some((reg) => reg.courseId._id === courseId);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Available Courses</h2>
        <ul style={styles.list}>
          {courses.map((course) => (
            <li key={course._id} style={styles.item}>
              <b>{course.code}</b> - {course.name} ({course.program})
              {!isAlreadyRegistered(course._id) ? (
                <button style={styles.button} onClick={() => handleRegister(course._id)}>
                  Register
                </button>
              ) : (
                <span style={styles.status}>
                  ✅ Registered (
                  {myCourses.find((c) => c.courseId._id === course._id)?.status})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(to right, #89f7fe, #66a6ff)',
    minHeight: '100vh',
    padding: '30px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    marginBottom: '20px',
    padding: '15px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  status: {
    color: 'green',
    fontWeight: 'bold',
  },
};

export default CourseRegistrationPage;
