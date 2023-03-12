require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
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

app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use(onError);

io.on("connection", (socket) => {
  console.log("a user connected");
  onConnection(io, socket);
});

http.listen(PORT, () => console.log("Server is running on", PORT));
