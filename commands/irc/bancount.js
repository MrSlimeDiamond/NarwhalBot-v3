const IRCCommand = require('../../util/irc_command')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const Discord = require('discord.js')
const config = require('../../config.json')

class BancountCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'bancount'
        this.aliases = ['bc']
        this.description = "Show MinecraftOnline's ban count"
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        let bcReq = await fetch('https://zenoc.net/api/mco/bancount')
        let bcBody = await bcReq.json()

        this.sendIRCMessage(
            to,
            `MinecraftOnline has ${bcBody.bancount} bans.`,
            this.isHidden(message, from)
        )
        const embed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle(bcBody.bancount + ' bans')
            .setDescription(
                `MinecraftOnline currently has ${bcBody.bancount} bans`
            )
            .setTimestamp()
            .setFooter(config.discord.footer_text)
            .setThumbnail(
                'https://styles.redditmedia.com/t5_2u9w9/styles/communityIcon_lmy4utnihwp41.png'
            )

        this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
    }
}

module.exports = BancountCommand
