require("dotenv").config();
var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

/* GET home page. */

if (process.env.NODE_ENV === "dev") {
  router.get("/", async function (req, res, next) {
    const zip = "47905";
    const url = "http://localhost:3000/theaters/list/" + zip + ".json";

    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

  router.get("/showtimes", async function (req, res) {
    const theater = "eastside10.json";
    const url = "http://localhost:3000/theaters/detail/" + theater;

    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });
} else {
  router.get("/", async function (req, res, next) {
    const zip = req.query.zipCode;
    const url =
      "https://flixster.p.rapidapi.com/theaters/list?zipCode=" +
      zip +
      "&radius=50";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.FLIXSTER_API_KEY,
        "X-RapidAPI-Host": "flixster.p.rapidapi.com",
      },
    };

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

  router.get("/showtimes", async function (req, res) {
    const theater = req.query.id;
    const url = "https://flixster.p.rapidapi.com/theaters/detail?id=" + theater;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.FLIXSTER_API_KEY,
        "X-RapidAPI-Host": "flixster.p.rapidapi.com",
      },
    };

    if (theater == "nx9fDyfpDcGvFwX")
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
}

module.exports = router;
