// Load up the discord.js library

const Discord = require("discord.js");
const bot = new Discord.Client();



// This is your client. Some people call it `bot`, some people call it `self`, 

// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,

// this is what we're refering to. Your client.

const client = new Discord.Client();



// Here we load the config.json file that contains our token and our prefix values. 

const config = require("./config.json");

// config.token contains the bot's token

// config.prefix contains the message prefix.



client.on("ready", () => {

  // This event will run if the bot starts, and logs in, successfully.

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  // Example of changing the bot's playing game to something useful. `client.user` is what the

  // docs refer to as the "ClientUser".

 // client.user.setActivity(`Eating idiots`);

 	client.user.setActivity('eating pussies', { type: 'playing' })
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'www.pornhub.com'}`))
  .catch(console.error);

  // Set the client user's status
  client.user.setStatus('idle')
  .then(console.log)
  .catch(console.error);

});



client.on("guildCreate", guild => {

  // This event triggers when the bot joins a guild.

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

  client.user.setActivity(`Serving ${client.guilds.size} servers`);

});



client.on("guildDelete", guild => {

  // this event triggers when the bot is removed from a guild.

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

  client.user.setActivity(`Serving ${client.guilds.size} servers`);

});





client.on("message", async message => {

  // This event will run on every single message received, from any channel or DM.

  

  // It's good practice to ignore other bots. This also makes your bot ignore itself

  // and not get into a spam loop (we call that "botception").

  if(message.author.bot) return;

  

  // Also good practice to ignore any message that does not start with our prefix, 

  // which is set in the configuration file.

  if(message.content.indexOf(config.prefix) !== 0) return;


  //enable tts 


  

  // Here we separate our "command" name, and our "arguments" for the command. 

  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:

  // command = say

  // args = ["Is", "this", "the", "real", "life?"]

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();


  

  

  // Let's go with a few common example commands! Feel free to delete or change those.

  

  if(command === "ping") {

    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.

    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)

    const m = await message.channel.send("Ping?");

    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);

  }

  

  if(command === "say") {

    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 

    // To get the "message" itself we join the `args` back into a string with spaces: 

    const sayMessage = args.join(" ");

    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.

    message.delete().catch(O_o=>{}); 

    // And we get the bot to speak the thing: 

    message.channel.send(sayMessage, {tts:true});
    

  }

  

  if(command === "kick") {

    // This command must be limited to mods and admins. In this example we just hardcode the role names.

    // Please read on Array.some() to understand this bit: 

    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?

    if(!message.member.roles.some(r=>["Administrator", "Moderator","Anonymous Hanna"].includes(r.name)) )

      return message.reply("LOL nice try biatch ;)");

    

    // Let's first check if we have a member and if we can kick them!

    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.

    // We can also support getting the member by ID, which would be args[0]

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);

    if(!member)

      return message.reply("Please mention a valid member of this server");

    if(!member.kickable) 

      return message.reply("He is noob no need for kick he will kill himself soon :D");

    

    // slice(1) removes the first part, which here should be the user mention or ID

    // join(' ') takes all the various parts to make it a single string.

    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    

    // Now, time for a swift kick in the nuts!

    await member.kick(reason)

      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));

    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);



  }

  

  if(command === "ban") {

    // Most of this command is identical to kick, except that here we'll only let admins do it.

    // In the real world mods could ban too, but this is just an example, right? ;)

    if(!message.member.roles.some(r=>["Administrator","Anonymous Hanna"].includes(r.name)) )

      return message.reply("Sorry, you don't have permissions to use this!");

    

    let member = message.mentions.members.first();

    if(!member)

      return message.reply("Please mention a valid member of this server");

    if(!member.bannable) 

      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");



    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    

    await member.ban(reason)

      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.member.send("You have wasted your last chance in our discord");
      message.channel.send(`${member.user.tag} has been banned because: ${reason}`);
//    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);

  }

  

  if(command === "purge") {

    // This command removes all messages from all users in the channel, up to 100.

    

    // get the delete count, as an actual number.

    const deleteCount = parseInt(args[0], 10);

    

    // Ooooh nice, combined conditions. <3

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)

      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    

    // So we get our messages, and delete them. Simple enough, right?

    const fetched = await message.channel.fetchMessages({limit: deleteCount});

    message.channel.bulkDelete(fetched)

      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

  }


  if(command === "spam") {

    // makes the bot spam something . 

    // To get the "message" itself we join the `args` back into a string with ":" : 

    const sayMessage = args.join(" ");


    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.

    message.delete().catch(O_o=>{}); 
      
    // And we get the bot to say the thing: 


    for (var i = 0; i < 5; i++) {
      message.channel.send(sayMessage);
    }
  }


if (command == "leave" || command == "dc" || command == "l") {

 message.member.voiceChannel.leave();
  message.reply('Thank you for using SexyFlexy!');
}


if (command === "join" || command == "j") {

if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('I have successfully connected to the channel!');
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
}
if (command == "intro" || command == "i") {

  message.channel.send('Hello everyone!! I am SexyFlexy I am glad to be Here Love <3');
}

//sound effects { fart, potato, illuminati, wtf, theone, fail}
if (command == "fart") {

message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/fart.mp3');
  })
  .catch(console.error);
}

if (command == "potato") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/potato.ogg');
  })
  .catch(console.error);
}

if (command == "illuminati") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/Illuminati.mp3');
  })
  .catch(console.error);
}

if (command == "theone") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/tone.mp3');
  })
  .catch(console.error);
}

if (command == "fail") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/fail.mp3');
  })
  .catch(console.error);
}

if (command == "wtf") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/WTF.mp3');
  })
  .catch(console.error);
}

if (command == "sillabye") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/sillabye.ogg');
  })
  .catch(console.error);
}

if (command == "yih") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/yih.ogg');
  })
  .catch(console.error);
}
if (command == "nemo") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/nemo.ogg');
  })
  .catch(console.error);
}

if (command == "n") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/rn.mp3');
  })
  .catch(console.error);
}
if (command == "hi") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/hi.ogg');
  })
  .catch(console.error);
}

if (command == "bye") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/bye.ogg');
  })
  .catch(console.error);
}

if (command == "der") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/der.mp3');
  })
  .catch(console.error);
}
if (command == "el") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/el.mp3');
  })
  .catch(console.error);
}

if (command == "horn") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/horn.mp3');
  })
  .catch(console.error);
}

if (command == "doit") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/doit.mp3');
  })
  .catch(console.error);
}

if (command == "mosso") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/mosso.ogg');
  })
  .catch(console.error);
}

if (command == "mablouk") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/mablouk.ogg');
  })
  .catch(console.error);
}

if (command == "meshe") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/meshe_l_hal.ogg');
  })
  .catch(console.error);
}

if (command == "gay") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/gay.mp3');
  })
  .catch(console.error);
}


if (command == "eat") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/eating.mpeg');
  })
  .catch(console.error);
}
if (command == "gaby") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/gaby.mp3');
  })
  .catch(console.error);
}

if (command == "gaby2") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/gaby2.mp3');
  })
  .catch(console.error);
}

if (command == "bando2") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/bando2.mp3');
  })
  .catch(console.error);
}
if (command == "tayib") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/tayib.mp3');
  })
  .catch(console.error);
}

if (command == "halib") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/halib.mp3');
  })
  .catch(console.error);
}
if (command == "aber") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/aber.ogg');
  })
  .catch(console.error);
}

if (command == "yaya") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/yaya.ogg');
  })
  .catch(console.error);
}

if (command == "mabsout") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/mabsout.ogg');
  })
  .catch(console.error);
}

if (command == "ouwe") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/ouwe.ogg');
  })
  .catch(console.error);
}

if (command == "ragingheller") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/kolkhara.ogg');
  })
  .catch(console.error);
}
if (command == "yazalemni") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/yazalemni.mp3');
  })
  .catch(console.error);
}
if (command == "takbir") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/takbir.mp3');
  })
  .catch(console.error);
}

if (command == "shouesmo") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/shouesmo.mp3');
  })
  .catch(console.error);
}

if (command == "salam") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/salam.mp3');
  })
  .catch(console.error);
}


if (command == "ohda2") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/ohda2.mp3');
  })
  .catch(console.error);
}

if (command == "menmin") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/menmin.mp3');
  })
  .catch(console.error);
}


if (command == "lamin") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/lamin.mp3');
  })
  .catch(console.error);
}

if (command == "hahay") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/hahay.mp3');
  })
  .catch(console.error);
}


if (command == "ezashayefni") {

  message.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile('C:/Users/User/Desktop/BOT/audio/ezashayefni.mp3');
  })
  .catch(console.error);
}


if (command == "help" || command == "h") {



//message.channel.send("```!!ban\t\t\t\t   !!fail\t\t\t\t\n!!spam\t\t\t\t  !!wtf \t\t\t\t\n!!join\t\t\t\t  !!yih \t\t\t\t\n!!leave\t\t\t\t !!nemo\t\t\t\t\n!!fart\t\t\t\t  !!n 	  \t\t\t\n!!intro\t\t\t\t !!hi  \t\t\t\t\n!!potato\t\t\t\t!!bye \t\t\t\t\n!!illuminati\t\t\t!!der \t\t\t\t\n!!theone\t\t\t\t-el  \t\t\t\t\n-horn\t\t\t\t  -gay \t\t\t\t\n-doit\t\t\t\t  -eat \t\t\t\t\n!!mosso\t\t\t\t !!play [youtube link] \n!!mablouk\t\t\t   !!meshe\n!!halib\t\t\t     !!tayib\n!!bando2\t\t\t    !!aber\n!!yaya\t\t\t      !!ragingheller\n!!ouwe\t\t\t      !!mabsout```");
//message.channel.send("```!!ban\t\t\t\t   !!fail\t\t\t\t\n!!spam\t\t\t\t  !!wtf \t\t\t\t\n!!join\t\t\t\t  !!yih \t\t\t\t\n!!leave\t\t\t\t !!nemo\t\t\t\t\n!!fart\t\t\t\t  !!n    \t\t\t\n!!intro\t\t\t\t !!hi  \t\t\t\t\n!!potato\t\t\t\t!!bye \t\t\t\t\n!!illuminati\t\t\t!!der \t\t\t\t\n!!theone\t\t\t\t!!el  \t\t\t\t\n!!horn\t\t\t\t  !!gay \t\t\t\t\n!!doit\t\t\t\t  !!eat \t\t\t\t\n!!mosso\t\t\t\t !!play [youtube link] \n!!mablouk\t\t\t   !!meshe\n!!halib\t\t\t     !!tayib\n!!bando2\t\t\t    !!aber\n!!yaya\t\t\t      !!ragingheller\n!!ouwe\t\t\t      !!mabsout```");

message.channel.send("```!!ban\t\t\t\t   !!fail\t\t\t\t\n!!spam\t\t\t\t  !!wtf \t\t\t\t\n!!join\t\t\t\t  !!yih \t\t\t\t\n!!leave\t\t\t\t !!nemo\t\t\t\t\n!!fart\t\t\t\t  !!n    \t\t\t\n!!intro\t\t\t\t !!hi  \t\t\t\t\n!!potato\t\t\t\t!!bye \t\t\t\t\n!!illuminati\t\t\t!!der \t\t\t\t\n!!theone\t\t\t\t!!el  \t\t\t\t\n!!horn\t\t\t\t  !!gay \t\t\t\t\n!!doit\t\t\t\t  !!eat \t\t\t\t\n!!mosso\t\t\t\t !!play [youtube link] \n!!mablouk\t\t\t   !!meshe\n!!halib\t\t\t     !!tayib\n!!bando2\t\t\t    !!aber\n!!yaya\t\t\t      !!ragingheller\n!!ouwe\t\t\t      !!mabsout\n!!yazalemni\t\t\t !!takbir\n!!shouesmo\t\t\t  !!salam\n!!ohda2\t\t\t     !!menmin\n!!lamin\t\t\t     !!hahay\n!!ezashayefni\t\t\t      ```");

message.channel.send("```upload now ur audio here :``` :sign_of_the_horns::skin-tone-5: https://bit.ly/31bufbk :sign_of_the_horns::skin-tone-5:")
}





if(command == "play") {


// Play streams using ytdl-core


	 // To get the "url"  

const streamUrl = args.join(" ");

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const broadcast = client.createVoiceBroadcast();

message.member.voiceChannel.join()
  .then(connection => {
    const stream = ytdl(streamUrl, { filter : 'audioonly' });
    broadcast.playStream(stream);
   	message.channel.send(':thumbsup:');
   	message.author.send('yalla nfokh');
    const dispatcher = connection.playBroadcast(broadcast);
  })
  .catch(console.error);

 	

	
}

if(command === "test") {

    //if(!message.member.roles.some(r=>["Anonymous Hanna"].includes(r.name)) )
 	if(!message.member.roles.some(r=>["testing"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

		//var role = message.guild.roles.find(roles => role.name === "test");
		
			//message.member.roles.some(r=>["Administrator"].includes(r.name))
			const guildMember = message.member;

  			guildMember.addRole('516719741403136002');
  			//const role = message.guild.roles.find('name', 'test');
			//message.member.addRole(role);

  }








if(command === "test2") {

    //if(!message.member.roles.some(r=>["Anonymous Hanna"].includes(r.name)) )
 	if(!message.member.roles.some(r=>["Anonymous Hanna"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

		//var role = message.guild.roles.find(roles => role.name === "test");
		
			//message.member.roles.some(r=>["Administrator"].includes(r.name))
			const guildMember = message.member;

  			guildMember.addRole('541771588626808872');
  			//const role = message.guild.roles.find('name', 'test');
			//message.member.addRole(role);

  }




});



client.login(process.env.BOT_TOKEN);
