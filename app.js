var express = require("express"),
    mustachio = require("mustachio"),
    twitter = require('ntwitter'),
    app = express.createServer();
    
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.register('.mustache', mustachio);
	app.set('view engine', 'mustache');
});
    
var twit = new twitter({
    consumer_key: 'qZEChst47WZOC8So6vEidg',
    consumer_secret: 'D0fMPwDOTTyTDOzBJdvZxmihNBVZSWbCVvJET4eWg',
    access_token_key: '3162641-w4804S4VM1Fpx4knfRN3VDXi4BsmlRmm634WoyuVk',
    access_token_secret: 'MQ9jmv5CRPBcq7KkfmY19DNSTSgBIs53C4nNpw'
});
    
app.get("/", function(req, res){
	
	twit.stream('statuses/filter', {track: "#amystevewedding"}, function(stream) {
	    stream.on('data', function (data) {
	        console.log(console.dir(data));
	    });
	});

	res.render('layout', {
		title: "Amy and Steve Wedding"
	});
});

app.listen(8080);
console.log("HTTP Server Started");