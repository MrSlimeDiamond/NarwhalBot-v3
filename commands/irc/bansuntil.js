const IRCCommand = require('../../util/irc_command')
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const Discord = require('discord.js')
const config = require('../../config.json')
const api = require("../../util/api")

class BansuntilCommand extends IRCCommand {
    constructor(irc) {
        super(irc)
        this.name = 'bansuntil'
        this.aliases = ['bu']
        this.description = 'Calculate the bans until a certian number'
    }

    async onCommand(ircclient, discordclient, from, to, message) {
        let response = await api("bancount")
        let { bancount } = response

        if (!bancount) {
            this.sendIRCMessage(to, 'An error occured!')
            const embed = new Discord.MessageEmbed()
                .setColor('#a83232')
                .setTitle('Bansuntil - Error')
                .setDescription('An error occured!')
                .setFooter(config.discord.footer_text)

            this.sendDiscordMessage({ embeds: [embed] }, discordclient)
            return
        } else {
            let args = this.getArgs(message, from)
            if (args.length == 0) {
                this.sendIRCMessage(to, 'Usage: !bansuntil <number>')
                const embed = new Discord.MessageEmbed()
                    .setColor('#a83232')
                    .setTitle('Incorrect usage')
                    .setDescription('Usage: `!bansuntil <number>`')
                    .setFooter(config.discord.footer_text)

                this.sendDiscordMessage({ embeds: [embed] }, discordclient)
                return
            } else {
                let bansuntil = parseInt(args[0])
                let bansuntilnum = bansuntil - parseInt(bancount)
                if (bansuntilnum == NaN || bansuntilnum == 'NaN') {
                    this.sendIRCMessage(
                        to,
                        'Usage: !bansuntil <number> (you put something other than a number)'
                    )
                    const embed = new Discord.MessageEmbed()
                        .setColor('#a83232')
                        .setTitle('Incorrect usage')
                        .setDescription(
                            'Usage: `!bansuntil <number>` (you put something other than a number) '
                        )
                        .setFooter(config.discord.footer_text)

                    this.sendDiscordMessage({ embeds: [embed] }, discordclient)
                    return
                } else {
                    if (parseInt(bancount) > bansuntil) {
                        this.sendIRCMessage(to, 'Already past that number!')
                        const embed = new Discord.MessageEmbed()
                            .setColor('#a83232')
                            .setTitle(
                                'MinecraftOnline already has that many bans!'
                            )
                            .setFooter(config.discord.footer_text)

                        this.sendDiscordMessage(
                            { embeds: [embed] },
                            discordclient,
                            to
                        )
                    } else {
                        this.sendIRCMessage(
                            to,
                            `There are ${bansuntilnum} bans left until ${bansuntil} bans (currently ${bancount} bans)`
                        )
                        const embed = new Discord.MessageEmbed()
                            .setColor('#32a852')
                            .setTitle('Bancount')
                            .setDescription(
                                `There are ${bansuntilnum} bans left until ${bansuntil} bans (currently ${bancount} bans)`
                            )
                            .setFooter(config.discord.footer_text)

                        this.sendDiscordMessage(
                            { embeds: [embed] },
                            discordclient,
                            to
                        )
                        return
                    }
                }
            }
        }
    }
}

module.exports = BansuntilCommand
