import React, { useState, useEffect } from 'react';
import api from '../services/api';  // Assuming you have this service set up
import './applicantAnalytics.css';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';  // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Attach modal to the root of your app
Modal.setAppElement('#root');

function ApplicantAnalytics() {
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [applicantsByJob, setApplicantsByJob] = useState([]);
  const [applicantsByStatus, setApplicantsByStatus] = useState([]);
  const [statusPeriod, setStatusPeriod] = useState('daily');  // Default to 'daily'
  const [statusDate, setStatusDate] = useState(moment().format('YYYY-MM-DD'));  // Default to today
  const [interviewsScheduled, setInterviewsScheduled] = useState(0);
  const [offerLettersScheduled, setOfferLettersScheduled] = useState(0);
  const [rejectedApplicants, setRejectedApplicants] = useState(0);
  const [applicationsByMonth, setApplicationsByMonth] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', data: [] });
  const [chartData, setChartData] = useState(null);  // State for bar chart data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalResponse, jobResponse, statusResponse, interviewsResponse, offerLettersResponse, rejectedResponse, monthResponse] = await Promise.all([
          api.get('/applicants/total-applicants'),
          api.get('/applicants/applicants-by-job'),
          api.get(`/applicants/applicants-by-status?type=${statusPeriod}&date=${statusDate}`), // Fetch based on selected period and date
          api.get('/applicants/interviews-scheduled'),
          api.get('/applicants/offer-letters-scheduled'),
          api.get('/applicants/rejected-applicants'),
          api.get('/applicants/applications-by-month'),
        ]);

        setTotalApplicants(totalResponse.data.total);
        setApplicantsByJob(jobResponse.data);
        setApplicantsByStatus(statusResponse.data);
        setInterviewsScheduled(interviewsResponse.data.total);
        setOfferLettersScheduled(offerLettersResponse.data.total);
        setRejectedApplicants(rejectedResponse.data.total);
        setApplicationsByMonth(monthResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [statusPeriod, statusDate]);

  const openModal = (title, data) => {
    setModalContent({ title, data });

    // Prepare bar chart data if the modal is for Applications by Month
    if (title === 'Applications by Month') {
      const labels = data.map(item => `${item._id.year}-${item._id.month}`);
      const counts = data.map(item => item.count);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Applications',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
            hoverBorderColor: 'rgba(75, 192, 192, 1)',
            data: counts,
          },
        ],
      });
    }

    else if (title === 'Applicants by Status') {
      const labels = data.map(item => item._id);
      const counts = data.map(item => item.count);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Applicants',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
            hoverBorderColor: 'rgba(75, 192, 192, 1)',
            data: counts,
          },
        ],
      });
    } else {
      setChartData(null);  // Clear chart data for other modals
    }

    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setChartData(null);  // Reset chart data when modal is closed
  };

  return (
    <div className="applicant-analytics-container">
      <h1>Applicant Analytics</h1>
      
      <div className="analytics-card">
        <h2>Total Applicants</h2>
        <p>{totalApplicants}</p>
      </div>

      <div className="analytics-card">
        <h2>Applicants by Job</h2>
        <ul>
          {applicantsByJob.slice(0, 10).map(item => (
            <li key={item._id}>Job: {item.job_title}, {item.company_name}, Count: {item.count}</li>
          ))}
        </ul>
        <button onClick={() => openModal('Applicants by Job', applicantsByJob)}>Show Detailed Analytics</button>
      </div>

      <div className="analytics-card">
        <h2>Applicants by Status</h2>

        {/* Date and Period Select */}
        <div>
          <label>Select Date: </label>
          <input
            type="date"
            value={statusDate}
            onChange={(e) => setStatusDate(e.target.value)}
          />
          <label>Select Period: </label>
          <select
            value={statusPeriod}
            onChange={(e) => setStatusPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <ul>
          {applicantsByStatus.map(item => (
            <li key={item._id}>Status: {item._id}, Count: {item.count}</li>
          ))}
        </ul>

        <button onClick={() => openModal('Applicants by Status', applicantsByStatus)}>Show Detailed Analytics</button>
      </div>

      <div className="analytics-card">
        <h2>Interviews Scheduled</h2>
        <p>{interviewsScheduled}</p>
      </div>

      <div className="analytics-card">
        <h2>Offer Letters Scheduled</h2>
        <p>{offerLettersScheduled}</p>
      </div>

      <div className="analytics-card">
        <h2>Rejected Applicants</h2>
        <p>{rejectedApplicants}</p>
      </div>

      {/* Applications by Month with modal and chart */}
      <div className="analytics-card">
        <h2>Applications by Month</h2>
        <ul>
          {applicationsByMonth.map(item => (
            <li key={item._id.year + item._id.month}>
              {item._id.year}-{item._id.month}: {item.count}
            </li>
          ))}
        </ul>
        <button onClick={() => openModal('Applications by Month', applicationsByMonth)}>Show Detailed Analytics</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}  // For accessibility
      >
        <button onClick={closeModal} className="modal-close" aria-label="Close modal">×</button>
        <h2>{modalContent.title}</h2>
        
        {chartData ? (
          <div style={{ height: '400px' }}> {/* Set a height for the chart */}
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
                scales: {
                  x: { title: { display: true, text: 'Month' } },
                  y: { title: { display: true, text: 'Count' } }
                },
              }} 
            />
          </div>
        ) : (
          <ul>
            {modalContent.data.map((item, index) => (
              <li key={index}>{item.job_title}, {item.company_name} : {item.count}</li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

export default ApplicantAnalytics;
