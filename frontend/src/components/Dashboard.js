import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import BarChartComponent from './BarChart'; // Assuming you have a BarChart component
// import ApplicantAnalytics from './ApplicantAnalytics';
// import UserAnalytics from './UserAnalytics';

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [waCount, setWACount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState('daily'); // daily, weekly, monthly, yearly
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityData, setActivityData] = useState([]);
  const [total, setTotal] = useState(0); // To store the total count for daily analysis
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch total users
    api.get('/user-analytics/total-users').then(response => {
      setUserCount(response.data.totalUsers);
    });

    // Fetch total applicants
    api.get('/applicants/total-applicants').then(response => {
      setApplicantCount(response.data.total);
    });

    api.get('/job-analytics/total-jobs').then(response => {
      setJobCount(response.data.totalJobs);
    });

    api.get('/fresh-leads/total-leads').then(response => {
      setLeadCount(response.data.totalLeads);
    });

    api.get('/whatsapp/whatsapp-analytics').then(response => {
      setWACount(response.data.totalUsers);
    });
  }, []);

  const detailanalytics = () => {
    navigate('/user-analytics'); // Navigate to the full user analytics page
  };

  const googleanalytics = () => {
    navigate('/google-analytics');
  }

  const applicantanalysis = () => {
    navigate('/applicant-analytics')
  }

  const goToUserAnalytics = () => {
    setModalIsOpen(true);
    fetchActivityData(); // Fetch the default data for daily analysis
  };

  const jobanalysis = () => {
    navigate('/job-analytics')
  }

  const freshleads = () => {
    navigate('/fresh-leads')
  }

  const whatsappp = () => {
    navigate('/whatsapp')
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchActivityData = () => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    api.get(`/user-analytics/user-activity?type=${analysisType}&date=${formattedDate}`)
      .then(response => {
        setTotal(response.data.total); // Set the total for daily analysis
        setActivityData(response.data.activity); // Set the activity data for bar charts
      });
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleAnalysisTypeChange = (e) => {
    setAnalysisType(e.target.value);
    fetchActivityData(); // Fetch new data whenever the analysis type changes
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={detailanalytics}>
          <h2>Total Users</h2>
          <p>{userCount}</p>
          <button onClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            goToUserAnalytics(); // Open the modal
          }}>
            Show Details
          </button>
        </div>
        <div className="dashboard-card" onClick={applicantanalysis}>
          <h2>Total Applicants</h2>
          <p>{applicantCount}</p>
        </div>
        <div className="dashboard-card" onClick={googleanalytics}>
          <h2>Google Analytics</h2>
          
        </div>
        <div className="dashboard-card" onClick={jobanalysis}>
          <h2>Total Jobs</h2>
          <p>{jobCount}</p>
        </div>
        <div className="dashboard-card" onClick={freshleads}>
          <h2>Leads</h2>
          <p>{leadCount}</p>
        </div>
        <div className="dashboard-card" onClick={whatsappp}>
          <h2>WhatsApp Analytics</h2>
          <p>{waCount} users</p>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
        <div className="modal-header">
          <button className="close-button" onClick={closeModal}>X</button>
          <select value={analysisType} onChange={handleAnalysisTypeChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="modal-body">
          <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />
          <button onClick={fetchActivityData}>Show</button>

          {analysisType === 'daily' ? (
            <p>Total users today: {total}</p>
          ) : (
            <BarChartComponent data={activityData} analysisType={analysisType} />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
