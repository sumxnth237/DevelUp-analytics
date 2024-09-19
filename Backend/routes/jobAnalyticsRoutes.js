const express = require("express");
const router = express.Router();
const Jobs = require("../models/Jobs");
const moment = require("moment");

router.get('/total-jobs', async (req, res) => {
  try {
      const totalJobs = await Jobs.countDocuments({});
      res.json({ totalJobs });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.get("/jobs-by-period", async (req, res) => {
  try {
    const { type, date } = req.query; // Query params for type of analysis and date

    // Ensure a valid date is provided
    if (!date || !moment(date).isValid()) {
      return res.status(400).json({ error: "Invalid date provided" });
    }

    let startDate, endDate;
    switch (type) {
      case "daily":
        startDate = moment(date).startOf("day").toDate();
        endDate = moment(date).endOf("day").toDate();
        break;
      case "weekly":
        startDate = moment(date).startOf("week").toDate();
        endDate = moment(date).endOf("week").toDate();
        break;
      case "monthly":
        startDate = moment(date).startOf("month").toDate();
        endDate = moment(date).endOf("month").toDate();
        break;
      case "yearly":
        startDate = moment(date).startOf("year").toDate();
        endDate = moment(date).endOf("year").toDate();
        break;
      default:
        return res.status(400).json({ error: "Invalid period type" });
    }

    // console.log("Start Date:", startDate);
    //     console.log("End Date:", endDate);


    // Count the total number of job posts within the range
    const jobCount = await Jobs.countDocuments({
<<<<<<< HEAD
      createdAt: { $gte: startDate, $lte: endDate },
=======
      updatedAt: { $gte: startDate, $lte: endDate },
>>>>>>> origin/main
    });

    // Aggregation query to group by the desired period
    let groupBy;
    switch (type) {
      case "daily":
<<<<<<< HEAD
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }; // Group by date
        break;
      case "weekly":
        groupBy = { $dayOfWeek: "$createdAt" }; // Group by day of the week
        break;
      case "monthly":
        groupBy = { $week: "$createdAt" }; // Group by week number
        break;
      case "yearly":
        groupBy = { $month: "$createdAt" }; // Group by month number
=======
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }; // Group by date
        break;
      case "weekly":
        groupBy = { $dayOfWeek: "$updatedAt" }; // Group by day of the week
        break;
      case "monthly":
        groupBy = { $week: "$updatedAt" }; // Group by week number
        break;
      case "yearly":
        groupBy = { $month: "$updatedAt" }; // Group by month number
>>>>>>> origin/main
        break;
    }

    // Run aggregation to get the grouped data
    const jobData = await Jobs.aggregate([
      {
        $match: {
<<<<<<< HEAD
          createdAt: { $gte: startDate, $lte: endDate },
=======
          updatedAt: { $gte: startDate, $lte: endDate },
>>>>>>> origin/main
        },
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Return both total job posts and the detailed activity
    res.json({
      total: jobCount,  // Total jobs in the given period
      activity: jobData, // Detailed breakdown of jobs by period
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get job posts by period" });
  }
});


// Route 2: Get job titles and their applicant count
router.get("/job-titles", async (req, res) => {
  try {
    const jobTitles = await Jobs.aggregate([
      {
        $lookup: {
          from: "applicants",
          localField: "job_details.job_title",
          foreignField: "applied_jobs.job_title",
          as: "applicants",
        },
      },
      {
        $project: {
          job_title: "$job_details.job_title",
          applicant_count: { $size: "$applicants" },
        },
      },
      { $sort: { applicant_count: -1 } },
    ]);

    res.json(jobTitles);
  } catch (error) {
    res.status(500).json({ error: "Failed to get job titles and applicant count" });
  }
});

// Route 3: Get company names and the number of job posts
router.get("/companies-job-posts", async (req, res) => {
  try {
    const companyJobCounts = await Jobs.aggregate([
      {
        $group: {
          _id: "$job_details.company_name",
          job_count: { $sum: 1 },
        },
      },
      { $sort: { job_count: -1 } },
    ]);

    res.json(companyJobCounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to get company job posts count" });
  }
});

// Route 4: Get job types and their counts
router.get("/job-types", async (req, res) => {
  try {
    const jobTypes = await Jobs.aggregate([
      {
        $group: {
          _id: "$job_details.job_type.value",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(jobTypes);
  } catch (error) {
    res.status(500).json({ error: "Failed to get job types and their counts" });
  }
});

// Route 5: Get companies and the number of positions they offer
router.get("/companies-positions", async (req, res) => {
  try {
    const companyPositions = await Jobs.aggregate([
      {
        $group: {
          _id: "$job_details.company_name",
          total_positions: { $sum: "$no_of_candidates_required" },
        },
      },
      { $sort: { total_positions: -1 } },
    ]);

    res.json(companyPositions);
  } catch (error) {
    res.status(500).json({ error: "Failed to get companies and positions count" });
  }
});

// Route 6: Get most sought-after skills
// router.get("/skills-demand", async (req, res) => {
//   try {
//     const skillDemand = await Jobs.aggregate([
//       {
//         $unwind: "$candidate_requirements.skills",
//       },
//       {
//         $group: {
//           _id: "$candidate_requirements.skills.value",
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     res.json(skillDemand);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to get skill demand" });
//   }
// });

module.exports = router;
