var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var http 			= 		require('http');

var dataRecieved;
http.get("http://www.festmamu.tk/stage/list/", function(res) {
	var body = ''; 
	res.on('data', function(data){
		body += data;
	});
	res.on('end', function() {
		var parsed = JSON.parse(body);
		// console.log(parsed);
		dataRecieved= parsed.stage;

	});
})
.on('error', function(e) {
	console.log("Got error: " + e.message);
});



StageProvider = {
	Label	: 	'StageProvider',
	Dialog	: 	[
		function(session,args,next){
			session.sendTyping();
				session.send("you have to answer some questions before we can show you your data...");
				builder.Prompts.text(session,"What is the user name you've used to signup on festmamu?");
		},
		function(session,args,next){
			var found=false;
			if(args.response){
				session.send("looking for your profile on the festmamu database");
				session.sendTyping();
				var regex = new RegExp(args.response,"i");
				for(i in dataRecieved){
					if(regex.test(dataRecieved[i].author.username)){
						console.log(dataRecieved[i]);
						card= createHeroCard(session,dataRecieved[i]);
						var msg = new builder.Message(session).addAttachment(card);
						session.sendTyping();
				        session.send(msg);
				        found =true;
					}
				}
			}
			if(!found){
				session.sendTyping();
				session.send("I did not find your data on the festmamu database.");
				card= createSigninCard(session);
				var msg = new builder.Message(session).addAttachment(card);
				session.send(msg);
				session.endDialog();
			}else
				session.endDialog();
		}
		]
	};
	function createSigninCard(session) {
	    return new builder.HeroCard(session)
	        .title("error")
	        .subtitle(' We are glad to have a provider. You can provide services only on sign up.')
	        .text('Would you like to Sign-Up?')
	        .buttons([builder.CardAction.openUrl(session, 'http://www.festmamu.tk/register', 'Sign-Up')]);
	}
	
function createHeroCard(session,data){
	return new builder.HeroCard(session)
					        .title(data.Comp_Name)
					        .subtitle('located in :'+data.Location.City+' \ncontact:'+data.Location.Contact1 )
					        .text('cost:'+data.cost.Cost+'\n  Views:'+data.views+
					        	'\n  Comments:'+data.Comments.length)
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+data.author.id+'/mylistings', 'More Information')
					        ]);
}

module.exports = StageProvider;