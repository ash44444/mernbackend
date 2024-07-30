require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  "mongodb+srv://ashish:a9z8X6xvrfmSitN4@cluster0.r9ti3fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update this with your MongoDB URI

app.use(bodyParser.json());
app.use("/api", transactionRoutes);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
