const Discord = require("discord.js");
const Gamedig = require('gamedig');
const client = new Discord.Client();
const settings = require('./config.json');
IsOnline = false;

configType = settings.type;
configIp = settings.ip;
// install forever

function gamedigQuery() {
  IsOnline = false;
  Gamedig.query({
    type: configType,
    host: configIp
  }).then((state) => { // update discord bot status + playing string
    IsOnline = true;
    statusrefresh(); // STATUS UPDATED - ONLINE
    status = 'Server Online';
    client.user.setActivity(status, {
      type: 'PLAYING'
    });

    console.log('Player(s) connected: \x1b[33m' + state.raw.numplayers + '/' + state.maxplayers + '\x1b[0m');

  }).catch((error) => { //--------------------------------------------------------OFFLINE---------------------
    // update discord bot status + playing string "Server Offline"
    statusrefresh(); // STATUS UPDATED - OFFLINE

    status = 'Server Offline';
    client.user.setActivity(status, {
      type: 'WATCHING'
    });
    console.log("Server is offline");

  });
}

function statusrefresh() {
  if (IsOnline === true) {
    client.user.setStatus('online');
  } else {
    client.user.setStatus('dnd');

  }

}


client.on('ready', () => {
  client.user.setStatus('idle');
  console.log("Bot Starting...");
  status = 'JavaScript while starting...';
  client.user.setActivity(status, {
    type: 'PLAYING'
  });
  console.log('\x1b[32m%s\x1b[0m', `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  console.log('IP: \x1b[36m' + configIp + '\x1b[0m');
  console.log('Type: \x1b[36m' + configType + '\x1b[0m');
  client.setInterval(gamedigQuery, 3000);



});
client.login(settings.token);
