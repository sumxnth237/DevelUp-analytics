import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserAnalytics from './components/UserAnalytics';
import ApplicantAnalytics from './components/ApplicantAnalytics';
import GoogleAnalytics from './components/GoogleAnalytics'
import GoogleAnalyticsDetails from './components/GoogleAnalyticsDetails';
import JobAnalytics from './components/JobAnalytics'
import FreshLeads from './components/FreshLeads'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-analytics" element={<UserAnalytics />} />
        <Route path="/applicant-analytics" element={<ApplicantAnalytics />} />
        <Route path='/google-analytics' element={<GoogleAnalytics />} />
        <Route path="/google-analytics/page-analytics-(views)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/page-analytics-(users)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/city-analytics-(views)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/city-analytics-(users)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/traffic-source-(views)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/traffic-source-(users)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/campaign-analytics-(views)" element={<GoogleAnalyticsDetails />} />
        <Route path="/google-analytics/campaign-analytics-(users)" element={<GoogleAnalyticsDetails />} />
        <Route path='/job-analytics' element={<JobAnalytics />} />
        <Route path='/fresh-leads' element={<FreshLeads />} />

      </Routes>
    </Router>
  );
}

export default App;
