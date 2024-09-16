const express = require('express');
const router = express.Router();
const FreshLead = require('../models/freshLeads'); // Adjust the path as necessary
const moment = require('moment');


// 1. Get total number of fresh leads
//works
router.get('/total-leads', async (req, res) => {
    try {
        const totalLeads = await FreshLead.countDocuments({});
        res.json({ totalLeads });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get leads by lead status
// works
router.get('/leads-by-status', async (req, res) => {
    try {
        const statusCounts = await FreshLead.aggregate([
            { $group: { _id: "$lead_status", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(statusCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get leads by lead source
// works
router.get('/leads-by-source', async (req, res) => {
    try {
        const sourceCounts = await FreshLead.aggregate([
            { $group: { _id: "$lead_source", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(sourceCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get leads by assigned name (who the lead is assigned to)
// works
router.get('/leads-by-assigned-name', async (req, res) => {
    try {
        const assignedNameCounts = await FreshLead.aggregate([
            { $group: { _id: "$lead_assigned_name", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(assignedNameCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get leads by lead score
// dont know
router.get('/leads-by-score', async (req, res) => {
  try {
      const scoreCounts = await FreshLead.aggregate([
          { $group: { _id: "$other_information.score", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
      ]);
      res.json(scoreCounts);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



// 6. Get leads by current products
// router.get('/leads-by-product', async (req, res) => {
//   try {
//       const productCounts = await FreshLead.aggregate([
//           { $match: { current_products: { $exists: true, $ne: [] } } },  // Filters out empty products
//           { $unwind: "$current_products" },
//           { $group: { _id: "$current_products", count: { $sum: 1 } } },
//           { $sort: { count: -1, _id: 1 } }
//       ]);
//       res.json(productCounts);
//   } catch (err) {
//       res.status(500).json({ error: err.message });
//   }
// });


// 7. Get leads by lead stage
router.get('/leads-by-stage', async (req, res) => {
  try {
      const stageCounts = await FreshLead.aggregate([
          // { $match: { lead_stage: { $exists: true, $ne: null } } },  // Filters out null or missing stages
          { $group: { _id: "$other_information.lead_stage", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
      ]);
      res.json(stageCounts);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


// 8. Get leads by last update (grouped by daily, weekly, monthly, yearly)
router.get('/leads-by-period', async (req, res) => {
  try {
      const { type, date } = req.query;

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
              startDate = moment(date).startOf('isoWeek').toDate();  // isoWeek ensures the week starts on Monday
              endDate = moment(date).endOf('isoWeek').toDate();
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

      // console.log("Start Date:", startDate);
      //   console.log("End Date:", endDate);


      const leadCount= await FreshLead.countDocuments({
        updatedAt: { $gte: startDate, $lte: endDate }
      })

      let groupBy;
        switch (type) {
            case 'daily':
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }; // Group by date
                break;
            case 'weekly':
                groupBy = { $dayOfWeek: "$updatedAt" }; // Group by day of the week
                break;
            case 'monthly':
                groupBy = { $week: "$updatedAt" }; // Group by week number
                break;
            case 'yearly':
                groupBy = { $month: "$updatedAt" }; // Group by month number
                break;
        }

      const periodData = await FreshLead.aggregate([
          {
              $match: {
                  updatedAt: { $gte: startDate, $lte: endDate }
              }
          },
          {
              $group: {
                _id: groupBy,
                count: { $sum: 1 }
              }
          },
          { $sort: { _id: 1 } }
      ]);

      res.json({
        total: leadCount,
        activity: periodData
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


module.exports = router;
