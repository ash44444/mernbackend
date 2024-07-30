const express = require("express");
const { initDatabase } = require("../controllers/initController");
const { getTransactions } = require("../controllers/transactionController");
const { getStatistics } = require("../controllers/statisticsController");
const {
  getBarChart,
  getPieChart,
  getCombinedStatistics,
} = require("../controllers/chartController"); // Import new controllers

const router = express.Router();

router.get("/init", initDatabase);
router.get("/transactions", getTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChart); // Add new route for bar chart
router.get("/pie-chart", getPieChart); // Add new route for pie chart
router.get("/combined-statistics", getCombinedStatistics); // Add new route for combined statistics

module.exports = router;
