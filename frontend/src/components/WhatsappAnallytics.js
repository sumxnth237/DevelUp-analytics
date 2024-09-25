import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from 'react-modal';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import './WhatsAppAnalytics.css';

function WhatsAppAnalytics() {
  const [analytics, setAnalytics] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchWhatsAppAnalytics();
  }, []);

  const fetchWhatsAppAnalytics = async () => {
    try {
      const response = await api.get('/whatsapp/whatsapp-analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching WhatsApp analytics:', error);
    }
  };

  const openModal = (content, title) => {
    setModalContent(content);
    setModalTitle(title);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const renderCard = (title, value, onClick = null) => (
    <div className="dashboard-card">
      <h2>{title}</h2>
      <p>{typeof value === 'number' ? value.toFixed(2) : value}</p>
      {onClick && <button onClick={onClick}>Show Details</button>}
    </div>
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">WhatsApp Analytics</h1>
      <div className="dashboard-cards">
        {renderCard("Total Users", analytics.totalUsers)}
        {renderCard("Total Sent Messages", analytics.totalSentMessages)}
        {renderCard("Total Delivered Messages", analytics.totalDeliveredMessages)}
        {renderCard("Total Seen Messages", analytics.totalSeenMessages)}
        {renderCard("Total Inbound Messages", analytics.totalInboundMessages)}
        {renderCard("Total Rebound Attempts", analytics.totalReboundAttempts)}
        {renderCard("Total Search Queries", analytics.totalSearchQueries)}
        
        {renderCard("Message Delivery Rate", analytics.messageDeliveryRate + '% of the messages have been delivered to the users')}
        {renderCard("Message Seen Rate", analytics.messageSeenRate + '% of the sent messages have been seen by the users')}
        {renderCard("Message Engagement Rate", analytics.messageEngagementRate + '% of the people have engaged with the bot (seen the messages and replied to it)')}
        {renderCard("Response Rate", analytics.responseRate + '% (total messages inbound to us ÷ total messages we delivered to them)')}
        
        {renderCard("Avg Messages Per User", analytics.avgMessagesPerUser + ' messages sent by a user to the bot.')}
        {renderCard("Avg Search Queries Per User", analytics.avgSearchQueriesPerUser)}
        
        {renderCard("Daily Active Users", analytics.dailyActiveUsers + ' users in the last 24 hours')}
        {renderCard("Weekly Active Users", analytics.weeklyActiveUsers + ' users in the last 7 days')}
        {renderCard("Monthly Active Users", analytics.monthlyActiveUsers + ' users in the last 30 days')}
        {renderCard("Yearly Active Users", analytics.yearlyActiveUsers + ' users in the last year')}
        
        {renderCard("Top Search Topics", "View Details", () => openModal(
          <ul>
            {analytics.topSearchTopics && analytics.topSearchTopics.map((topic, index) => (
              <li key={index}>{topic._id}: {topic.count}</li>
            ))}
          </ul>,
          "Top Search Topics"
        ))}
        
        {renderCard("User Segmentation", "View Details", () => openModal(
          <PieChartComponent data={analytics.userSegmentation} />,
          "User Segmentation"
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button className="close-button" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          {modalContent}
        </div>
      </Modal>
    </div>
  );
}

export default WhatsAppAnalytics;