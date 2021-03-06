var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
Service = {
	Label	: 	'Service',
	Dialog	: 	[
		function(session,args,next){
			builder.Prompts.choice(
			session,
			"What type of service do you render?",
			["Stage Provider","Artist"],
	        {
	            maxRetries: 2,
	            retryPrompt: 'Not a valid option '+session.userData.name+'.'
	      	});
		},
		function(session,results){
			if(results.response.entity){
				session.send("%s",results.response.entity);
				if(results.response.entity != 'Artist')
					session.beginDialog('stageProvider');
				else
					session.beginDialog('artistProvider');
				
			}
		}
		]
	};

module.exports = Service;