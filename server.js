const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const https = require("https");
const app = express();
const config = require('./config');


app.use(bodyParser());

global.results = "";

const url =
  "https://api.thingspeak.com/channels/480554/feeds/last.json?api_key=" + config.MY_KEY;

function getParkingSpots() {
  console.log('results1');
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      res.on("data", data => {
        results += data;
      });
      res.on("end", () => {
        resolve(JSON.parse(results));
      });
    });
  })
};


app.post('/', (req, res) => {
  const twiml = new MessagingResponse();
  console.log('results2');
  if (req.body.Body == 'Park') {
    //twiml.message('Number of Available Slots:');
    getParkingSpots().then((data) => {
      const twiml2 = new MessagingResponse();
      twiml2.message('Number of Available Slots:');
      console.log(data);
    });
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message('Text the word Park for lot availability');
  }

  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
});


http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
