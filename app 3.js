// SETUP

// Get the required modules
var express = require("express"),
    mustachio = require("mustachio"),
    app = express.createServer();

// Configure the app
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.register('.mustache', mustachio);
	app.set('view engine', 'mustache');
});

// CONFIG FOR TWITTER
var config = {
    user: "",
    password: "",
    track: ["#nodetwitter"]};
    
var io = require('socket.io').listen(app),
twitter = new (require("twitter-node").TwitterNode)(config);

twitter
    	.addListener('error', function(error){ // Always check for errors or they popup client side
    		console.log(error.message);
		})
    	.addListener('tweet', function(tweet){ // A new tweet that matches the criteria has been located
    		console.log('Got new tweet');
			io.sockets.emit('twit', JSON.stringify(tweet));
		})
    	.addListener('limit', function(limit){ // New limit has been sent from the API
			sys.puts('LIMIT: ' + sys.inspect(limit));
		})
    	.addListener('delete', function(del){ // A delete event occured
    		sys.puts('DELETE: ' + sys.inspect(del));
		})
    	.addListener('end', function(resp){ // API disconnect
			sys.puts('wave goodbye...' + resp.statusCode);
		})
    .stream();

// END SETUP

// Config for socket.io
io.sockets.on('connection', function(socket) {
	socket.on('ack', function() {
		console.log('client acknowledged twit receipt');
	});
});
 
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