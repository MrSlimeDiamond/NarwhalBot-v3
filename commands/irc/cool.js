const Discord = require('discord.js')
const config = require('../../config.json')
const IRCCommand = require('../../util/irc_command')

class CoolCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'cool'
        this.aliases = []
        this.description = 'Selimbits'
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        this.sendIRCMessage(
            to,
            'Selimbits is the coolest player!',
            this.isHidden(message)
        )
        const channel = discordclient.channels.cache.get(
            config.discord.ingame_chat_id
        )
        const embed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle('Coolest Player')
            .setDescription('Selimbits is the coolest player')
            .setThumbnail('https://mc-heads.net/avatar/Selimbits/64')
            .setTimestamp()
            .setFooter(config.discord.footer_text)

        this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
    }
}

module.exports = CoolCommand
