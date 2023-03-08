const IRCCommand = require('../../util/irc_command')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const Discord = require('discord.js')
const config = require('../../config.json')
const api = require("../../util/api")

class RandomplayerCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'randomplayer'
        this.aliases = ['rp']
        this.description = 'Get a random online player'
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        const result = await api("playerlist")

        if (result == null) {
            this.sendIRCMessage(
                `Nobody is on MinecraftOnline right now!`,
                this.isHidden(message, from)
            )
            const embed = new Discord.MessageEmbed()
                .setColor('#32a852')
                .setTitle('Random Player')
                .setDescription('Nobody is on MinecraftOnline right now!')
            this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
            return
        }

        const r = Math.round(Math.random(0, Object.entries(result).length))
        let userIGN = result[Object.keys(result)[r]].name

        this.sendIRCMessage(
            to,
            `Random player on MCO: ${userIGN}`,
            this.isHidden(message, from)
        )
        const embed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle('Random player')
            .setDescription(`Random player on MCO: ${userIGN}`)
            .setThumbnail(`https://mc-heads.net/avatar/${userIGN}/64`)
        this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
        return
    }
}

module.exports = RandomplayerCommand
