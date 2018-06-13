/**
 * Portfolio Server
 * v2.0.0
 * 6/3/17
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var port = 3030;

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/build'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
server.listen(port, function() {
    console.log('listening on port 3000');
});
