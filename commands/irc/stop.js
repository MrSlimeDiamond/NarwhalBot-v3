const IRCCommand = require('../../util/irc_command.js')
const Discord = require('discord.js')
const config = require('../../config.json')
const Logger = require('../../util/logger')
const genlog = new Logger('general')

class Ping extends IRCCommand {
    constructor(irc) {
        super(irc)
        this.name = 'stop'
        this.aliases = []
        this.description = 'Stop the bot'
    }

    onCommand(ircclient, discordclient, from, to, message) {
        let args = this.getArgs(message, from)
        let a = this
        ircclient.whois(from, function (data) {
            if (
                (data.nick == 'SlimeDiamond' &&
                    data.host == 'basher.zenoc.net') ||
                (data.nick == 'SlimeDiamond' &&
                    data.host == 'netadmin.example.org')
            ) {
                a.sendIRCMessage(to, 'Stopping bots...')
                genlog.info('Stopping bots...')
                ircclient.disconnect(
                    args.join(' ').length == 0 ? 'Stopping...' : args.join(' ')
                )
                discordclient.destroy()
                process.exit()
            } else {
                a.sendIRCMessage(to, 'You do not have permission to use this!')
                return
            }
        })
    }
}

module.exports = Ping
