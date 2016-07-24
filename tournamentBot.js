


var Discord = require("discord.js");

var bot = new Discord.Client();

var teams = [];

bot.on("ready", function() {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

var commands = {
	
	"addTeam": {
		usage: "<team name>",
		description: "Adds a team to the tournament",
		process: function(bot, msg, suffix) {
            
            if(!suffix){
                bot.sendMessage(msg.channel, "Needs Team Name");
            }
			else {
				teams.push("*$*"+suffix);
				bot.sendMessage(msg.channel, "Team " + suffix + " Added");
				console.log(teams.toString());
			}
		}
	},
	"ping": {
		description: "Returns Pong",
		process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, msg.sender+" pong!");
            if(suffix){
                bot.sendMessage(msg.channel, "note that !ping takes no arguments!");
            }
		}
	},
	"currentTeams": {
		description: "Shows how many teams are currently in the tournament",
		process: function(bot, msg, suffix) {
            if(teams.length == 0){
				bot.sendMessage(msg.channel, "No teams are in the tournament");
				
			}
			else {
				var tempTeamList = "Current Teams: \n";
				
				for (var i = 0; i < teams.length; ++i){
					var team = teams[i];
					if (teams[i].substring(0,3) == "*$*"){
						team = teams[i].substring(3);
						console.log(team);
					}
					tempTeamList = tempTeamList + team+ "\n";

				}
				bot.sendMessage(msg.channel, tempTeamList);
			}
		}
	},
	
	"removeTeam": {
		usage: "<team name>",
		description: "Removes team from tournament",
		process: function(bot, msg, suffix) {
			var tempTeam = [];
			var teamFound = false;
			for (var i = 0; i < teams.length; ++i){
				if(teams[i] == suffix || teams[i] == "*$*"+suffix){
					teams.splice(i,1);
					teamFound = true;
				}
			}
			
			if (teamFound){
				bot.sendMessage(msg.channel, "Team " + suffix + " was removed.");
			}
			else{
				bot.sendMessage(msg.channel, "Team " + suffix + " was not removed.");
			}
		}
	},
	
	"paid": {
		usage: "<team name>",
		description: "Team has paid the correct fees",
		process: function(bot, msg, suffix) {
			var teamFound = false;
			var paid = false;
			if (suffix){
				for (var i = 0; i < teams.length; ++i){
					if(teams[i] == "*$*"+suffix){
						var temp = teams[i];
						teams[i] = temp.substring(3);
						teamFound = true;
						console.log("Found Team not paid " + teams[i]);
					}
					else if(teams[i] == suffix){
						teamFound = true;
						paid = true;
						console.log("Found Team, paid");
					}
				}
			
				if (teamFound && paid){
					bot.sendMessage(msg.channel, "Team " + suffix + " already paid all fees");
				}
				else if(teamFound && !paid){
					bot.sendMessage(msg.channel, "Team " + suffix + " status was changed to paid.");
				}
				else{
					bot.sendMessage(msg.channel, "Team " + suffix + " was not found in the tournament list.");
				}
			}
			else {
				bot.sendMessage(msg.channel, "Command needs a team name.");
			}
		}
	},
	
	"teamsWithFees": {
		description: "Shows a list of teams that still need to pay",
		process: function(bot, msg, suffix) {
            if(teams.length == 0){
				bot.sendMessage(msg.channel, "No teams are in the tournament");
				
			}
			else {
				var tempTeamList = "Teams That Still Need To Pay: \n";
				var atLeastOne = false;
				for (var i = 0; i < teams.length; ++i){
					var team = teams[i];
					if (teams[i].substring(0,3) == "*$*"){
						team = teams[i].substring(3);
						console.log(team);
						atLeastOne = true;
						tempTeamList = tempTeamList + team+ "\n";
					}
					
					
					
				}
				if(atLeastOne){
					bot.sendMessage(msg.channel, tempTeamList);
				}
				else{
					bot.sendMessage(msg.channel, "All teams have paid!");
				}
			}
		}
	},
	"teamsWithoutFees": {
		description: "Shows a list of teams that have paid all fees",
		process: function(bot, msg, suffix) {
            if(teams.length == 0){
				bot.sendMessage(msg.channel, "No teams are in the tournament");
				
			}
			else {
				var tempTeamList = "Teams That Have Paid: \n";
				var atLeastOne = false;
				for (var i = 0; i < teams.length; ++i){

					if (teams[i].substring(0,3) != "*$*"){
						atLeastOne = true;
						tempTeamList = tempTeamList + teams[i]+ "\n";
					}
				}
				if(atLeastOne){
					bot.sendMessage(msg.channel, tempTeamList);
				}
				else{
					bot.sendMessage(msg.channel, "No current teams have paid");
				}
			}
		}
	},
	"channels": {
        description: "lists channels bot is connected to",
        process: function(bot,msg) { bot.sendMessage(msg.channel,bot.channels);}
    },
	
	
	"secretCat": {
        description: "A secret cat",
        process: function(bot,msg) { bot.sendMessage(msg.channel,"https://c1.staticflickr.com/1/96/224241477_6bb3d1fb9f_b.jpg");}
    },
	
	
	
	
	
	
}

bot.on("message", function (msg) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content[0] === '%' || msg.content.indexOf(bot.user.mention()) == 0)){
        console.log("treating " + msg.content + " from " + msg.author + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(1);
		console.log(cmdTxt);
        var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
		console.log(suffix);
        if(msg.content.indexOf(bot.user.mention()) == 0){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
			} catch(e){ //no command
				bot.sendMessage(msg.channel,"Yes?");
				return;
			}
        }
		
		var cmd = commands[cmdTxt];
		console.log("Looking for commands " + cmd);
        if(cmdTxt === "help"){
            //help is special since it iterates over the other commands
			bot.sendMessage(msg.author,"Available Commands:", function(){
				for(var cmd in commands) {
					
					var info = "%" + cmd;
					var usage = commands[cmd].usage;
					if(usage){
						info += " " + usage;
					}
					var description = commands[cmd].description;
					if(description){
						info += "\n\t" + description;
					}
					bot.sendMessage(msg.author,info);
				}
			});
        }
		else if(cmd) {
			try{
				cmd.process(bot,msg,suffix);
			} catch(e){
				
				bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
				
			}
		} 
		else {
			
				bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
			
		}
	} 
	else {
		//message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return;
        }
        
        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                bot.sendMessage(msg.channel,msg.author + ", you called?");
        }
    }
});





