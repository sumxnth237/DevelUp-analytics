const express = require('express');
const router = express.Router();
const Applicant = require('../models/Applicant'); // Adjust path as necessary

// Total Applicants
// perfect
router.get('/total-applicants', async (req, res) => {
  try {
    const count = await Applicant.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Applicants by Job
// have to do job company name after adding jobs collection
router.get('/applicants-by-job', async (req, res) => {
  try {
    const data = await Applicant.aggregate([
      { $group: { _id: "$job_id", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Applicants by Status
// perfect
router.get('/applicants-by-status', async (req, res) => {
  try {
    const data = await Applicant.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Applicants with Scheduled Interviews
// could finetune saying which and all are the interviews scheduled
router.get('/interviews-scheduled', async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ "interview.scheduled": true });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Applicants with Offer Letters
// same, could tell which s the applicant name and id
router.get('/offer-letters-scheduled', async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ "offer_letter.scheduled": true });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Recommended Applicants
// not sure
router.get('/recommended-applicants', async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ is_recommended: true });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Rejected Applicants
// good
router.get('/rejected-applicants', async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ is_rejected: true });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Important Applicants
// unneccessary
router.get('/important-applicants', async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ is_important: true });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Active Applicants
// unneccessary
router.get('/active-applicants', async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ is_active: true });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Applicants by Status Number
// not sure what
// router.get('/applicants-by-status-number', async (req, res) => {
//   try {
//     const data = await Applicant.aggregate([
//       { $group: { _id: "$status_number", count: { $sum: 1 } } }
//     ]);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

// Applications Created by Month
// perfect
router.get('/applications-by-month', async (req, res) => {
    try {
      const data = await Applicant.aggregate([
        {
          $project: {
            month: { $month: "$updatedAt" }, // Extracts the month from createdAt
            year: { $year: "$updatedAt" } // Extracts the year from createdAt
          }
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" }, // Groups by both month and year
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 } // Sorts by year and month in ascending order
        }
      ]);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

module.exports = router;
