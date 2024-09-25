const express = require('express');
const router = express.Router();
const WhatsappRepo = require('../models/whatsappRepo');

router.get('/whatsapp-analytics', async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);

    const totalUsers = await WhatsappRepo.countDocuments();
    const stats = await WhatsappRepo.aggregate([
      {
        $group: {
          _id: null,
          totalSent: { $sum: '$sent' },
          totalDelivered: { $sum: '$delivered' },
          totalSeen: { $sum: '$seen' },
          totalInbound: { $sum: '$inbound' },
          totalRebound: { $sum: '$rebound' },
          totalSearchQueries: { $sum: { $size: '$searchHistory' } },
        }
      }
    ]);

    const aggregatedStats = stats[0];

    const dailyActiveUsers = await WhatsappRepo.countDocuments({ updatedAt: { $gte: oneDayAgo } });
    const weeklyActiveUsers = await WhatsappRepo.countDocuments({ updatedAt: { $gte: oneWeekAgo } });
    const monthlyActiveUsers = await WhatsappRepo.countDocuments({ updatedAt: { $gte: oneMonthAgo } });
    const yearlyActiveUsers = await WhatsappRepo.countDocuments({ updatedAt: { $gte: oneYearAgo } });

    const analytics = {
      // Basic Analytics
      totalUsers,
      totalSentMessages: aggregatedStats.totalSent,
      totalDeliveredMessages: aggregatedStats.totalDelivered,
      totalSeenMessages: aggregatedStats.totalSeen,
      totalInboundMessages: aggregatedStats.totalInbound,
      totalReboundAttempts: aggregatedStats.totalRebound,
      totalSearchQueries: aggregatedStats.totalSearchQueries,

      // Advanced Analytics
      messageDeliveryRate: aggregatedStats.totalSent > 0 ? (aggregatedStats.totalDelivered / aggregatedStats.totalSent) * 100 : 0,
      messageSeenRate: aggregatedStats.totalDelivered > 0 ? (aggregatedStats.totalSeen / aggregatedStats.totalSent) * 100  : 0,
      messageEngagementRate: aggregatedStats.totalSent > 0 ? (aggregatedStats.totalSeen / aggregatedStats.totalInbound) * 100: 0,
      responseRate: aggregatedStats.totalDelivered > 0 ? (aggregatedStats.totalInbound / aggregatedStats.totalDelivered) * 100  : 0,
      avgMessagesPerUser: totalUsers > 0 ? aggregatedStats.totalInbound / totalUsers : 0,
      avgSearchQueriesPerUser: totalUsers > 0 ? aggregatedStats.totalSearchQueries / totalUsers : 0,

      // User Activity
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      yearlyActiveUsers,
    };

    // Most common search topics
    const searchTopics = await WhatsappRepo.aggregate([
      { $unwind: '$searchHistory' },
      { $group: { _id: '$searchHistory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    analytics.topSearchTopics = searchTopics;

    // User segmentation based on activity
    const userSegmentation = await WhatsappRepo.aggregate([
      {
        $project: {
          activity: {
            $switch: {
              branches: [
                { case: { $gte: ['$updatedAt', oneDayAgo] }, then: 'Daily' },
                { case: { $gte: ['$updatedAt', oneWeekAgo] }, then: 'Weekly' },
                { case: { $gte: ['$updatedAt', oneMonthAgo] }, then: 'Monthly' },
                { case: { $gte: ['$updatedAt', oneYearAgo] }, then: 'Yearly' },
              ],
              default: 'Inactive'
            }
          }
        }
      },
      { $group: { _id: '$activity', count: { $sum: 1 } } }
    ]);

    analytics.userSegmentation = userSegmentation;

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;