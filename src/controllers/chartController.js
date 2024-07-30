const Transaction = require("../models/Transaction");

const getBarChart = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = new Date(`${month} 1, 2020`).getMonth() + 1;

    const pipeline = [
      {
        $addFields: {
          monthOfSale: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          monthOfSale: monthNumber,
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0,
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            Infinity,
          ],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ];

    const result = await Transaction.aggregate(pipeline);

    const formattedResult = result.map((bucket) => ({
      priceRange:
        bucket._id === "901-above"
          ? "901-above"
          : `${bucket._id}-${bucket._id + 99}`,
      count: bucket.count,
    }));

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching bar chart data:", error); // Log the error
    res
      .status(500)
      .send({ message: "Error fetching bar chart data", error: error.message });
  }
};

const getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = new Date(`${month} 1, 2020`).getMonth() + 1;

    const pipeline = [
      {
        $addFields: {
          monthOfSale: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          monthOfSale: monthNumber,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ];

    const result = await Transaction.aggregate(pipeline);

    const formattedResult = result.map((category) => ({
      category: category._id,
      count: category.count,
    }));

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching pie chart data:", error); // Log the error
    res
      .status(500)
      .send({ message: "Error fetching pie chart data", error: error.message });
  }
};
const getCombinedStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const statistics = await getStatistics(req, res);
    const barChart = await getBarChart(req, res);
    const pieChart = await getPieChart(req, res);

    res.status(200).json({
      statistics: statistics,
      barChart: barChart,
      pieChart: pieChart,
    });
  } catch (error) {
    console.error("Error fetching combined statistics:", error); // Log the error
    res
      .status(500)
      .send({
        message: "Error fetching combined statistics",
        error: error.message,
      });
  }
};
module.exports = { getBarChart, getPieChart, getCombinedStatistics };
