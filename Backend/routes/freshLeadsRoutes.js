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

// 9. Get immediate_joining status counts and list of names
router.get('/immediate-joining-status', async (req, res) => {
    try {
      const leads = await FreshLead.aggregate([
        // Match only documents where immediate_joining is true or false, excluding null and other values
        {
          $match: {
            "other_information.immediate_joining": { $in: [true, false] }
          }
        },
        {
          $group: {
            _id: "$other_information.immediate_joining", // Group by immediate_joining status (true/false)
            count: { $sum: 1 }, // Get the count for each group (true/false)
            names: { $push: "$name" } // Collect the names in an array for each group
          }
        }
      ]);
  
      const response = {
        true: {
          count: 0,
          names: []
        },
        false: {
          count: 0,
          names: []
        }
      };
  
      // Format the response properly
      leads.forEach(lead => {
        if (lead._id === true) {
          response.true.count = lead.count;
          response.true.names = lead.names.sort();
        } else if (lead._id === false) {
          response.false.count = lead.count;
          response.false.names = lead.names.sort();
        }
      });
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// 10. Get ready_to_relocate status counts and list of names
router.get('/ready-to-relocate-status', async (req, res) => {
    try {
      const leads = await FreshLead.aggregate([
        {
            $match: {
              "other_information.ready_to_relocate": { $in: [true, false] }
            }
        },
        {
          $group: {
            _id: "$other_information.ready_to_relocate", // Group by ready_to_relocate status
            count: { $sum: 1 }, // Get the count for each group (true/false)
            names: { $push: "$name" } // Collect the names in an array for each group
          }
        },
      ]);
  
      const response = {
        true: {
          count: 0,
          names: []
        },
        false: {
          count: 0,
          names: []
        }
      };
  
      // Format the response properly
      leads.forEach(lead => {
        if (lead._id === true) {
          response.true.count = lead.count;
          response.true.names = lead.names.sort();
        } else {
          response.false.count = lead.count;
          response.false.names = lead.names.sort();
        }
      });
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// 11. Get call_status counts and list of names (sorted alphabetically, case-insensitive)
router.get('/call-status', async (req, res) => {
    try {
      const leads = await FreshLead.aggregate([
        {
            $match: {
              "other_information.call_status": { $ne: null }
            }
        },
        {
          $group: {
            _id: "$other_information.call_status", // Group by call_status
            count: { $sum: 1 }, // Count the number of leads for each call_status
            names: { $push: "$name" } // Collect names for each status
          }
        },
        { $sort: { count: -1 } }
      ]);
  
      const response = {};
  
      // Format the response and sort names alphabetically (case-insensitive)
      leads.forEach(lead => {
        response[lead._id] = {
          count: lead.count,
          names: lead.names.sort() // Case-insensitive sort
        };
      });
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// 12. Get lead_cycle counts and list of names (sorted alphabetically, case-insensitive)
router.get('/lead-cycle', async (req, res) => {
    try {
      const leads = await FreshLead.aggregate([
        {
            $match: {
              "other_information.lead_cycle": { $ne: null }
            }
        },
        {
          $group: {
            _id: "$other_information.lead_cycle", // Group by lead_cycle
            count: { $sum: 1 }, // Count the number of leads for each cycle
            names: { $push: "$name" } // Collect names for each cycle
          }
        },
        { $sort: { count: -1 } }
      ]);
  
      const response = {};
  
      // Format the response and sort names alphabetically (case-insensitive)
      leads.forEach(lead => {
        response[lead._id] = {
          count: lead.count,
          names: lead.names.sort() // Case-insensitive sort
        };
      });
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// 13. Get lead_activity_name counts and list of names (sorted alphabetically, case-insensitive)
router.get('/lead-activity-name', async (req, res) => {
    try {
      const leads = await FreshLead.aggregate([
        {
          $group: {
            _id: "$lead_activity_name", // Group by lead_activity_name
            count: { $sum: 1 }, // Count the number of leads for each activity name
            names: { $push: "$name" } // Collect names for each activity name
          }
        },
        { $sort: { count: -1 } }
      ]);
  
      const response = {};
  
      // Format the response and sort names alphabetically (case-insensitive)
      leads.forEach(lead => {
        response[lead._id] = {
          count: lead.count,
          names: lead.names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) // Case-insensitive sort
        };
      });
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// 14. Get lead_type counts and list of names (sorted alphabetically, case-insensitive)
router.get('/lead-type', async (req, res) => {
  try {
    const leads = await FreshLead.aggregate([
      {
        $group: {
            _id: { $toLower: { $trim: { input: "$lead_type" } } }, // Normalize to lowercase and remove trailing spaces
          count: { $sum: 1 }, // Count the number of leads for each type
          names: { $push: "$name" } // Collect names for each lead type
        }
      },
      { $sort: { count: -1 } }
    ]);

    const response = {};

    // Format the response and sort names alphabetically (case-insensitive)
    leads.forEach(lead => {
      response[lead._id] = {
        count: lead.count,
        names: lead.names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) // Case-insensitive sort
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15). leads by period: createdAt
router.get('/leads-by-created', async (req, res) => {
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
          createdAt: { $gte: startDate, $lte: endDate }
        })
  
        let groupBy;
          switch (type) {
              case 'daily':
                  groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }; // Group by date
                  break;
              case 'weekly':
                  groupBy = { $dayOfWeek: "$createdAt" }; // Group by day of the week
                  break;
              case 'monthly':
                  groupBy = { $week: "$createdAt" }; // Group by week number
                  break;
              case 'yearly':
                  groupBy = { $month: "$createdAt" }; // Group by month number
                  break;
          }
  
        const periodData = await FreshLead.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
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
  
// 16. Get on_portal status counts and list of names (sorted alphabetically, case-insensitive)
router.get('/on-portal-status', async (req, res) => {
    try {
      const leads = await FreshLead.aggregate([
        {
          $group: {
            _id: "$on_portal", // Group by on_portal status (true/false)
            count: { $sum: 1 }, // Count for each group (true/false)
            names: { $push: "$name" } // Collect the names in an array
          }
        }
      ]);
  
      const response = {
        true: { count: 0, names: [] },
        false: { count: 0, names: [] }
      };
  
      // Format the response properly and sort names alphabetically (case-insensitive)
      leads.forEach(lead => {
        if (lead._id === true) {
          response.true.count = lead.count;
          response.true.names = lead.names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Case-insensitive sort
        } else {
          response.false.count = lead.count;
          response.false.names = lead.names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Case-insensitive sort
        }
      });
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
