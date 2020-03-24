const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {send_message};

function send_message(area) {
    client.login('NjkxNzY3OTE0NDYxNzkwMzI5.Xnk9tw.Kt_ui2uTUYSG05A66dD03HrlQnw');
    client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
        const channel = client.channels.cache.get('691339902436114528');
        channel.send('Hello world!');
    });
}