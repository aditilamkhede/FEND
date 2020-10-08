// Setup empty JS object to act as endpoint for all routes
var projectData = {};

const dotenv = require('dotenv');
dotenv.config();

// Require Express to run server and routes
var express = require('express');
// Cors for cross origin allowance
const cors = require('cors');
// Start up an instance of app
const app = express();
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Setup Server
// const port = 5000;
// const server = app.listen(port, listening);

//For Heroku this port will work
app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 5000!')
})


function listening(){
  console.log(`running on localhost: ${port}`);
}

//Get Route
app.get('/all', getWeather);

function getWeather(req, res){
  console.log('Get Weather All');
  res.send(projectData);
}

//Post Route
// const data = [];
app.post('/weather', postWeather);

function postWeather(req, res){
  console.log('In Post Weather', req.body);

  // projectData['temperature'] = req.body['temperature'];
  // projectData['date'] = req.body['date'];
  // projectData['userip'] = req.body['userip'];
  projectData['weather'] = req.body['weather'];
  res.send(projectData);
}

module.exports = { app };
