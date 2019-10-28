const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var search = require('youtube-search');
var opts = {
    maxResults: 10,
    key: (config.key)
};
const embed = {
    "title": "Help",
    "url": "https://discordapp.com",
    "color": 11164149,
    "thumbnail": {
      "url": "https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/2018-04/help-153094_1280_pixabay_openclipart-vectors.png"
    },
    "author": {
      "name": "Jaccus Bot",
      "url": "https://discordapp.com",
      "icon_url": "https://i.ibb.co/rfGcZ1t/The-Hollow.jpg"
    },
    "fields": [
      {
        "name": "Ping",
        "value": "Returns the Host-Latency and API-Latency"
      },
      {
        "name": "Invite",
        "value": "Returns the Bot Link"
      },
      {
        "name": "Search (Argument)",
        "value": "Searches YouTube for (Argument)"
      },
      {
        "name": "Kick (Mention User) (Reason)",
        "value": "Kicks the (Mention User). Sends Private Message to (Mention User) with (Reason). (Reason is not required)."
      },
      {
        "name": "Ban (Mention User) (Reason)",
        "value": "Bans the (Mention User). Sends Private Message to (Mention User) with (Reason). (Reason is not required)."
      },
      {
        "name": "Purge (Number)",
        "value": "Bulk deletes (Number) messages. (Number) must be between 2 and 6000 to avoid errors."
      },
      {
        "name": "Say (Argument)",
        "value": "Makes the bot send a message containing (Argument)"
      }
    ]
  };

//Bot Logging In
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag} with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`Prefix ${config.prefix}`);
  });

//Joining/Leaving Guilds
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

//When Message Is Recieved
client.on("message", async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;
  
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    client.user.setActivity(`Prefix ${config.prefix} | Active In: ${message.guild}`);

    if(command === "ping") {
        const m = await message.channel.send("Pinging...");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        return;
    }
    if(command === "help") {
        message.channel.send({ embed });
        return;
    }
    if(command === "invite") {
        message.channel.send("https://discordapp.com/api/oauth2/authorize?client_id=638419700933459969&scope=bot&permissions=8");
        return;
    }
    if(command === "github") {
      message.channel.send("https://github.com/Jaccus1/Ed-Jaccus");
      return;
    }
    if(command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{}); 
        message.channel.send(sayMessage);
        return;
    }
    //Searches For Video On Youtube
    if (command === "search") {
        search(args.join(" "), opts, function(err, results) {
            if(err) return console.log(err);
            //for (l = 0; l < 3; l++) {
                //console.log(results[l].link)
                //message.channel.send(results[l].link);
            //}
            message.channel.send(results[0].link);
        });
        return;
    }
        if(command === "kick") {
          if (!message.member.hasPermission("KICK_MEMBERS"))
            return message.reply("You do not have permission to do this!");
            let member = message.mentions.members.first() || message.guild.members.get(args[0]);
            if(!member)
              return message.reply("I do not know who that is!\n Try mentioning the user target instead.");
            if(!member.kickable) 
              return message.reply("I do not have permission to do this!");
            
            let reason = args.slice(1).join(' ');
            if(!reason) reason = `You have been kicked from ${message.guild}`;
            
            await member.kick(reason)
              .catch(error => message.reply(`I couldn't kick because: ${error}`));
            message.reply(`${member.user.tag} was kicked by ${message.author.tag} because: ${reason}`);
            return;
        }
        if(command === "ban") {
          if (!message.member.hasPermission("BAN_MEMBERS"))
            return message.reply("You do not have permission to do this!");
            let member = message.mentions.members.first();
            if(!member)
              return message.reply("I do not know who that is!\n Try mentioning the user target instead.");
            if(!member.bannable) 
              return message.reply("I do not have permission to do this!");
        
            let reason = args.slice(1).join(' ');
            if(!reason) reason = `You have been banned from ${message.guild}`;
            
            await member.ban(reason)
              .catch(error => message.reply(`I couldn't kick because: ${error}`));
            message.reply(`${member.user.tag} was banned by ${message.author.tag} because: ${reason}`);
            return;
          }
          if(command === "purge") {
            if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("You do not have permission to do this!");
                    const deleteCount = parseInt(args[0], 10);
            
                    if(!deleteCount || deleteCount < 2 || deleteCount > 6000)
                        return message.reply("I cannot delete that many messages!");
            
                    const fetched = await message.channel.fetchMessages({limit: deleteCount});
                    message.channel.bulkDelete(fetched)
                    .catch(error => message.reply(`I Couldn't delete messages because: ${error}`));
                    return;
        }
    else { message.reply(`That is not a valid command! Type ${config.prefix}help for a list of commands with more info!`) }
});


//Bot Logging In
client.login(config.token);
//https://discordapp.com/api/oauth2/authorize?client_id=638419700933459969&scope=bot&permissions=8