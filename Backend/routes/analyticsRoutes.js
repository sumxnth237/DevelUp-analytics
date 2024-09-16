const express = require('express');
const router = express.Router();
const User = require('../models/User.js'); // Adjust the path according to your structure
const moment = require('moment');

router.get('/user-activity', async (req, res) => {
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

        // console.log("Start Date:", startDate);
        // console.log("End Date:", endDate);

        // Count the total number of users in the range
        const userCount = await User.countDocuments({
            updatedAt: { $gte: startDate, $lte: endDate }
        });
        // console.log("User Count:", userCount);

        // Aggregation query to group by the desired period (day, week, month)
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

        // Run aggregation to get activity data
        const activityData = await User.aggregate([
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
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            total: userCount,  // Total users in the given period
            activity: activityData // Detailed data for each group (daily/weekly/monthly/yearly)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// 1. Get total number of users
router.get('/total-users', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        res.json({ totalUsers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get users by job title
router.get('/users-by-job-title', async (req, res) => {
    try {
        const jobTitleCounts = await User.aggregate([
            // { $match: { "user_profile.job_title": { $ne: null, $ne: "" } } },
            { $project: { jobTitle: { $trim: { input: "$user_profile.job_title" } } } },// Trim whitespace from job titles
            { $group: { _id: "$jobTitle", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(jobTitleCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get average age of users
router.get('/average-age', async (req, res) => {
    try {
        const averageAge = await User.aggregate([
            { $group: { _id: null, averageAge: { $avg: "$user_profile.age" } } }
        ]);
        res.json({ averageAge: averageAge[0]?.averageAge || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get users by education degree
router.get('/users-by-degree', async (req, res) => {
    try {
        const degreeCounts = await User.aggregate([
            { $unwind: "$education_details" },
            { $group: { _id: "$education_details.degree", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(degreeCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get users by work experience (fresher vs experienced)
router.get('/users-by-experience', async (req, res) => {
    try {
        const experienceCounts = await User.aggregate([
            { $group: { _id: "$work_experience.fresher", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(experienceCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Get users by skill
router.get('/users-by-skill', async (req, res) => {
    try {
        const skillCounts = await User.aggregate([
            { $unwind: "$skills.career_skills" },
            { $group: { _id: "$skills.career_skills", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(skillCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Get users by location (city-wise distribution)
router.get('/users-by-city', async (req, res) => {
    try {
        const cityCounts = await User.aggregate([
            {
                $project: {
                    city: {
                        $ifNull: [ { $trim: { input: "$user_profile.address.city" } }, "Not mentioned" ] // Replace null or empty with "unregistered"
                    }
                }
            },
            // { $project: { cityProject: { $trim: { input: "$user_profile.address.city" } } } },
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);
        res.json(cityCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
