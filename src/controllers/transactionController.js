const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search = "" } = req.query;

  try {
    // Convert month name to month number (1 for January, 2 for February, etc.)
    const monthNumber = new Date(`${month} 1, 2020`).getMonth() + 1;

    // Ensure pagination parameters are numbers
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    const pipeline = [
      {
        $addFields: {
          monthOfSale: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          monthOfSale: monthNumber,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          monthOfSale: 0,
        },
      },
    ];

    const transactions = await Transaction.aggregate(pipeline);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error); // Log the error
    res
      .status(500)
      .send({ message: "Error fetching transactions", error: error.message });
  }
};

module.exports = { getTransactions };
