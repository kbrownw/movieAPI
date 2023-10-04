var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const zip = req.query.zip;
  const url = 'https://flixster.p.rapidapi.com/theaters/list?zipCode=' + zip + '&radius=50';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'fc9daa89fbmsheb86af0b4834aedp1b64c5jsn5a6a8657a858',
      'X-RapidAPI-Host': 'flixster.p.rapidapi.com'
    }
  };

try {
	const response = await fetch(url, options);
	const result = await response.json();
	console.log(result);
  res.json(result);
} catch (error) {
	console.error(error);
  res.json({error: error.message});
}
});

module.exports = router;
