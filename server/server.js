const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var inputs = [Infinity, Infinity];
var players = 0;

wss.on('connection', function connection(ws) {
  // initalize client
  players++;
  console.log('\nconnected to player ', players);

  // assign initial player controls to client
  var id = players;
  ws.send('player' + id);

  ws.on('message', function incoming(message) {
    console.log('received %s from client %s', message, id);

    // switch controls on each level
    if (message == "next level") {
      id = (id == 1) ? 2 : 1;
    }
    else {
      // store incoming move
      var data = message.split(',')
      inputs[id - 1] = parseInt(data[1]);

      // if both player inputs are in, send the update
      if ((inputs[0] < Infinity) && (inputs[1] < Infinity)) {
        wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(inputs))
        })
        console.log('sent: ', inputs)
        // reset for next turn
        inputs = [Infinity, Infinity];
      }
      else { console.log('didnt send') }

      console.log('\n   current inputs: ', inputs, '\n\n')
    }

  });

  ws.on('close', function close() {
    console.log('disconnected');
    players--;
    inputs = [Infinity, Infinity];
  });

});