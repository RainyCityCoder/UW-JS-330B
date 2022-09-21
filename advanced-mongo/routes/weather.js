const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');

const weatherData = require('../dataInterface/weather');

// curl http://localhost:5000/weather/VC81
router.get("/:callLetter", async (req, res) => {
  let result = await weatherData.getAllByCallLetter(req.params.callLetter);
  if(result){
    res.status(200).send(result);
  } else {
    // If result is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."});
  }
});

// curl 'http://localhost:5000/weather?minAirTemp=4'
// curl 'http://localhost:5000/weather?maxAirTemp=90'
// curl 'http://localhost:5000/weather?sections=AG1'
// curl 'http://localhost:5000/weather?callLetters=VC81'
// curl 'http://localhost:5000/weather?minAirTemp=-5&sections=AG1&maxAirTemp=0&callLetters=VCSZ'
router.get("/", async (req, res) => {
  let queryObj = {};
  let minAirTemp;
  let maxAirTemp;
  let sections;
  let callLetters;
  if (!req.query) {
    res.status(404).send({error: "No query parameters found."});
  }
  if (req.query.minAirTemp && !req.query.maxAirTemp) {
    // Air temp will come in as str, should be converted to num (parseFloat())
    minAirTemp = parseFloat(req.query.minAirTemp);
    // objName["keyName"] = valueName; <- creates key-value pair in objName
    queryObj["airTemperature.value"] = {$gte: minAirTemp};
  }
  if (req.query.maxAirTemp && !req.query.minAirTemp) {
    maxAirTemp = parseFloat(req.query.maxAirTemp);
    queryObj["airTemperature.value"] = {$lte: maxAirTemp};
  }
  if (req.query.maxAirTemp && req.query.minAirTemp) {
    maxAirTemp = parseFloat(req.query.maxAirTemp);
    minAirTemp = parseFloat(req.query.minAirTemp);
    queryObj["airTemperature.value"] = { $lte: maxAirTemp, $gte: minAirTemp };
  }
  if (req.query.sections) {
    sections = req.query.sections;
    queryObj["sections"] = { $in: [sections] };
  }
  if (req.query.callLetters) {
    callLetters = req.query.callLetters;
    queryObj["callLetters"] = callLetters;
  }
  let result = await weatherData.getByParameter(queryObj);
  if(result){
    res.status(200).send(result);
  } else {
    res.status(500).send({error: "Something went wrong. Please try again."});
  }
});

// No need to put quotes directly around braces (like this: "{}").
// curl -X POST -H "Content-Type: application/json" -d '{"airTemperature":{"value":10, "quality":"1"}, "sections":["AG1"], "callLetters":"NR40"}' http://localhost:5000/weather
router.post("/", async (req, res) => {
  let resultStatus;
  let result = await weatherData.createWeatherDocument(req.body);
  if(result){
    res.status(200).send(result);
  } else {
    res.status(500).send({error: "Something went wrong. Please try again."});
  }
  // if(result.error){
  //   resultStatus = 404;
  // } else {
  //   resultStatus = 200;
  // }
  // res.status(resultStatus).send(result);
});

// REMEMBER TO PUT THIS IN!!!!!
module.exports = router;