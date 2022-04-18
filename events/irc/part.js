const config = require('../../config.json')
const Logger = require('../../util/logger')
const logger = new Logger('irc')
const fs = require('fs')
const moment = require('moment')
async function onPart(ircclient, discordclient, channel, nick, message) {
    let ds = '[' + moment().format('HH:mm:ss') + '] '
    if (nick == config.irc.nick) {
        logger.info('Bot has left ' + channel)
    }
    if (channel == '#minecraftonline') {
        fs.appendFile(
            './minecraftonline.txt',
            ds + nick + ' has left ' + channel + ` (${message})` + '\n',
            function (error) {
                if (error) logger.error(error)
            }
        )
    }
}

module.exports = onPart
