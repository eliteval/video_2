var express = require('express');
var app = express();

// response header for sever-sent events
const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};

// Connected users (request object of each user) :
var users = {};

// SSE starting endpoint
// You can access url `http://localhost:3000/sse/<userId>`
//
// Caution:
// This example exposes <userId> as URI parameter for testing purpose.
// In reality, you should use one stored in req.session. 
app.get('/sse/:userId', function(req, res) {

  let userId = getUserId(req);

  // data for sending
  let data;

  // Stores this connection
  users[userId] = req;

  // Writes response header.
  res.writeHead(200, SSE_RESPONSE_HEADER);

  // Interval loop
  let intervalId = setInterval(function() {
    console.log(`*** Interval loop. userId: "${userId}"`);
    // Creates sending data:
    data = {
      userId,
      users: Object.keys(users).length,
      // memoryUsage: process.memoryUsage()
      time: new Date().getTime(),
    };
    // Note: 
    // For avoidance of client's request timeout, 
    // you should send a heartbeat data like ':\n\n' (means "comment") at least every 55 sec (30 sec for first time request)
    // even if you have no sending data:
    if (!data)
      res.write(`:\n\n`);
    else
      res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 3000);

  // Note: Heatbeat for avoidance of client's request timeout of first time (30 sec) 
  res.write(`:\n\n`);

  req.on("close", function() {
    let userId = getUserId(req);
    console.log(`*** Close. userId: "${userId}"`);
    // Breaks the interval loop on client disconnected
    clearInterval(intervalId);
    // Remove from connections
    delete users[userId];
  });

  req.on("end", function() {
    let userId = getUserId(req);
    console.log(`*** End. userId: "${userId}"`);
  });

});

function getUserId(req) {
  // Note: 
  // In reality, you should use userId stored in req.session, 
  // but not URI parameter. 
  return req.params.userId;
}

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});