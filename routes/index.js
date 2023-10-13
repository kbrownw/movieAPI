require("dotenv").config();
var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": process.env.FLIXSTER_API_KEY,
    "X-RapidAPI-Host": "flixster.p.rapidapi.com",
  },
};

/* GET home page. */

router.get("/", async function (req, res) {
  const zip = req.query.zipCode;
  let url =
    "https://flixster.p.rapidapi.com/theaters/list?zipCode=" +
    zip +
    "&radius=50";

  if (process.env.NODE_ENV === "dev") {
    console.log("Using local data");
    url = "http://localhost:8080/theaters/list/" + zip + ".json";
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json({ error: "No match found." });
  }
});

router.get("/showtimes", async function (req, res) {
  const theater = req.query.id;
  let url = "https://flixster.p.rapidapi.com/theaters/detail?id=" + theater;

  if (process.env.NODE_ENV === "dev") {
    console.log("Using local data.");
    url = "http://localhost:8080/theaters/detail/" + theater + ".json";
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

module.exports = router;
