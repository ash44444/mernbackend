const axios = require("axios");
const Transaction = require("../models/Transaction");

const initDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.deleteMany({}); // Clear existing data
    await Transaction.insertMany(transactions); // Seed new data

    res.status(200).send({ message: "Database initialized successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error initializing database", error });
  }
};

module.exports = { initDatabase };
