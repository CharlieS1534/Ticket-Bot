const { Client } = require('discord.js');
const bot = new Client();
var userTickets = new Map();

bot.login("NzIwMTIwNjI5ODEwMTY3OTMw.XuBW9Q.NCu0J6z7QgL9df2PwbaXiq5eM7s");

bot.on('ready', () => {
    console.log('Logged in!');
})

bot.on('message', message => {
    if (message.author.bot) {
        if (message.embeds.length === 1 && message.embeds[0].description.startsWith('React')) {
            message.react(':ticketreact:625925895013662721')
                .then(msgReaction => console.log('Reacted.'))
                .catch(err => console.log(err));
        }
        if (message.embeds.length === 1 && message.embeds[0].title === 'Ticket Support') {
            message.react(':checkreact:625938016510410772')
                .then(reaction => console.log("Reacted with " + reaction.emoji.name))
                .catch(err => console.log(err));
        }
    };
    if (message.content.toLowerCase() === '?createticket' && message.channel.id === '720124620627378277') {
        message.reply("Hey");


        if (userTickets.has(message.author.id) ||
            message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.author.send("You already have a ticket!");
        } else {
            let guild = message.guild;
            guild.createChannel(`${message.author.username}s-ticket`, {
                type: 'text',
                permissionOverwrites: [{
                        allow: 'VIEW_CHANNEL',
                        id: message.author.id
                    },
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: 'VIEW_CHANNEL',
                        id: '6711786424281858070'
                    }
                ]
            }).then(ch => {
                userTickets.set(message.author.id, ch.id);
            }).catch(err => console.log(err));
        }
    } else if (message.content.toLowerCase() === '?closeticket') {
        if (userTickets.has(message.author.id)) {
            if (message.channel.id === userTickets.get(message.author.id)) {
                message.channel.delete('closing ticket')
                    .then(channel => {
                        console.log("Deleted " + channel.name);
                        userTickets.delete(message.author.id);
                    })
                    .catch(err => console.log(err));
            }
        }

        if (message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.guild.channels.forEach(channel => {
                if (channel.name.toLowerCase() === message.author.username + 's-ticket') {
                    channel.delete().then(ch => console.log('Deleted Channel ' + ch.id))
                        .catch(err => console.log(err));
                }
            });
        }
    }
});