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

//  Move list cache

let theaterListCache = {};
let showtimesCache = {};

/* GET home page. */

router.get("/", async function (req, res) {
  const zip = req.query.zipCode;
  const currentDate = new Date();

  let url = `https://flixster.p.rapidapi.com/theaters/list?zipCode=${zip}&radius=50`;

  if (process.env.NODE_ENV === "dev") {
    console.log("Using local data");
    url = `http://localhost:8080/theaters/list/${zip}.json`;
  }

  if (theaterListCache[zip]) {
    const cachedTime = theaterListCache[zip].date;
    const expireTime = cachedTime.setDate(cachedTime.getDate() + 7);
    const expired = currentDate.getTime() > expireTime;

    if (!expired) {
      console.log("Using theater list cache.");
      return res.json(theaterListCache[zip].data);
    } else {
      console.log(`Deleted stale record ${zip}.`);
      delete theaterListCache[zip];
    }
  }
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // Store result in theater cache variable
    theaterListCache[zip] = {
      date: currentDate,
      data: result,
    };
    console.log("Using API block data.");
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json({ error: "No match found." });
  }
});

router.get("/showtimes", async function (req, res) {
  const theater = req.query.id;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const timestamp = `${year}-${month}-${day}`;
  let url = `https://flixster.p.rapidapi.com/theaters/detail?id=${theater}`;
  console.log(theater);

  if (process.env.NODE_ENV === "dev") {
    console.log("Using local data for showtimes.");
    url = `http://localhost:8080/theaters/detail/${theater}.json`;
  }

  //  Use showtimes data if it exists in cache
  if (showtimesCache[theater]) {
    if (showtimesCache[theater].date == timestamp) {
      console.log("Using cached showtime data.");
      return res.json(showtimesCache[theater].data);
    } else {
      // If cached showtimes data is old, delete it
      delete showtimesCache[theater];
    }
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // Store data in cache variable
    showtimesCache[theater] = {
      date: timestamp,
      data: result,
    };
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

module.exports = router;
