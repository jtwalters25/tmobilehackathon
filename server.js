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

      res.on("error", (err) => {
        reject(err);
      })
    });
  })
};

function printAvailability(floor, field) {
  console.log(floor + ": " + (field ? "FULL": data.field1));
}

app.post('/', async (req, res) => {
  global.twiml = new MessagingResponse();
  console.log('results2');
  if (req.body.Body == 'Park') {
    //twiml.message('Number of Available Slots:');
    getParkingSpots().then(function(data) {
      //var twiml2 = new MessagingResponse();
      twiml.message('Number of Available Slots:');
      //console.log(results);
      console.log(data);
      // printAvailability("NP 2 Floor 1", data.field1);
      // printAvailability("NP 2 Floor 2", data.field2);
      // printAvailability("NP 4 Floor 1", data.field3);
      // printAvailability("NP 4 Floor 2", data.field4);
      // printAvailability("NP 5 Floor 1", data.field5);
      // printAvailability("NP 5 Floor 2", data.field6);
      // printAvailability("Tower Floor 1", data.field7);
      // printAvailability("Tower Floor 2", data.field8);

      var msg = "NP 2 Floor 1: " + data.field1 + " "
                + "NP 2 Floor 2: " + data.field2 + " ";

      twiml.message(msg);          

      var arr = _.values(_.omit(data, ['created_at', 'entry_id']));

      console.log(arr);
      return data;
    }).then(function(result) {
      //console.log(result + "hi");
      var twiml = new MessagingResponse();
      //twiml.message("hi " + result);  
      var allZeroes = true;
      var count = 0;
      _.forEach(result, function(floor){
        if (floor != 0 && count < 8) {
          allZeroes = false;
        }
        count++;
      });
      console.log(allZeroes);
      var msg;
      if (allZeroes === true) {
        msg = "No spaces available.";
      } else {

        msg = "NP 2 Floor 1: " + result.field1 + "\n" +
                  "NP 2 Floor 2: " + result.field2 + "\n" +
                  "NP 4 Floor 1: " + result.field3 + "\n" +
                  "NP 4 Floor 2: " + result.field4 + "\n" +
                  "NP 5 Floor 1: " + result.field5 + "\n" +
                  "NP 5 Floor 2: " + result.field6 + "\n" +
                  "NP Tower Floor 1: " + result.field7 + "\n" +
                  "NP Tower Floor 2: " + result.field8 + "\n";
      }  
      twiml.message(msg); 
      
      res.writeHead(200, {
        'Content-Type': 'text/xml'
      });
      res.end(twiml.toString());
      // console.log(twiml.message);
    }).catch(console.log);
    //twiml.message('Number of Available Slots:' + results);
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message('Text the word Park for lot availability');
  }

  // res.writeHead(200, {
  //   'Content-Type': 'text/xml'
  // });
  // res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
