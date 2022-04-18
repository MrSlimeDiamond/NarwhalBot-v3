const config = require('../../config.json')
const Logger = require('../../util/logger')
const logger = new Logger('irc')
const fs = require('fs')
const moment = require('moment')
async function onQuit(
    ircclient,
    discordclient,
    nick,
    reason,
    channels,
    message
) {
    let ds = '[' + moment().format('HH:mm:ss') + '] '
    if (channels.includes('#minecraftonline')) {
        fs.appendFile(
            './minecraftonline.txt',
            ds + nick + ' has quit' + ` (${reason})` + '\n',
            function (error) {
                if (error) logger.error(error)
            }
        )
    }
}

module.exports = onQuit
