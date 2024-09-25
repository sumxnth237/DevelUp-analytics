import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './userAnalytics.css';
import Modal from 'react-modal';
import PieChart from './PieChart';

// Attach modal to the root of your app
Modal.setAppElement('#root');

function UserAnalytics() {
  const [jobTitleData, setJobTitleData] = useState([]);
  const [averageAge, setAverageAge] = useState(0);
  const [degreeData, setDegreeData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', data: [] });

  useEffect(() => {
    // Fetch users by job title
    api.get('/user-analytics/users-by-job-title').then(response => {
      setJobTitleData(response.data);
    });

    // Fetch average age of users
    api.get('/user-analytics/average-age').then(response => {
      setAverageAge(response.data.averageAge);
    });

    // Fetch users by education degree
    api.get('/user-analytics/users-by-degree').then(response => {
      setDegreeData(response.data);
    });

    // Fetch users by experience
    api.get('/user-analytics/users-by-experience').then(response => {
      setExperienceData(response.data);
    });

    // Fetch users by skill
    api.get('/user-analytics/users-by-skill').then(response => {
      setSkillData(response.data);
    });

    // Fetch users by city
    api.get('/user-analytics/users-by-city').then(response => {
      setCityData(response.data);
    });
  }, []);

  const openModal = (title, data) => {
    setModalContent({ title, data });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const renderChart = () => {
    switch (modalContent.title) {
      case 'Users by Job Title':
        return <PieChart data={modalContent.data} />;
      case 'Users by Education Degree':
        return <PieChart data={modalContent.data} />;
      case 'Users by Experience':
        return <PieChart data={modalContent.data} />;
      case 'Users by Skill':
        return <PieChart data={modalContent.data} />;
      case 'Users by City':
        return <PieChart data={modalContent.data} />;
      default:
        return null;
    }
  };

  return (
    <div className='user-analytics-container-1'>
      <h1>User Analytics</h1>
    
    <div className="user-analytics-container">
      <div className="analytics-card">
        <h2>Users by Job Title</h2>
        <ul>
          {jobTitleData.slice(2, 12).map(item => (
            <li key={item._id}>{item._id}: {item.count}</li>
          ))}
        </ul>
        {/* <button onClick={() => openModal('Users by Job Title', jobTitleData)}>Show Detailed Analytics</button> */}
      </div>
      <div className="analytics-card">
        <h2>Users by Education Degree</h2>
        <ul>
          {degreeData.slice(0, 10).map(item => (
            <li key={item._id}>{item._id}: {item.count}</li>
          ))}
        </ul>
        <button onClick={() => openModal('Users by Education Degree', degreeData)}>Show Detailed Analytics</button>
      </div>
      <div className="analytics-card">
        <h2>Users by Experience</h2>
        <ul>
          {experienceData.slice(0, 2).map(item => (
            <li key={item._id}>{item._id ? 'Experienced' : 'Fresher'}: {item.count}</li>
          ))}
        </ul>
        {/* <button onClick={() => openModal('Users by Experience', experienceData)}>Show Detailed Analytics</button> */}
      </div>
      <div className="analytics-card">
        <h2>Average Age of Users</h2>
        <p>{averageAge}</p>
      </div>
      <div className="analytics-card">
        <h2>Users by Skill</h2>
        <ul>
          {skillData.slice(0, 10).map(item => (
            <li key={item._id}>{item._id}: {item.count}</li>
          ))}
        </ul>
        <button onClick={() => openModal('Users by Skill', skillData)}>Show Detailed Analytics</button>
      </div>
      <div className="analytics-card">
        <h2>Users by City</h2>
        <ul>
          {cityData.slice(0, 10).map(item => (
            <li key={item._id}>{item._id}: {item.count}</li>
          ))}
        </ul>
        <button onClick={() => openModal('Users by City', cityData)}>Show Detailed Analytics</button>
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
        <div>{renderChart()}</div>
      </Modal>
    </div>
    </div>
  );
}

export default UserAnalytics;
