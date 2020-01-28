console.log('WebSocket client script will run here.');

var socket = new WebSocket('ws://localhost:8080');

// Show a connected message when the WebSocket is opened.
socket.onopen = function (event) {
    console.log('WebSocket is connected at ', socket.url);
    socket.send('I am sending this message from the client.');
};

socket.onmessage = function (event) {
    console.log('message send')
};
