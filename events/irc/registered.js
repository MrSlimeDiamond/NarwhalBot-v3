const config = require('../../config.json')
const Logger = require('../../util/logger.js')
const logger = new Logger('irc')
module.exports = async function (ircclient) {
    try {
        ircclient.say(
            'NickServ',
            'IDENTIFY ' + config.irc.nick + ' ' + config.irc.nickserv_password
        )
        await new Promise(r => setTimeout(r, 2000)) // Wait a bit, give NickServ some time
        logger.info('Bot identified')
    } catch (error) {
        logger.warn('IRC Bot could not authenticate with NickServ')
    }
    logger.info('IRC bot is joining channels')
    for (const channel of config.irc.channels) {
        ircclient.join(channel)
    }
    logger.info('IRC bot ready!')
}
