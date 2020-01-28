const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var waiting = false;
var inputs = [Infinity, Infinity];
var players = 0;

wss.on('connection', function connection(ws) {
  ws.bufferType = "arraybuffer";
  players++;
  console.log('\nconnected to player ', players);
  var id = players;

  ws.send('player' + id);

  ws.on('message', function incoming(message) {

    console.log('received: %s', message);
    console.log('running on ', id)

    if (id == message[0]) {
      inputs[id - 1] = parseInt(message[2]);
      console.log('parsed: ', inputs[id-1])
    }

    if ((inputs[0] < Infinity) && (inputs[1] < Infinity)) {
      wss.clients.forEach(function each(client) {
        client.send([1,0])
      })
      console.log('sent: ', inputs)
      inputs = [Infinity, Infinity];
    }
    else { console.log('didnt send') }

    console.log('\n   current inputs: ', inputs, '\n\n')

  });

  ws.on('close', function close() {
    console.log('disconnected');
    players--;
    inputs = [Infinity, Infinity];
  });

});