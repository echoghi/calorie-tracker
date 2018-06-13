/**
 * Doughboy Test Server
 * v1.5.0
 * 6/3/17
 */
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = 3030;

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/build'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
server.listen(port, function() {
    console.log(`listening on port ${port}`);
});
