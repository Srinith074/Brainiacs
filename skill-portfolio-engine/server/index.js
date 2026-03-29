const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const analysisRoutes = require("./routes/analysis");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/analysis", analysisRoutes);

app.listen(4000, () => console.log("Server running on 4000"));
