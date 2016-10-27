var 	mongoose = require('mongoose'),
		TwitterModel = mongoose.model('Twitter-Strategy');
var 	TwitterStrategy  = require('passport-twitter').Strategy;

/**
 * @param app
 */
module.exports = function(app) {
	var config = app.locals.config.get("pluginController:uniformity-auth-twitter"),
		UserController = app.locals.controllers.auth.userController;
		StrategyController = app.locals.controllers.auth.strategyController;

	app.locals.passport.use('twitter', new TwitterStrategy({
			consumerKey     : config.apikey,
			consumerSecret  : config.apisecret,
			callbackURL     : config.callbackURL
		},
		/**
		 *
		 * @param token
		 * @param tokenSecret
		 * @param profile
		 * @param done expecting a callback function of (err, user, flash)
		 */
		function(token, tokenSecret, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Twitter
			process.nextTick(function() {

				//TODO Check if user is already logged in first(adding a second intergration)
				TwitterModel.findOne({ 'id' : profile.id }, function(err, strategy) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err, null, null);

					// if the user is found then log them in
					if (strategy) {
						if(strategy.user){
							strategy.username = profile.username;
							strategy.displayName = profile.displayName;
							strategy.lastStatus = profile._json.status.text;
							strategy.modified = Date.now();
							strategy.save(function (err) {
								if (err) {
									console.error('Strategy Save Error', err)
								}
							});
							return done(null, strategy.user, 'User Found and Logged In'); // user found, return that user
						} else {
							console.log('Error..? there is no user attached to strategy..?');
							return done('Error..? there is no user attached..?', null); //TODO what to do about missing users? well need to erase that strategy record for one
						}


					} else {
						console.log('Need Account creation');

						var twitter = new TwitterModel();//create Twitter record
						twitter.id = profile.id;
						twitter.token = token;
						twitter.username = profile.username;
						twitter.displayName = profile.displayName;//should ensure that ALL strategies have a displayName
						twitter.lastStatus = profile._json.status.text;

						//Record will be created and saved in the UserController
						
						UserController.create({'strategies': [twitter]}, function(err, usr) {
							if (err)
								throw err;
							return done(null, usr, 'New User Registered');
						});

					}
				});
			});
		}
	));
};