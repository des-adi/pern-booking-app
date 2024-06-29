require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("../db/database");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//server shall accept requests from the FRONTEND_URL only given the credentials
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

//serve static assets
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);

app.listen(7000, () => {
    console.log("server running on localhost:7000");
});