// SETUP

// Get the required modules
var express = require("express"),
    mustachio = require("mustachio"),
    twitter = require('ntwitter'),
    app = express.createServer(),
	io = require('socket.io').listen(app);

// Configure the app
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.register('.mustache', mustachio);
	app.set('view engine', 'mustache');
});

// Set Up Twitter 
var twit = new twitter({
    consumer_key: 'qZEChst47WZOC8So6vEidg',
    consumer_secret: 'D0fMPwDOTTyTDOzBJdvZxmihNBVZSWbCVvJET4eWg',
    access_token_key: '3162641-w4804S4VM1Fpx4knfRN3VDXi4BsmlRmm634WoyuVk',
    access_token_secret: 'MQ9jmv5CRPBcq7KkfmY19DNSTSgBIs53C4nNpw'
});

// Including the Socket...
var global_socket = io.socket;
var data = {text: "We have lift off"};

// WEB SOCKETS
io.sockets.on("connection", function(socket){

	socket.on("clientMessage", function(tweet){
		console.log(tweet);
		socket.broadcast.emit('twit', tweet);
	})
	
});

// Start Twitter Stream
twit.stream('statuses/filter', {track: "#nodetwitter"}, function(stream) {
    stream.on('data', function (data) {
		console.log(data);
		io.sockets.emit("clientMessage", data);
    });
});

// END SETUP
 
// CONTROLLERS
app.get("/", function(req, res){

	// Render the layout
	res.render('layout', {
		title: "Amy and Steve Wedding"
	});
});
// END CONTROLLERS

// GO GO GO!
app.listen(8080);
console.log("HTTP Server Started");