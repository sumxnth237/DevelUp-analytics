const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Applicant = require('../models/Applicant');

// Route to display analytics dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch data from the database
    const users = await User.find(); // Fetch all users
    const applicants = await Applicant.find(); // Fetch all applicants

    // Calculate some basic analytics
    const totalUsers = users.length;
    const totalApplicants = applicants.length;

    // Render the dashboard view with the data
    res.render('dashboard', { totalUsers, totalApplicants });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
