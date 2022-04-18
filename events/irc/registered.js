const config = require('../../config.json')
const Logger = require('../../util/logger.js')
const logger = new Logger('irc')
module.exports = function (ircclient) {
    ircclient.say(
        'NickServ',
        'IDENTIFY ' + config.irc.nick + ' ' + config.irc.nickserv_password
    )
    logger.info('IRC bot ready!')
}
