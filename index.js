const express = require("express");
const app = express();
require("dotenv").config(); //requiring .env file
const port = process.env.PORT || 5050;
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + file.originalname);
  },
});
const upload = multer({ storage: storage });
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


const fileUrl = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
  res.render("index", { fileUrl });
});

app.post("/", upload.array("image"), async (req, res) => {
  //   console.log(req.files);
  //uper ki puri kahani me multer ki help se apne server me image daala hai

  // niche ki puri kahani me uploading file from our local server to cloudinary
  for (let file of req.files) {
    const myFile = await cloudinary.uploader.upload(file.path); 
    fileUrl.push(myFile.url);
    // console.log(myFile);

    //removing data from local server, no need of it
    fs.unlink(file.path, (err) => {
      if (err) console.log(err.message);
    });
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server connected at", port);
});
