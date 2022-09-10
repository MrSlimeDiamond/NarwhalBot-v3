const IRCCommand = require('../../util/irc_command.js')
const Discord = require('discord.js')
const config = require('../../config.json')

class Ping extends IRCCommand {
    constructor(irc) {
        super(irc)
        this.name = 'ping'
        this.aliases = []
        this.description = 'Simple ping pong'
    }

    onCommand(ircclient, discordclient, from, to, message) {
        console.log(this.isHidden(message, from))
        this.sendIRCMessage(to, 'Pong!', this.isHidden(message, from))
        const embed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle('Pong!')
            .setTimestamp()
            .setFooter(config.discord.footer_text)

        this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
    }
}

module.exports = Ping
