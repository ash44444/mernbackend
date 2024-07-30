const Transaction = require("../models/Transaction");

const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    // Convert month name to month number (1 for January, 2 for February, etc.)
    const monthNumber = new Date(`${month} 1, 2020`).getMonth() + 1;

    // MongoDB aggregation pipeline
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
          _id: null,
          totalSalesAmount: { $sum: "$price" },
          totalSoldItems: { $sum: 1 },
          totalNotSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0],
            },
          },
        },
      },
    ];

    const result = await Transaction.aggregate(pipeline);

    if (result.length === 0) {
      return res.status(200).json({
        totalSalesAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
    }

    const statistics = result[0];
    res.status(200).json({
      totalSalesAmount: statistics.totalSalesAmount,
      totalSoldItems: statistics.totalSoldItems,
      totalNotSoldItems: statistics.totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error); // Log the error
    res
      .status(500)
      .send({ message: "Error fetching statistics", error: error.message });
  }
};

module.exports = { getStatistics };
