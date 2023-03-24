const ircclient = require('../index.js')
const config = require('../config.json')
const Discord = require('discord.js')
const Logger = require('../util/logger')
const logger = new Logger('irc')
const fs = require('fs')

class IRCCommandHandler {
    constructor(irc) {
        this.irc = irc
        this.prefix = config.irc.prefix

        this.commands = new Discord.Collection()

        let commandFiles = fs
            .readdirSync('./commands/irc/')
            .filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            const commd = new (require('../commands/irc/' + file))(irc)
            this.commands.set(commd.name, commd)
        }
    }

    handle(ircclient, discordclient, from, to, message) {
        try {
            // Catch relayed messages
            if (
                message.startsWith('#' + this.prefix) ||
                message.startsWith(this.prefix) ||
                (message.split('> ')[1].startsWith(this.prefix) &&
                    from == 'MCO_Discord') ||
                (message.split('> ')[1].startsWith('#' + this.prefix) &&
                    from == 'MCO_Discord') ||
                (message.split('> ')[1].startsWith(this.prefix) &&
                    from == 'MCO_Telegram') ||
                (message.split('> ')[1].startsWith('#' + this.prefix) &&
                    from == 'MCO_Telegram') ||
                (message.split(' ')[2].startsWith(this.prefix) &&
                    from == 'McObot') ||
                (message.split(' ')[2].startsWith(this.prefix) &&
                    from == 'Silly') ||
                (message.split(' ')[2].startsWith('#' + this.prefix) &&
                    from == 'Silly')
            ) {
                let relayed = from == 'McObot'
                let distel = from == 'MCO_Discord' || from == 'MCO_Telegram'
                let newDiscord = from == 'Silly'
                let hidden =
                    message.startsWith('#') ||
                    (distel && message.split(' ')[1].startsWith('#')) ||
                    (newDiscord && message.split(' ')[2].startsWith('#'))

                let args
                let msg

                if (hidden) {
                    args = message
                        .slice(this.prefix.length + 1)
                        .trim()
                        .split(/ +/)
                } else if (distel) {
                    // Discord/Telegram message (both have the same format)
                    msg = message.split(' ').slice(1, 2).join(' ')
                    if (hidden) {
                        args = message
                            .split('> ')[1]
                            .slice(this.prefix.length + 1)
                            .trim()
                            .split(/ +/)
                    } else {
                        args = message
                            .split('> ')[1]
                            .slice(this.prefix.length)
                            .trim()
                            .split(/ +/)
                    }
                } else {
                    args = message.slice(this.prefix.length).trim().split(/ +/)
                }

                if (relayed) {
                    // msg = message.split(' ').slice(2, 3).join(' ')
                    msg = message.split('> ')[1]
                    args = msg.slice(this.prefix.length).trim().split(/ +/)
                }
                if (newDiscord) {
                    msg = message.split('> ')[1]
                    args = msg.slice(this.prefix.length).trim().split(/ +/)
                    if (hidden) {
                        args = message
                            .split('> ')[1]
                            .slice(this.prefix.length + 1)
                            .trim()
                            .split(/ +/)
                    } else {
                        args = message
                            .split('> ')[1]
                            .slice(this.prefix.length)
                            .trim()
                            .split(/ +/)
                    }
                }
                let commandName = args.shift().toLowerCase()

                let command =
                    this.commands.get(commandName) ||
                    this.commands.find(
                        cmd => cmd.aliases && cmd.aliases.includes(commandName)
                    )

                if (!command) {
                    return false
                }

                function getCommandSender() {
                    let a = message.split(' ')
                    let sender
                    if (a.length >= 3 && from == 'McObot') {
                        sender = a[1].replace('<', '').replace('>', '')
                    } else if (from == 'MCO_Discord') {
                        var b = message.split('>')
                        sender = b[0].replace('<', '')
                    } else if (a.length >= 3 && from == 'Silly') {
                        sender = a[1].replace('<', '').replace('>', '')
                    } else {
                        sender = from
                    }
                    return sender
                }

                logger.log(`[COMMAND]: ${getCommandSender()}: ${commandName}`)
                command.onCommand(ircclient, discordclient, from, to, message)
                return true
            } else {
                return false
            }
        } catch (error) {
            // really cursed workaround to console spam that shouldn't even happen in the first place
            if (error == "TypeError: Cannot read properties of undefined (reading 'startsWith')") return
            if (error == "TypeError: Cannot read property 'startsWith' of undefined") return
            console.error(error)
        }
    }
}

module.exports = IRCCommandHandler
