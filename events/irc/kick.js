const config = require('../../config.json')
const Table = require('cli-table')
const update_cli = require('../../util/update_cli')
const Logger = require('../../util/logger')
const logger = new Logger('irc')
const fs = require('fs')
const moment = require('moment')
function onKick(ircclient, discordclient, channel, nick, by, reason, message) {
    let ds = '[' + moment().format('HH:mm:ss') + '] '
    if (nick == config.irc.nick) {
        // update_cli(ircclient, discordclient);
        logger.warn('Bot was kicked from channel ' + channel + ': ' + reason)
    }

    if (channel == '#minecraftonline') {
        fs.appendFile(
            './minecraftonline.txt',
            ds +
                nick +
                ' was kicked from ' +
                channel +
                ` (${reason}) (${by})` +
                '\n',
            function (error) {
                if (error) logger.error(error)
            }
        )
    }
}

module.exports = onKick
