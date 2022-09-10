const IRCCommand = require('../../util/irc_command')
const Discord = require('discord.js')
const config = require('../../config.json')

class KingCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'king'
        this.aliases = []
        this.description = 'I am demetri'
    }

    onCommand(ircclient, discordclient, from, to, message) {
        this.sendIRCMessage(
            to,
            'TheDemetri is the king of MinecraftOnline!',
            this.isHidden(message, from)
        )
        const embed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle('The King of MCO')
            .setDescription('TheDemetri is the king of MinecraftOnline')
            .setThumbnail('https://mc-heads.net/avatar/TheDemetri/64')
            .setFooter(config.discord.footer_text)

        this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
    }
}

module.exports = KingCommand
