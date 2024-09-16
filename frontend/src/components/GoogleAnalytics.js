import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Button, Select, Spin } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate on card click

const { RangePicker } = DatePicker;
const { Option } = Select;

const GoogleAnalytics = () => {
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment());
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState({
    pagePathViews: {},
    pagePathUsers: {},
    cityUsers: {},
    cityViews: {},
    sessionSourceUser: {},
    sessionSourceViews: {},
    campaignUsers: {},
    campaignSessions: {},
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // For navigation on card click

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.post('https://app.develup.in/api/develup/ga/allData', {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });

      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  // Function to handle navigation on card click
  const handleCardClick = (title, data) => {
    navigate(`/google-analytics/${title.toLowerCase().replace(/\s/g, '-')}`, { state: { data } });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Google Analytics</h2>
      <Row gutter={[16, 16]} justify="center">
        <Col>
          <RangePicker defaultValue={[startDate, endDate]} onChange={handleDateChange} />
        </Col>
        <Col>
          <Select defaultValue="monthly" onChange={handleTimeFrameChange}>
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="yearly">Yearly</Option>
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={fetchData}>
            Show
          </Button>
        </Col>
      </Row>

      {/* Display analytics data in 8 cards */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={6}>
          <Card title="Page Analytics (Views)" onClick={() => handleCardClick('Page Analytics (Views)', analyticsData.pagePathViews)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.pagePathViews).slice(0, 10).map((path, index) => (
                <div key={index}>{path}: {analyticsData.pagePathViews[path]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Page Analytics (Users)" onClick={() => handleCardClick('Page Analytics (Users)', analyticsData.pagePathUsers)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.pagePathUsers).slice(0, 10).map((path, index) => (
                <div key={index}>{path}: {analyticsData.pagePathUsers[path]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="City Analytics (Views)" onClick={() => handleCardClick('City Analytics (Views)', analyticsData.cityViews)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.cityViews).slice(0, 10).map((city, index) => (
                <div key={index}>{city}: {analyticsData.cityViews[city]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="City Analytics (Users)" onClick={() => handleCardClick('City Analytics (Users)', analyticsData.cityUsers)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.cityUsers).slice(0, 10).map((city, index) => (
                <div key={index}>{city}: {analyticsData.cityUsers[city]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Traffic Source (Views)" onClick={() => handleCardClick('Traffic Source (Views)', analyticsData.sessionSourceViews)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.sessionSourceViews).slice(0, 10).map((source, index) => (
                <div key={index}>{source}: {analyticsData.sessionSourceViews[source]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Traffic Source (Users)" onClick={() => handleCardClick('Traffic Source (Users)', analyticsData.sessionSourceUser)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.sessionSourceUser).slice(0, 10).map((source, index) => (
                <div key={index}>{source}: {analyticsData.sessionSourceUser[source]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Campaign Analytics (Views)" onClick={() => handleCardClick('Campaign Analytics (Views)', analyticsData.campaignSessions)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.campaignSessions).slice(0, 10).map((campaign, index) => (
                <div key={index}>{campaign}: {analyticsData.campaignSessions[campaign]}</div>
              ))
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Campaign Analytics (Users)" onClick={() => handleCardClick('Campaign Analytics (Users)', analyticsData.campaignUsers)}>
            {loading ? (
              <Spin />
            ) : (
              Object.keys(analyticsData.campaignUsers).slice(0, 10).map((campaign, index) => (
                <div key={index}>{campaign}: {analyticsData.campaignUsers[campaign]}</div>
              ))
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GoogleAnalytics;
