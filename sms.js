// Twilio Credentials
const accountSid = 'AC46efd83eedad5799156a778c0d6c1240';
const authToken = '28e4e9aa89e95e9889bb3fd0a59010c5';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    to: '+12064464934',
    from: '+12066934269',
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    mediaUrl: 'https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg',
  })
  .then(message => console.log(message.sid));
