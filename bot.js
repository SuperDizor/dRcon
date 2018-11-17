const Discord = require("discord.js");
const Gamedig = require('gamedig');
const client = new Discord.Client();
const settings = require('./config.json');

var cRed = "\x1b[31m";
var cBlue = "\x1b[34m";
var cYellow = "\x1b[33m";
var cGreen = "\x1b[32m";
var cCyan = "\x1b[36m";
var cNormal = "";
var cReset = "\x1b[0m"; // DON'T FORGET RESET FONT

configType = settings.type;
configIp = settings.ip;
IsOnline = false;
var versionStart = "(v000.001)";
var versionRefresh = "(v000.000)";

Gamedig.query({
  type: configType,
  host: configIp
}).then((stateo) => {
  serverInfo = stateo;
}).catch((error) => {

  client.user.setActivity('Server Offline', {type: 'WATCHING'});

});

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function printLog(text, color) {
  if (color === undefined) color = cNormal;
  var timestamp = "[" + new Date().toLocaleTimeString('en-CA') + "] ";
  colorLog = color;
  logText = text;
  console.log(timestamp + colorLog + text + cReset);
}


async function statusLoop(state) { //neeeeeeeeeedd work !!!!!!!!!!!
  stateF = state;
  serverInfo = stateF;

  client.user.setActivity('!ark | Server Online', {type: 'PLAYING'});

  await sleep(4000);
  //var playerConnected = '!ark | Players: ' + stateF.raw.numplayers + ' / ' + stateF.maxplayers;
  client.user.setActivity('!ark | Players: ' + stateF.raw.numplayers + ' / ' + stateF.maxplayers, {
    type: 'PLAYING'
  });

  await sleep(5000);
  //var playerConnected = 'Host: ' + stateF.query.host;
  client.user.setActivity('Host: ' + stateF.query.host, {type: 'PLAYING'});

  // ICI LE CODE POUR LA VERSION
  await sleep(5000);
  nameComplete = serverInfo.name;
  //console.log(nameComplete);
  var versionRefresh = nameComplete.slice(-10);
  //console.log(version);
  //console.log(versionStart);
  //console.log(versionRefresh);
  if (versionRefresh !== versionStart){
  versionStart = versionRefresh;
    printLog("Version: " + versionRefresh, cCyan);
  }
  //printLog("Version:" + version);
  //var playerConnected = 'Version: WIP';
  client.user.setActivity('Version: ' + versionRefresh, {type: 'PLAYING'});

  await sleep(5000);
  //var playerConnected = 'Name: ' + stateF.name;
  client.user.setActivity(serverInfo.name, {type: 'PLAYING'});

  await sleep(5000);
  //var playerConnected = 'Map: ' + stateF.map;
  client.user.setActivity('Map: ' + stateF.map, {type: 'PLAYING'});

}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function gamedigQuery() {
  //printLog("gamedigQuery Started");
  IsOnline = false;
  Gamedig.query({
    type: configType,
    host: configIp
  }).then((state) => { // update discord bot status + playing string
    IsOnline = true;
    statusrefresh(); // STATUS UPDATED - ONLINE
    statusLoop(state);
    playersLists();
    //printLog('Player(s) connected: ' + state.raw.numplayers + ' / ' + state.maxplayers);

  }).catch((error) => { //--------------------------------------------------------OFFLINE---------------------
    // update discord bot status + playing string "Server Offline"
    statusrefresh(); // STATUS UPDATED - OFFLINE

    //status = 'Server Offline';
    client.user.setActivity('Server Offline', {type: 'WATCHING'});
    printLog("Server is offline", cRed);

  });
}

function statusrefresh() {
  try {
    if (IsOnline === true) {
      client.user.setStatus('online');
    } else {
      client.user.setStatus('dnd');
    }
  } catch (error) {
    console.error(error);
  }
}

function playersLists(){
  printLog('Player(s) connected: ' + serverInfo.raw.numplayers + ' / ' + serverInfo.maxplayers, cYellow);
  for (var i = 0; i < serverInfo.players.length; i++) {
      var counter = serverInfo.players[i];
      num = i + 1;
      //var timeH = counter.time.toHHMMSS();
      printLog(num + ' - ' + counter.name, cGreen);
  }
}

client.on('ready', () => {
  try {
    client.user.setStatus('idle');
    client.user.setActivity('JavaScript while starting...', {type: 'PLAYING'});
    printLog("Bot Starting...",cRed);
    console.log(serverInfo);
    printLog('Bot has started, with ' + client.users.size + ' users, in ' + client.channels.size + ' channels of ' + client.guilds.size + ' guilds.', cGreen);
    printLog('IP: ' + configIp + '  |  Type: ' + configType, cCyan);
    printLog('Server Name: ' + serverInfo.name, cBlue);
    //playersLists();
    client.setInterval(gamedigQuery, 30100);
  } catch (error) {
    console.error(error);
  }
});


client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
    //update();
  }

  const lowm = "ark";
  const capsm = "ARK";
  const capsmo = "Ark";

  try {

    if (message.content.includes(lowm) || message.content.includes(capsm) || message.content.includes(capsmo)) {
      message.react(client.emojis.get('319703910002589696')); //SuperDizorTestServer
      //message.react(client.emojis.get('508099744870957086')) // loungeServer
      //.then(reaction => printLog("Ark Emojis Added."));
    }
    //const ark = "!ark";
    if (message.content.includes("!ark")) {
      message.react(client.emojis.get('319703910002589696'));
      message.channel.send({
        "embed": {
          "title": "ARK Server Status",
          "color": 1234556,
          "footer": {
            "text": "Discord Bot created by SuperDizor"
          },
          "fields": [{
              "name": "Server Name",
              "value": serverInfo.name
            },
            {
                "name": "Player(s) Online",
                "value": serverInfo.raw.numplayers + ' / ' + serverInfo.maxplayers
              },
            {
              "name": "Host + Port",
              "value": serverInfo.query.host + ':' + serverInfo.query.port

            }
          ]
        }
      });
    }

  }
  catch(error) {console.error(error);}

});

client.login(settings.token);
