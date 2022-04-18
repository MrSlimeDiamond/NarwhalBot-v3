const config = require('../config.json')
const Table = require('cli-table')
module.exports = function (ircclient, discordclient) {
    var table = new Table({
        head: ['Bot Name', 'Status', 'Bot Platform', 'Channels'],
        colWidths: [20, 20, 20, 40],
    })
    ircclient.whois(config.irc.nick, function (data) {
        let channelsColored = []
        for (let i = 0; config.irc.channels.length > i; i++) {
            channel = config.irc.channels[i]
            if (data.channels.includes(channel)) {
                console.log(channel)
                channelsColored.push('\u001b[32m' + channel.toString())
            } else {
                channelsColored.push('\u001b[31m' + channel.toString())
            }
        }
        table.push(
            [
                '\u001b[31m' + config.irc.nick,
                '\u001b[32mOnline',
                '\u001b[35mIRC',
                channelsColored.join(' '),
            ],
            [
                `\u001b[31m${discordclient.user.tag}`,
                `\u001b[32mOnline`,
                '\u001b[35mDiscord',
            ]
        )
        console.clear()
        console.log(table.toString())
    })
}
