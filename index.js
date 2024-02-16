const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const passport = require("./config/passportconfig");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// const connectDB = require("./config/connectDB");
dotenv.config();

// connectDB();

app.use(cors());

mongoose
  .connect(process.env.MONGO_STRING)
  .then(() => {
    console.log("Mongoose connection worked!");
  })
  .catch((error) => {
    console.log("mongoose connection error.");
  });

app.use((req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
    });
  }
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("user/home.ejs");
});

app.use(passport.initialize());

const adminRoutes = require("./routes/AdminRoutes");
app.use("/", adminRoutes);

const blogRoutes = require("./routes/BlogRoutes");
app.use("/", blogRoutes);

const postRoutes = require("./routes/PostRoutes");
app.use("/", postRoutes);

const publicationRoutes = require("./routes/publicationRoutes");
app.use("/", publicationRoutes);

const resourceRoutes = require("./routes/resourceRoutes");
app.use("/", resourceRoutes);

const infographicRoutes = require("./routes/infographicRoutes");
app.use("/", infographicRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/", courseRoutes);

app.get("/contactUs", (req, res) => {
  res.render("user/contact.ejs");
});

app.get("/aboutUs", (req, res) => {
  res.render("user/about.ejs");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(4000, () => {
  console.log("server running on port 4000!");
});
