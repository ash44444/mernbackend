const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean, // Add this field if it doesn't exist
});

module.exports = mongoose.model("Transaction", transactionSchema);
