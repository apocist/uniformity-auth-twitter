//noinspection JSUnusedGlobalSymbols
var 	mongoose = require('mongoose'),//required from uniformity
		extend = require('mongoose-schema-extend'),//required from uniformity
		strategy = mongoose.model('Strategy').schema;//pre-loaded from uniformity
	
var TwitterSchema = strategy.extend({
	type: {type: String, default: 'twitter', enums: ['twitter']},
	id: String,
	token: String,
	username: String,
	displayName: String,
	lastStatus: String
});


TwitterSchema.statics.formschema = {
	/*content: {
		title : 'Page Content',
		type : 'string',
		formtype: 'textarea',
		placeholder : 'Page Content'
	}*/
};
//ageSchema.statics.objectParent = ['Page.Routable.Site', 'Routable.Site', 'Site'];
//PageSchema.statics.defaultPermission = [0,0,0,0,0,0,1,1];//only Read All
//PageSchema.statics.controller = "page.routable.server.controller";//not needed, using as example
mongoose.model('Twitter-Strategy', TwitterSchema);