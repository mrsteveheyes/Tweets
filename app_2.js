// SETUP

// Get the required modules
var _ = require("underscore")._,
	express = require("express"),
    mustachio = require("mustachio"),
    twitter = require('ntwitter'),
    app = express.createServer(),
	io = require('socket.io').listen(app),
	search_term = "#testing123";

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
	
	io.sockets.emit('twit', {"name":"twit","args":[{"in_reply_to_user_id":null,"text":"Printing orders of service insides while working on the twitter wall #amystevewedding  http://t.co/Rmb5Nli","favorited":false,"entities":{"urls":[{"indices":[87,106],"url":"http://t.co/Rmb5Nli","display_url":"instagr.am/p/Muhfo/","expanded_url":"http://instagr.am/p/Muhfo/"}],"user_mentions":[],"hashtags":[{"text":"amystevewedding","indices":[69,85]}]},"in_reply_to_screen_name":null,"place":null,"geo":null,"source":"<a href=\"http://instagr.am\" rel=\"nofollow\">Instagram</a>","possibly_sensitive":false,"id_str":"112659738214416384","retweeted":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"coordinates":null,"truncated":false,"in_reply_to_user_id_str":null,"retweet_count":0,"contributors":null,"user":{"follow_request_sent":null,"friends_count":485,"profile_link_color":"0765B4","followers_count":471,"profile_image_url_https":"https://si0.twimg.com/profile_images/1384225849/Steve_Avatar_normal.jpg","profile_sidebar_border_color":"ffffff","url":"http://www.steveheyes.co.uk","show_all_inline_media":false,"lang":"en","geo_enabled":false,"description":"Web Developer, Coder, Entrepreneur, Musical Explorer, Youth Work Volunteer, Christian and Amateur Photographer. ","is_translator":false,"contributors_enabled":false,"profile_use_background_image":true,"id_str":"3162641","listed_count":27,"time_zone":"London","profile_background_color":"333333","location":"Birmingham","statuses_count":3607,"following":null,"profile_background_image_url":"http://a1.twimg.com/profile_background_images/1717032/body.jpg","favourites_count":466,"screen_name":"mrsteveheyes","verified":false,"protected":false,"default_profile":false,"profile_text_color":"333333","profile_image_url":"http://a0.twimg.com/profile_images/1384225849/Steve_Avatar_normal.jpg","name":"Steve Heyes","default_profile_image":false,"notifications":null,"profile_background_image_url_https":"https://si0.twimg.com/profile_background_images/1717032/body.jpg","profile_sidebar_fill_color":"ffffff","id":3162641,"profile_background_tile":true,"utc_offset":0,"created_at":"Sun Apr 01 22:53:54 +0000 2007"},"id":112659738214416380,"created_at":"Sat Sep 10 22:52:29 +0000 2011"}]}
);
	
});

// END SETUP
 
// CONTROLLERS
app.get("/", function(req, res){
	
	var output = {
		title: "Amy and Steve Wedding"
	}
	// Render the layout
	res.render('layout', output);
	
});
// END CONTROLLERS

// GO GO GO!
app.listen(8080);
console.log("HTTP Server Started");