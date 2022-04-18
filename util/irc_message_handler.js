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
            if (
                message.startsWith('#' + this.prefix) ||
                message.startsWith(this.prefix) ||
                (message.split(' ')[2].startsWith(this.prefix) &&
                    from == 'McObot')
            ) {
                let hidden = message.startsWith('#')

                let relayed = from == 'McObot'

                let args
                let msg

                if (hidden) {
                    args = message
                        .slice(this.prefix.length + 1)
                        .trim()
                        .split(/ +/)
                } else if (relayed) {
                    msg = message.split(' ').slice(2, 3).join(' ')
                    args = msg.slice(this.prefix.length).trim().split(/ +/)
                } else {
                    args = message.slice(this.prefix.length).trim().split(/ +/)
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
            // do nothing
        }
    }
}

module.exports = IRCCommandHandler
