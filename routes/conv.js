var express         =           require("express");
var router          =           express.Router();
var builder         =           require('botbuilder');
var mongoose 		= 			require('mongoose');
var User 			= 			require('../models/user');

//=========================================================
// Bot Setup
//=========================================================
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID|| 'cf79fde4-0886-4a5f-9388-5afbeb608ede',
    appPassword: process.env.MICROSOFT_APP_PASSWORD || 'AoRqywNmbqMMvKPM5GxphYG'
 });
var bot = new builder.UniversalBot(connector);
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8d172975-6e46-47c8-ad38-4cd22c1cbb68?subscription-key=ed2d37b304e948ca97cdcb590a71d2e1&timezoneOffset=0&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//=========================================================
// Bots Dialogs
//=========================================================

// ======================
// external dialog
// ======================
var Profile         =           require('../dialog/profile');
var Greet			= 			require('../dialog/greet');
var Artist			= 			require('../dialog/artist');
var Stage 			=			require('../dialog/stage');
var Search 			= 			require('../dialog/search');
var Service 		= 			require('../dialog/service_provider');
// =======================


bot.dialog('profile',Profile.Dialog);
bot.dialog('greet',Greet.Dialog);
bot.dialog('artist',Artist.Dialog);
bot.dialog('stage',Stage.Dialog);
bot.dialog('search',Search.Dialog);
bot.dialog('service',Service.Dialog);
// =======================


intents.onBegin(function(session){
	session.beginDialog('greet',session.userData.greet);
	session.send("You can ask anything regarding the services you need.");
});
intents.matches('Artist',Artist.Dialog);
intents.matches('Search',Search.Dialog);
intents.matches('Stage',Stage.Dialog);



router.post("/",connector.listen());

module.exports = router;