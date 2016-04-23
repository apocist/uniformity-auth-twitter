module.exports = function(callback) {
	callback({
		name: 'Twitter Authentication',
		description: 'Allows users via twitter',
		models: {},
		controllers: {},
		routes: {},
		views: {},
		loadOrder:{
			'passport.strategy': [{
				order: 2000,//doesn't really matter
				item: __dirname+'/app/controllers/auth/twitter.auth.server.strategy.js'
			}]
		},
		defaults: require(__dirname+'/config/defaults.json')
	});
};