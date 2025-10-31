const express = require("express");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const connectDB = require("./lib/db.js");
const cors = require("cors");
const path = require("path");
const { app, server } = require("./lib/socket.js");

// ❌ REMOVE THIS LINE
// const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // to allow cookies
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(cookieparser());

const authRoutes = require("./routes/auth.route.js");
const msgRoutes = require("./routes/msg.route.js");

app.use("/api/auth", authRoutes);
app.use("/api/message", msgRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(5001, () => {
  console.log("server is running on 5001.");
  connectDB();
});
