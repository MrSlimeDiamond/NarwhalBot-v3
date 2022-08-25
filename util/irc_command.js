const message = require('../events/irc/message.js')
const ircclient = require('../index.js')
const config = require('../config.json')
const Logger = require('../util/logger')
const logger = new Logger('irc')
class IRCCommand {
    constructor(irc) {
        this.irc = irc

        this.prefix = config.irc.prefix
    }

    getArgs(message, from) {
        let relayed = from == 'McObot'
        let distel = from == 'MCO_Discord' || from == 'MCO_Telegram'
        let args
        let msg
        if (distel) {
            // Discord/Telegram message (both have the same format)
            msg = message.split(' ').slice(1, 2).join(' ')
            if (this.isHidden(message)) {
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

        if (this.isHidden(message)) {
            args = message
                .slice(this.prefix.length + 1)
                .trim()
                .split(/ +/)
        } else if (relayed) {
            msg = message.split(' ').slice(2).join(' ')
            args = msg.slice(this.prefix.length).trim().split(/ +/)
        }

        args.shift()

        return args
    }

    sendIRCMessage(to, message, hidden) {
        if (hidden) {
            ircclient.say(to, '# ' + message)
        } else {
            ircclient.say(to, message)
        }
    }

    sendDiscordMessage(message, discordclient, to) {
        let chan
        if (to == '#narwhalbot') {
            chan = discordclient.channels.cache.get(
                config.discord.narwhalbot_chat_id
            )
        } else if (to == '#minecraftonline') {
            chan = discordclient.channels.cache.get(
                config.discord.ingame_chat_id
            )
        } else {
            return
        }

        chan.send(message)
    }

    isHidden(message) {
        return message.startsWith('#')
    }

    getUser(message, from) {
        let args = this.getArgs(message, from)
        if ((args.length == 1) & (from == 'MCO_Discord')) {
            return args[0]
        } else if (args.length == 0 && from == 'MCO_Discord') {
            return message.split('>')[0].replace('<', '')
        } else if (args.length == 0 && from != 'McObot') {
            return from
        } else if (args.length >= 1 && from != 'McObot') {
            return args[0]
        } else if (args.length == 0 && from == 'McObot') {
            return message.split(' ')[1].replace('<', '').replace('>', '')
        } else if (args.length >= 1 && from == 'McObot') {
            return args[0]
        }
    }
}

module.exports = IRCCommand
