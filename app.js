// SETUP

// Get the required modules 
var express = require('express'),
	http = require('http'),
	mustachio = require("mustachio"),
	app = express.createServer(),
	io = require('socket.io').listen(app);

// Get the twitter modules
var sys = require('sys'),
   	twitter = require('twitter');

// Set Up Twitter
var twit = new twitter({
    consumer_key: 'qZEChst47WZOC8So6vEidg',
    consumer_secret: 'D0fMPwDOTTyTDOzBJdvZxmihNBVZSWbCVvJET4eWg',
    access_token_key: '3162641-w4804S4VM1Fpx4knfRN3VDXi4BsmlRmm634WoyuVk',
    access_token_secret: 'MQ9jmv5CRPBcq7KkfmY19DNSTSgBIs53C4nNpw'
});
console.log(twit.stream());
// Declare global variables
// Including the Socket...
var global_socket;
// ... and the since when id
var global_since_id;

// WEB SOCKETS
io.sockets.on('connection', function (socket) {
  global_socket = socket;
});

// Configure the app
app.configure(function() {
	
	// Regestering Mustache
	app.register('.mustache', mustachio);
	app.set('view engine', 'mustache');
	// Removing layout for now
	app.set('view options', {
		layout: false
	});
	 app.use(express.static(__dirname + '/public'));
});
// END SETUP

// CONTROLLERS

app.get('/', function(req,res){
	
	twit.stream('statuses/filter', {track:'mrsteveheyes'}, function(stream) {
	    stream.on('data', function (data) {
			console.log(data);
	        //global_socket.emit('twit', data);
	    });
	    // Disconnect stream after five seconds
	    // setTimeout(stream.destroy, 5000);
	});
		// 
		// twit.stream('statuses/sample', function(stream) {
		//     stream.on('data', function (data) {
		//         global_socket.emit('tweets', data);
		//     });
		// });
	
	res.render('index',{
		title: "Steve &amp; Amys Wedding"
	});
	console.log("Responded to: " + req.connection.remoteAddress);
});

// END CONTROLLERS

// GO GO GO
app.listen(8080);
console.log("HTTP Server Started");
