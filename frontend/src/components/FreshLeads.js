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
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalData2, setModalData2] = useState([]);
  const [modalType, setModalType] = useState('status');
  const [modalType2, setModalType2] = useState('status'); // Tracks if modal is for 'status', 'source', etc.
  const [analysisType, setAnalysisType] = useState('monthly'); // daily, weekly, monthly, yearly for leads by period
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityData, setActivityData] = useState([]);
  const [total, setTotal] = useState(0);
  const [immediateJoining, setImmediateJoining] = useState([]);
  const [readytoRelocate, setReadytiRecolate] = useState([]);
  const [onPortal, setOnPortal] = useState([]);
  const [immediateJoiningData, setImmediateJoiningData] = useState({});
  const [modalTitle, setModalTitle] = useState('');
  const [modalTitle2, setModalTitle2] = useState('');
  const [immediateJoiningModalIsOpen, setImmediateJoiningModalIsOpen] = useState(false);
  const [leadsByCallStatus, setLeadsByCallStatus] = useState({});
  const [leadCycle, setLeadCycle] = useState({});
  const [leadActivityName, setLeadActivityName] = useState({});
  const [leadType, setLeadType] = useState({});

  useEffect(() => {
    fetchTotalLeads();
    fetchLeadsByStatus();
    fetchLeadsBySource();
    fetchLeadsByAssignedName();
    fetchLeadsByScore();
    fetchLeadsByStage();
    fetchImmediateJoiningStatus();
    fetchReadytoRelocate();
    fetchLeadsByCallStatus();
    fetchLeadCycle();
    fetchLeadActivityname();
    fetchLeadType();
    fetchLeadsByCreated();
    fetchOnPortal();
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

  const fetchLeadsByCreated = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const response = await api.get(`/fresh-leads/leads-by-created?type=${analysisType}&date=${formattedDate}`);
    setTotal(response.data.total);
    setActivityData(response.data.activity);
  };

  const fetchImmediateJoiningStatus = async () => {
    const response = await api.get('/fresh-leads/immediate-joining-status');
    setImmediateJoining(response.data);
    // console.log("hello:", response.data)
  }

  const fetchReadytoRelocate = async () => {
    const response= await api.get('/fresh-leads/ready-to-relocate-status');
    setReadytiRecolate(response.data);
  }

  const fetchOnPortal = async () =>{
    const response = await api.get('/fresh-leads/on-portal-status')
    setOnPortal(response.data);
  }

  const fetchLeadsByCallStatus = async () => {
    const response = await api.get('/fresh-leads/call-status');
    setLeadsByCallStatus(response.data);
  };

  const fetchLeadCycle = async () => {
    const response = await api.get('/fresh-leads/lead-cycle');
    setLeadCycle(response.data);
  }

  const fetchLeadActivityname = async () => {
    const response = await api.get('/fresh-leads/lead-activity-name')
    setLeadActivityName(response.data);
  }

  const fetchLeadType = async () => {
    const response = await api.get('/fresh-leads/lead-type')
    setLeadType(response.data);
  }

  const openImmediateJoiningModal = (data, title) => {
    setImmediateJoiningData(data);
    setModalTitle(title);
    setImmediateJoiningModalIsOpen(true);
  };

  const closeImmediateJoiningModal = () => {
    setImmediateJoiningModalIsOpen(false);
  };

  const openModal = (data, type) => {
    setModalData(data);
    setModalType(type);
    setModalIsOpen(true);
  };

  const openModal2 = (data, type) => {
    setModalData2(data); // Store only names for the modal
    setModalType2(type);
    setModalTitle2(type); // Set title as the type (status name)
    setModalIsOpen2(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeModal2 = () => {
    setModalIsOpen2(false);
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
          <h2>Leads by UpdatedAt</h2>
          <button onClick={() => openModal([], 'period')}>Show Details</button>
        </div>

        {/* Card for Leads by Period */}
        <div className="dashboard-card">
          <h2>Leads by CreatedAt</h2>
          <button onClick={() => openModal([], 'period1')}>Show Details</button>
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

        
      {/* Card for Immediate Joining Status */}
      <div className="dashboard-card">
        <h2>Immediate Joining Status</h2>
        <ul>
            <li>Yes: {immediateJoining.true ? immediateJoining.true.count : 0}</li>
            <li>No: {immediateJoining.false ? immediateJoining.false.count : 0}</li>
          </ul>
        <button onClick={() => openImmediateJoiningModal(immediateJoining, 'Immediate Joining Status')}>Show Details</button>
      </div>

      <div className="dashboard-card">
        <h2>Ready To Relocate Status</h2>
        <ul>
            <li>Yes: {readytoRelocate.true ?readytoRelocate.true.count : 0}</li>
            <li>No: {readytoRelocate.false ?readytoRelocate.false.count : 0}</li>
          </ul>
        <button onClick={() => openImmediateJoiningModal(readytoRelocate, 'Ready To Relocate Status')}>Show Details</button>
      </div>

      <div className="dashboard-card">
        <h2>On Portal?</h2>
        <ul>
            <li>Yes: {onPortal.true ?onPortal.true.count : 0}</li>
            <li>No: {onPortal.false ?onPortal.false.count : 0}</li>
          </ul>
        <button onClick={() => openImmediateJoiningModal(onPortal, 'On Portal Status')}>Show Details</button>
      </div>

      {/* Modal for Immediate Joining Status */}
      <Modal isOpen={immediateJoiningModalIsOpen} onRequestClose={closeImmediateJoiningModal} className="Modal" overlayClassName="Overlay">
        <div className="modal-header">
          <button className="close-button" onClick={closeImmediateJoiningModal}>X</button>
          <h2>{modalTitle}</h2>
        </div>
        <div className="modal-body">
          <h3>Yes:</h3>
          <p>Count: {immediateJoiningData.true ? immediateJoiningData.true.count : 0}</p>
          <ul>
            {immediateJoiningData.true && immediateJoiningData.true.names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>

          <h3>No:</h3>
          <p>Count: {immediateJoiningData.false ? immediateJoiningData.false.count : 0}</p>
          <ul>
            {immediateJoiningData.false && immediateJoiningData.false.names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </Modal>


      <div className="dashboard-card">
        <h2>Leads by Call Status</h2>
        {Object.keys(leadsByCallStatus).map((status) => (
          <div key={status}>
            <p>{status}: {leadsByCallStatus[status].count}</p>
            <button onClick={() => openModal2(leadsByCallStatus[status], status)}>Show Details</button>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <h2>Leads cycle</h2>
        {Object.keys(leadCycle).map((status) => (
          <div key={status}>
            <p>{status}: {leadCycle[status].count}</p>
            <button onClick={() => openModal2(leadCycle[status], status)}>Show Details</button>
          </div>
        ))}
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

      <div className="dashboard-card">
        <h2>Lead Activity Name</h2>
        {Object.keys(leadActivityName).map((status) => (
          <div key={status}>
            <p>{status}: {leadActivityName[status].count}</p>
            <button onClick={() => openModal2(leadActivityName[status], status)}>Show Details</button>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <h2>Lead Type</h2>
        {Object.keys(leadType).map((status) => (
          <div key={status}>
            <p>{status}: {leadType[status].count}</p>
            <button onClick={() => openModal2(leadType[status], status)}>Show Details</button>
          </div>
        ))}
      </div>


      <Modal isOpen={modalIsOpen2} onRequestClose={closeModal2} className="Modal" overlayClassName="Overlay">
        <div className="modal-header">
          <button className="close-button" onClick={closeModal2}>X</button>
          <h2>{modalTitle2}</h2>
        </div>
        <div className="modal-body">
          <p>Count: {modalData2.count}</p>
          <ul>
            {modalData2.names && modalData2.names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </Modal>



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



      </div>

      {/* Modal for Detailed Analytics */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
  <div className="modal-header">
    <button className="close-button" onClick={closeModal}>X</button>

    {/* Dropdown for period or period1 */}
    {(modalType === 'period' || modalType === 'period1') && (
      <div>
        <select value={analysisType} onChange={handleAnalysisTypeChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
        />
        <button onClick={modalType === 'period' ? fetchLeadsByPeriod : fetchLeadsByCreated}>
          Show
        </button>
      </div>
    )}
  </div>

  <div className="modal-body">
    {/* Render logic based on modalType and analysisType */}
    {modalType === 'period' || modalType === 'period1' ? (
      analysisType === 'daily' ? (
        <p>Total leads today: {total}</p>
      ) : (
        <BarChartComponent data={activityData} analysisType={analysisType} />
      )
    ) : (
      // Render PieChartComponent for any other modalType
      <PieChartComponent data={modalData} />
    )}
  </div>
</Modal>
    </div>
  );
}

export default FreshLeadsAnalytics;
