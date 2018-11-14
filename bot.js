//https://discordapp.com/oauth2/authorize?&client_id=512080043074125825&scope=bot&permissions=0
const Discord = require("discord.js");
const Gamedig = require('gamedig');
const client = new Discord.Client();
const settings = require('./config.json');


function gamedigQuery() {
  Gamedig.query({
    type: 'arkse',
    host: '142.44.239.227'
  }).then((state) => {
    console.log(state);
  }).catch((error) => {
    console.log("Server is offline");
  });


}


client.on('ready', () => {
  console.log("Bot Starting...");
  status = 'JavaScript while starting...';
  client.user.setActivity(status, { type: 'PLAYING' })
  console.log('\x1b[32m%s\x1b[0m',`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.setInterval(gamedigQuery,3000);





});
client.login(settings.token);
