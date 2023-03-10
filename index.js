require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("./models/user.model");
require("./models/message.model");
const onConnection = require("./socket_io/onConnection");
const onError = require("./utils/onError");
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
app.use(cors());
app.use("/api", router);
app.use(onError);

const server = createServer(app);

const io = new Server(server, {
  serveClient: false,
});

io.on("connection", (socket) => {
  onConnection(io, socket);
});

app.listen(PORT, () => console.log("Server is running on", PORT));
