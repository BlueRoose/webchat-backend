require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("./models/user.model");
require("./models/message.model");
const router = require("./routes/index");

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_DB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(MONGO_URL, {});

mongoose.connection.on("connected", () => {
  console.log("conected to mongoDB");
});

mongoose.connection.on("error", (error) => {
  console.log("error connecting", error);
});

const app = express();
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => console.log("Server is running on", PORT));
