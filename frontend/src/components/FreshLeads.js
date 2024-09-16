import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from 'react-modal';
import BarChartComponent from './BarChart'; // Assuming you have a BarChart component
import PieChartComponent from './PieChart'; // Assuming you have a PieChart component
import './freshLeads.css'

function FreshLeadsAnalytics() {
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsByStatus, setLeadsByStatus] = useState([]);
  const [leadsBySource, setLeadsBySource] = useState([]);
  const [leadsByAssignedName, setLeadsByAssignedName] = useState([]);
  const [leadsByScore, setLeadsByScore] = useState([]);
  const [leadsByStage, setLeadsByStage] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState('status'); // Tracks if modal is for 'status', 'source', etc.
  const [analysisType, setAnalysisType] = useState('monthly'); // daily, weekly, monthly, yearly for leads by period
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityData, setActivityData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTotalLeads();
    fetchLeadsByStatus();
    fetchLeadsBySource();
    fetchLeadsByAssignedName();
    fetchLeadsByScore();
    fetchLeadsByStage();
  }, []);

  const fetchTotalLeads = async () => {
    const response = await api.get('/fresh-leads/total-leads');
    setTotalLeads(response.data.totalLeads);
  };

  const fetchLeadsByStatus = async () => {
    const response = await api.get('/fresh-leads/leads-by-status');
    setLeadsByStatus(response.data);
  };

  const fetchLeadsBySource = async () => {
    const response = await api.get('/fresh-leads/leads-by-source');
    setLeadsBySource(response.data);
  };

  const fetchLeadsByAssignedName = async () => {
    const response = await api.get('/fresh-leads/leads-by-assigned-name');
    setLeadsByAssignedName(response.data);
  };

  const fetchLeadsByScore = async () => {
    const response = await api.get('/fresh-leads/leads-by-score');
    setLeadsByScore(response.data);
  };

  const fetchLeadsByStage = async () => {
    const response = await api.get('/fresh-leads/leads-by-stage');
    setLeadsByStage(response.data);
  };

  const fetchLeadsByPeriod = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const response = await api.get(`/fresh-leads/leads-by-period?type=${analysisType}&date=${formattedDate}`);
    setTotal(response.data.total);
    setActivityData(response.data.activity);
  };

  const openModal = (data, type) => {
    setModalData(data);
    setModalType(type);
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
    fetchLeadsByPeriod();
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Fresh Leads Analytics</h1>
      <div className="dashboard-cards">
        {/* Card for Total Leads */}
        <div className="dashboard-card">
          <h2>Total Leads</h2>
          <p>{totalLeads}</p>
        </div>

        {/* Card for Leads by Period */}
        <div className="dashboard-card">
          <h2>Leads by Period</h2>
          <button onClick={() => openModal([], 'period')}>Show Details</button>
        </div>
        {/* Card for Leads by Score */}
        <div className="dashboard-card">
          <h2>Leads by Score</h2>
          <ul>
            {leadsByScore.map((item) => (
              <li key={item._id}>
                Score {item._id}: {item.count}
              </li>
            ))}
          </ul>
        </div>
        {/* Card for Leads by Status */}
        <div className="dashboard-card">
          <h2>Leads by Status</h2>
          <ul>
            {leadsByStatus.map((item) => (
              <li key={item._id}>
                {item._id}: {item.count}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal(leadsByStatus, 'status')}>Show Details</button>
        </div>

        {/* Card for Leads by Source */}
        <div className="dashboard-card">
          <h2>Leads by Source</h2>
          <ul>
            {leadsBySource.map((item) => (
              <li key={item._id}>
                {item._id}: {item.count}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal(leadsBySource, 'source')}>Show Details</button>
        </div>

        {/* Card for Leads by Assigned Name */}
        <div className="dashboard-card">
          <h2>Leads by Assigned Name</h2>
          <ul>
            {leadsByAssignedName.map((item) => (
              <li key={item._id}>
                {item._id}: {item.count}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal(leadsByAssignedName, 'assignedName')}>Show Details</button>
        </div>


        {/* Card for Leads by Stage */}
        <div className="dashboard-card">
          <h2>Leads by Stage</h2>
          <ul>
            {leadsByStage.map((item) => (
              <li key={item._id}>
                {item._id}: {item.count}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal(leadsByStage, 'stage')}>Show Details</button>
        </div>

      </div>

      {/* Modal for Detailed Analytics */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
        <div className="modal-header">
          <button className="close-button" onClick={closeModal}>X</button>
          {modalType === 'period' && (
            <div>
              <select value={analysisType} onChange={handleAnalysisTypeChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />
              <button onClick={fetchLeadsByPeriod}>Show</button>
            </div>
          )}
        </div>

        <div className="modal-body">
          {modalType === 'period' ? (
            analysisType === 'daily' ? (
              <p>Total leads today: {total}</p>
            ) : (
              <BarChartComponent data={activityData} analysisType={analysisType} />
            )
          ) : (
            <PieChartComponent data={modalData} />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default FreshLeadsAnalytics;
