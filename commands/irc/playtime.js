const IRCCommand = require('../../util/irc_command')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const Discord = require('discord.js')
const config = require('../../config.json')

class PlaytimeCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'playtime'
        this.aliases = ['pt', 'tp', 'hours', 'timeplayed']
        this.description = "Get a user's playtime on MCO"
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        let user = this.getUser(message, from)

        let request = await fetch('https://zenoc.net/api/mco/player/' + user)
        let body = await request.json()
        if (body.error == 'Could not find player') {
            this.sendIRCMessage(
                to,
                'Could not find that player!',
                this.isHidden(message)
            )
            const embed = new Discord.MessageEmbed()
                .setColor('#a83232')
                .setTitle('Error')
                .setDescription('Could not find that player!')
                .setTimestamp()
                .setFooter(config.discord.footer_text)
            this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
            return
        } else if (body.error == 'Internal server error') {
            this.sendIRCMessage(
                to,
                "SlimeDiamond's API had an internal server error. Please contact him!",
                this.isHidden(message)
            )
            const embed = new Discord.MessageEmbed()
                .setColor('#a83232')
                .setTitle('Error')
                .setDescription(
                    'API had an error! Tell SlimeDiamond about this.'
                )
                .setTimestamp()
                .setFooter(config.discord.footer_text)
            this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
            return
        } else {
            const { playtime, username } = body
            if (playtime == 'NOTFOUND') {
                this.sendIRCMessage(
                    to,
                    `${username} has not got playtime! Try an updated username, maybe?`,
                    this.isHidden(message)
                )
                const embed = new Discord.MessageEmbed()
                    .setColor('#a83232')
                    .setTitle('Error')
                    .setDescription(
                        `${username} has not got playtime! Try an updated username, maybe?`
                    )
                    .setTimestamp()
                    .setFooter(config.discord.footer_text)
                this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
                return
            }
            const playtimeHours = parseInt(playtime) / 3600
            this.sendIRCMessage(
                to,
                `${username} has ${Math.round(
                    playtimeHours
                )} hours of playtime on MinecraftOnline`,
                this.isHidden(message)
            )
            const embed = new Discord.MessageEmbed()
                .setColor('#32a852')
                .setAuthor({
                    name: username,
                    iconURL: `https://mc-heads.net/avatar/${username}/64`,
                })
                .setDescription(
                    `${username} has ${Math.round(
                        playtimeHours
                    )} hours of playtime on MinecraftOnline`
                )
                .setTimestamp()
                .setFooter(config.discord.footer_text)
            this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
            return
        }
    }
}

module.exports = PlaytimeCommand
