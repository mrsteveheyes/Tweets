// SETUP

// Get the required modules
var _ = require("underscore")._,
	express = require("express"),
    mustachio = require("mustachio"),
    twitter = require('ntwitter'),
    app = express.createServer(),
	io = require('socket.io').listen(app),
	search_term = "#amystevewedding";

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

// Start Twitter Stream
twit.stream('statuses/filter', {track: search_term}, function(stream) {
    stream.on('data', function (data) {
		io.sockets.emit('twit', data);
    });
});

// IO Connection
io.sockets.on('connection', function (socket) {
	
	twit.search(search_term, {
		include_entities: true
	}, function(err, data) {
		
		_.each(data.results.reverse(), function(data){
			io.sockets.emit('twit', data);
		});
		
		io.sockets.emit('tweets', data);
			
	});
	
});

// END SETUP
 
// CONTROLLERS
app.get("/", function(req, res){
	
	var output = {
		title: "Amy and Steve Wedding",
		tweets: ""
	}

	console.log(output.tweets);
	
	// Render the layout
	res.render('layout', output);
	
});
// END CONTROLLERS

// GO GO GO!
app.listen(8080);
console.log("HTTP Server Started");