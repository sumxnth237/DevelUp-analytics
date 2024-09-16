import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from 'react-modal';
import PieChartComponent from './PieChart';
import BarChartComponent from './BarChart';
import './jobAnalytics.css';

Modal.setAppElement('#root');

function JobAnalytics() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobsByPeriod, setJobsByPeriod] = useState([]);
  const [companiesJobPosts, setCompaniesJobPosts] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [companiesPositions, setCompaniesPositions] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', data: [] });
  const [analysisType, setAnalysisType] = useState('daily'); // daily, weekly, monthly, yearly
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    // Fetch total jobs
    api.get('/job-analytics/total-jobs').then(response => {
      setTotalJobs(response.data.totalJobs);
    });

    // Fetch companies job posts
    api.get('/job-analytics/companies-job-posts').then(response => {
      setCompaniesJobPosts(response.data);
    });

    // Fetch job types
    api.get('/job-analytics/job-types').then(response => {
      setJobTypes(response.data);
    });

    // Fetch companies positions
    api.get('/job-analytics/companies-positions').then(response => {
      setCompaniesPositions(response.data);
    });

    // Fetch job titles
    api.get('/job-analytics/job-titles').then(response => {
      setJobTitles(response.data);
    });
  }, []);

  const fetchJobsByPeriod = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const response = await api.get(`/job-analytics/jobs-by-period?type=${analysisType}&date=${formattedDate}`);
    setActivityData(response.data.activity);
  };

  const openModal = (title, data) => {
    setModalContent({ title, data });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleAnalysisTypeChange = (e) => {
    setAnalysisType(e.target.value);
    fetchJobsByPeriod();
  };

  const renderChart = () => {
    switch (modalContent.title) {
      case 'Companies Job Posts':
      case 'Companies Positions':
      case 'Job Types':
        return <PieChartComponent data={modalContent.data} />;
      case 'Jobs by Period':
        return <BarChartComponent data={activityData} />;
      default:
        return null;
    }
  };

  return (
    <div className='job-analytics-container-1'>
      <h1>Job Analytics</h1>

      <div className="job-analytics-container">
        <div className="analytics-card">
          <h2>Total Jobs</h2>
          <p>{totalJobs}</p>
        </div>

        <div className="analytics-card">
          <h2>Jobs by Period</h2>
          <button onClick={() => openModal('Jobs by Period', jobsByPeriod)}>Show Detailed Analytics</button>
        </div>

        <div className="analytics-card">
          <h2>Companies Job Posts</h2>
          <ul>
            {companiesJobPosts.slice(0, 5).map(item => (
              <li key={item._id}>{item._id}: {item.job_count}</li>
            ))}
          </ul>
          <button onClick={() => openModal('Companies Job Posts', companiesJobPosts)}>Show Detailed Analytics</button>
        </div>

        <div className="analytics-card">
          <h2>Job Types</h2>
          <ul>
            {jobTypes.map(item => (
              <li key={item._id}>{item._id}: {item.count}</li>
            ))}
          </ul>
          <button onClick={() => openModal('Job Types', jobTypes)}>Show Detailed Analytics</button>
        </div>

        <div className="analytics-card">
          <h2>Companies Positions</h2>
          <ul>
            {companiesPositions.slice(0, 5).map(item => (
              <li key={item._id}>{item._id}: {item.total_positions}</li>
            ))}
          </ul>
          <button onClick={() => openModal('Companies Positions', companiesPositions)}>Show Detailed Analytics</button>
        </div>

        <div className="analytics-card">
          <h2>Job Titles</h2>
          <ul>
            {jobTitles.slice(0, 5).map(item => (
              <li key={item._id}>{item.job_title}: {item.applicant_count}</li>
            ))}
          </ul>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detailed Analytics Modal"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <button onClick={closeModal} className="modal-close">×</button>
          <h2>{modalContent.title}</h2>
          {modalContent.title === 'Jobs by Period' && (
            <>
              <label>Date:</label>
              <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />

              <label>Analysis Type:</label>
              <select value={analysisType} onChange={handleAnalysisTypeChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <button onClick={fetchJobsByPeriod}>Show</button>
            </>
          )}
          <div>{renderChart()}</div>
        </Modal>
      </div>
    </div>
  );
}

export default JobAnalytics;
