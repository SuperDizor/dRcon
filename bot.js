const Discord = require("discord.js");
const Gamedig = require('gamedig');
const client = new Discord.Client();
const settings = require('./config.json');
IsOnline = false;
var timestamp = "\x1b[44m\x1b[31m[" + new Date().toLocaleTimeString('en-CA') + "]\x1b[0m ";

configType = settings.type;
configIp = settings.ip;

function printLog(text) {
  logText = text;
  console.log(timestamp + text);
}

async function statusLoop(state) {
  stateF = state;

  client.user.setActivity('!ark | Server Online', {
    type: 'PLAYING'
  });
  //printLog('[Status Update] Server ONLINE');

  await sleep(2000);
  var playerConnected = '!ark | Players: ' + stateF.raw.numplayers + ' / ' + stateF.maxplayers;
  client.user.setActivity(playerConnected, {
    type: 'PLAYING'
  });
  //printLog('[Status Update] Player(s) Online');

  await sleep(8000);
  var playerConnected = 'Host: ' + stateF.query.host;
  client.user.setActivity(playerConnected, {
    type: 'PLAYING'
  });
  //printLog('[Status Update] Host: ' + stateF.query.host);

  await sleep(4500);
  var playerConnected = 'Map: ' + stateF.map;
  client.user.setActivity(playerConnected, {
    type: 'PLAYING'
  });
  //printLog('[Status Update] Map: ' + stateF.map);
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function gamedigQuery() {
  IsOnline = false;
  Gamedig.query({
    type: configType,
    host: configIp
  }).then((state) => { // update discord bot status + playing string
    IsOnline = true;
    statusrefresh(); // STATUS UPDATED - ONLINE
    statusLoop(state);




    printLog('Player(s) connected: \x1b[33m' + state.raw.numplayers + '/' + state.maxplayers + '\x1b[0m');

  }).catch((error) => { //--------------------------------------------------------OFFLINE---------------------
    // update discord bot status + playing string "Server Offline"
    statusrefresh(); // STATUS UPDATED - OFFLINE

    status = 'Server Offline';
    client.user.setActivity(status, {
      type: 'WATCHING'
    });
    printLog("Server is offline");

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
  printLog("Bot Starting...");
  client.user.setActivity('JavaScript while starting...', {
    type: 'PLAYING'
  });
  printLog('\x1b[32mBot has started, with ' + client.users.size + ' users, in ' + client.channels.size + ' channels of ' + client.guilds.size + ' guilds.\x1b[0m')
  //console.log('\x1b[32m%s\x1b[0m', `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  printLog('IP: \x1b[36m' + configIp + '\x1b[0m');
  printLog('Type: \x1b[36m' + configType + '\x1b[0m');
  client.setInterval(gamedigQuery, 20010);

});


client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
    update();
  }

  const lowm = "ark";
  const capsm = "ARK";
  const capsmo = "Ark";

  if (message.content.includes(lowm) || message.content.includes(capsm) || message.content.includes(capsmo)) {
    message.react(client.emojis.get('319703910002589696')) //SuperDizorTestServer
      //message.react(client.emojis.get('508099744870957086')) // loungeServer
      .then(reaction => printLog("Ark Emojis Added."));
  }

  const ark = "!ark";
  if (message.content.includes(ark)) {
    message.react(client.emojis.get('319703910002589696')) //SuperDizorTestServer
    message.channel.send({
      "embed": {
        "title": "ARK Server Status",
        "color": 1234556,
        "footer": {
          "text": "Discord Bot created by SuperDizor"
        },
        "fields": [{
            "name": "Server Name",
            "value": "Currently Unavailable."
          },
          {
            "name": "Host",
            "value": "cyber-ray.ddns.net"
          }
        ]
      }
    });
  }

});



client.login(settings.token);
