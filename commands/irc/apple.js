const IRCCommand = require('../../util/irc_command')
const config = require('../../config.json')
const Discord = require('discord.js')

class AppleCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'apple'
        this.aliases = []
        this.description = 'apple'
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        this.sendIRCMessage(
            to,
            'The one and only Senator of MCO',
            this.isHidden(message, from)
        )
        const channel = discordclient.channels.cache.get(
            config.discord.ingame_chat_id
        )
        const embed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle('SenatorApple :apple:')
            .setDescription('The one and only Senator of MCO')
            .setThumbnail('https://mc-heads.net/avatar/SenatorApple/64')
            .setTimestamp()
            .setFooter(config.discord.footer_text)

        this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
    }
}

module.exports = AppleCommand
