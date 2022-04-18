const Logger = require('../../util/logger')
const logger = new Logger('irc')
const fs = require('fs')
const moment = require('moment')
const config = require('../../config.json')
module.exports = function (ircclient, discordclient, to, message) {
    let ds = '[' + moment().format('HH:mm:ss') + '] '
    let from = config.irc.nick
    if (to == '#minecraftonline') {
        fs.appendFile(
            './minecraftonline.txt',
            ds + `<${from}> ${message}\n`,
            function (error) {
                if (error) logger.errror(error)
            }
        )
    }
}
