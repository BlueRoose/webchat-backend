require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_DB_URL;

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL, {});

app.listen(PORT, () => console.log("Server is runnig on", PORT));