const config = require('../../config.json')
const Table = require('cli-table')
const update_cli = require('../../util/update_cli.js')
const Logger = require('../../util/logger')
const logger = new Logger('irc')
const fs = require('fs')
const moment = require('moment')
async function onJoin(ircclient, discordclient, channel, nick, message) {
    let ds = '[' + moment().format('HH:mm:ss') + '] '
    if (nick == config.irc.nick) {
        logger.info('Bot has joined ' + channel)
    }
    if (channel == '#minecraftonline') {
        fs.appendFile(
            './minecraftonline.txt',
            ds + nick + ' has joined ' + channel + '\n',
            function (error) {
                if (error) logger.error(error)
            }
        )
    }
}

module.exports = onJoin
