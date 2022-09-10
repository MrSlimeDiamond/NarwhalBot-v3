const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const timeDelta = require('time-delta')
const Discord = require('discord.js')
const config = require('../../config.json')
const IRCCommand = require('../../util/irc_command')
const di = timeDelta.create({
    locale: 'en', // default
})

class LastseenCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'lastseen'
        this.aliases = ['ls', 'lastjoin']
        this.description = "Get a player's last join date"
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        let user = this.getUser(message, from)

        let request = await fetch('https://zenoc.net/api/mco/player/' + user)
        let body = await request.json()
        if (body.error == 'Could not find player') {
            this.sendIRCMessage(
                to,
                'Could not find that player!',
                this.isHidden(message, from)
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
                this.isHidden(message, from)
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
            const { lastseen, username } = body
            if (lastseen == 'NOTFOUND') {
                this.sendIRCMessage(
                    to,
                    `${username} has not got lastseen! Try an updated username, maybe?`,
                    this.isHidden(message, from)
                )
                const embed = new Discord.MessageEmbed()
                    .setColor('#a83232')
                    .setTitle('Error')
                    .setDescription(
                        `${username} has not got lastseen! Try an updated username, maybe?`
                    )
                    .setTimestamp()
                    .setFooter(config.discord.footer_text)
                this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
                return
            }
            const date = new Date(parseInt(lastseen) * 1000)
            const now = new Date()
            this.sendIRCMessage(
                to,
                `${username} last logged in at ${date.toUTCString()} (${di.format(
                    date,
                    now
                )} ago)`,
                this.isHidden(message, from)
            )
            const embed = new Discord.MessageEmbed()
                .setColor('#32a852')
                .setAuthor({
                    name: username,
                    iconURL: `https://mc-heads.net/avatar/${username}/64`,
                })
                .setDescription(
                    `${username} last logged in at ${date.toUTCString()} (${di.format(
                        date,
                        now
                    )} ago)`
                )
                .setTimestamp()
                .setFooter(config.discord.footer_text)
            this.sendDiscordMessage({ embeds: [embed] }, discordclient, to)
            return
        }
    }
}

module.exports = LastseenCommand
