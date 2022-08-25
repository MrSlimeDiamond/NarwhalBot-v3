const IRCCommand = require('../../util/irc_command.js')
const Discord = require('discord.js')
const config = require('../../config.json')
const Logger = require('../../util/logger')
const genlog = new Logger('general')
const admins = require("../../admins.json")

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
            for (var admin in admins) {
                if (admin == from) {
                    for (var i in admins[from].hosts) {
                        if (admins[from].hosts[i] == data.host) {
                            stopBots()
                            return
                        }
                    }
                }
            }
            nope()
            function stopBots() {
                a.sendIRCMessage(to, 'Stopping bots...')
                genlog.info('Stopping bots...')
                ircclient.disconnect(
                    args.join(' ').length == 0 ? 'Stopping...' : args.join(' ')
                )
                discordclient.destroy()
                process.exit()
            } 
            
            function nope() {
                a.sendIRCMessage(to, 'You do not have permission to use this!')
                return
            }
        })
    }
}

module.exports = Ping
