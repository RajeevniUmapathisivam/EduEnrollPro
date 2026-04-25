import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineElement, PointElement } from 'chart.js';


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
ChartJS.register(ArcElement); // Register Pie/Donut chart
ChartJS.register(LineElement, PointElement);


function AdminAnalytics() {
  const [chartData, setChartData] = useState({});
  const [facultyChartData, setFacultyChartData] = useState({});
  const [yearChartData, setYearChartData] = useState({});

  const navigate = useNavigate();


  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {

    // for bar chart
    const res = await API.get('/registrations/stats/course-counts');
    console.log('API response:', res.data);
    const labels = res.data.map((item) => item._id);
    const counts = res.data.map((item) => item.count);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Number of Registrations',
          data: counts,
          backgroundColor: '#007bff',
        },
      ],
    });

    // for pie chart
    const res2 = await API.get('/registrations/stats/faculty-distribution');
    const facultyLabels = res2.data.map(item => item._id);
    const facultyCounts = res2.data.map(item => item.count);

    setFacultyChartData({
        labels: facultyLabels,
        datasets: [
        {
            label: 'Faculty Enrollments',
            data: facultyCounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8e44ad', '#2ecc71'],
        }
        ]
    });

    //for line chart
    const res4 = await API.get('/registrations/stats/yearly-trends');
    const yearLabels = res4.data.map(item => item._id);
    const yearCounts = res4.data.map(item => item.count);

    setYearChartData({
      labels: yearLabels,
      datasets: [
      {
        label: 'Registrations Per Year',
        data: yearCounts,
        borderColor: '#ff6384',
        fill: false,
        tension: 0.3,
      }
      ]
    });


  };

  return (
  <div style={{ padding: '40px' }}>
    <button onClick={() => navigate('/admin')} style={{ ...styles.button, marginBottom: '20px' }}>
      ← Back to Admin Panel
    </button>
    <h2>📊 Registration Analytics</h2>

    {chartData?.labels?.length > 0 ? (
      <div style={{ maxWidth: '700px', marginTop: '30px' }}>
        <Bar data={chartData} />
      </div>
    ) : (
      <p>No registration data found.</p>
    )}

    
    <h3 style={{ marginTop: '40px' }}>📌 Faculty-Wise Enrollments</h3>
    {facultyChartData?.labels?.length > 0 ? (
        <div style={{ maxWidth: '600px', marginTop: '20px' }}>
            <Pie data={facultyChartData} />
        </div>
    ) : (
        <p>No faculty data available.</p>
    )}

    <h4 style={{ marginTop: '40px' }}>📆 Yearly Registration Trends</h4>
    {yearChartData?.labels?.length > 0 ? (
      <div style={{ maxWidth: '700px', marginTop: '20px' }}>
        <Line data={yearChartData} />
      </div>
    ) : (
        <p>No yearly trend data available.</p>
    )}



  </div>
  );

}

const styles = {
  button: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },

};

export default AdminAnalytics;
