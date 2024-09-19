const express = require('express');
const router = express.Router();
const Applicant = require('../models/Applicant'); // Adjust path as necessary
const moment = require('moment');


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
      // Group applicants by job_id and count the number of applicants per job
      { 
        $group: { 
          _id: "$job_id", 
          count: { $sum: 1 } 
        } 
      },
      // Perform the lookup (join) with the Jobs collection to fetch job title and company name
      {
        $lookup: {
          from: "jobs",  // Name of the Jobs collection
          localField: "_id", // The field from the Applicant collection (job_id)
          foreignField: "_id", // The field from the Jobs collection to match (job_id should be the _id of the jobs collection)
          as: "job_details" // Output array for the joined data
        }
      },
      // Unwind the joined job details (since it's an array, this will flatten it)
      { 
        $unwind: "$job_details" 
      },
      // Project only the necessary fields (job title, company name, and count)
      {
        $project: {
          _id: 0, // You can choose to hide the _id field if not needed
          job_title: "$job_details.job_details.job_title",
          company_name: "$job_details.job_details.company_name",
          count: 1 // The count of applicants
        }
      },
      // Sort the results by count in descending order
      { 
        $sort: { count: -1 }
      }
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
    const { type, date } = req.query; // Query params for type of analysis (daily, weekly, etc.) and date

    // Ensure a valid date is provided
    if (!date || !moment(date).isValid()) {
      return res.status(400).json({ error: "Invalid date provided" });
    }

    let startDate, endDate;
    switch (type) {
      case 'daily':
        startDate = moment(date).startOf('day').toDate();
        endDate = moment(date).endOf('day').toDate();
        break;
      case 'weekly':
        startDate = moment(date).startOf('week').toDate();
        endDate = moment(date).endOf('week').toDate();
        break;
      case 'monthly':
        startDate = moment(date).startOf('month').toDate();
        endDate = moment(date).endOf('month').toDate();
        break;
      case 'yearly':
        startDate = moment(date).startOf('year').toDate();
        endDate = moment(date).endOf('year').toDate();
        break;
      default:
        return res.status(400).json({ error: "Invalid analysis type" });
    }

    // Aggregation query to group applicants by status and filter based on the updatedAt range
    const data = await Applicant.aggregate([
      {
        $match: {
          updatedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 } // Count the number of applicants per status
        }
      },
      {
        $sort: { count: -1, _id: 1 } // Sort by count in descending order, then by status alphabetically
      }
    ]);

    res.json(data); // Return the filtered and aggregated data
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

            month: { $month: "$createdAt" }, // Extracts the month from createdAt
            year: { $year: "$createdAt" } // Extracts the year from createdAt
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
