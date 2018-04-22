const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const https = require("https");
const app = express();
const config = require('./config');
const _ = require('lodash');


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

function printAvailability(floor, field) {
  console.log(floor + ": " + (field ? "FULL": data.field1));
}

app.post('/', (req, res) => {
  global.twiml = new MessagingResponse();
  console.log('results2');
  if (req.body.Body == 'Park') {
    //twiml.message('Number of Available Slots:');
    getParkingSpots().then(function(data) {
      //var twiml2 = new MessagingResponse();
      twiml.message('Number of Available Slots:');
      console.log(results);
      console.log(data);
      //res.write(data);
      // console.log("2 Newport: " + (data.field1? "FULL": data.field1));
      // console.log("4 Newport: " + data.field2);
      // console.log("5 Newport: " + data.field3);
      printAvailability("2 Newport", data.field1);
      printAvailability("4 Newport", data.field2);
      printAvailability("5 Newport", data.field3);
      var arr = _.values(_.omit(data, ['created_at', 'entry_id']));
      console.log(arr);
    });
    //twiml.message('Number of Available Slots:' + results);
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
