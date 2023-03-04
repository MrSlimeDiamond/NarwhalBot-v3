const IRCCommandHandler = require('../../util/irc_message_handler.js')
const Logger = require('../../util/logger')
const logger = new Logger('irc')
const fs = require('fs')
const moment = require('moment')
const config = require('../../config.json')
const { channel } = require('diagnostics_channel')
module.exports = function (ircclient, discordclient, from, to, message) {
    let ds = '[' + moment().format('HH:mm:ss') + '] '
    if (to == '#narwhalbot') {
        const channel = discordclient.channels.cache.get('804227000406376490')
        channel.send(`**<${from}>** ${message}`)
    }
    if (to == '#minecraftonline') {
        fs.appendFile(
            './minecraftonline.txt',
            ds + `<${from}> ${message}\n`,
            function (error) {
                if (error) logger.errror(error)
            }
        )
    }

    if (
        message.startsWith('!king') ||
        message.startsWith('!apple') ||
        message.startsWith('!cool') ||
        message.startsWith('!bancount') ||
        message.startsWith('!bc') ||
        message.startsWith('!bansuntil') ||
        message.startsWith('!ls') ||
        message.startsWith('!fs') ||
        message.startsWith('!tp')
    ) {
        ircclient.say(
            to,
            `This command has been moved to +${message.slice(
                '!'.length
            )} for consistency`
        )
        let channel
        if (to == '#minecraftonline') {
            channel = discordclient.channels.cache.get(
                config.discord.ingame_chat_id
            )
        } else if (to == '#narwhalbot') {
            channel = discordclient.channels.cache.get(
                config.discord.narwhalbot_chat_id
            )
        }
        channel.send(
            `This command has been moved to +${message.slice(
                '!'.length
            )} for consistency`
        )
    }
    const handler = new IRCCommandHandler(this)
    try {
        handler.handle(ircclient, discordclient, from, to, message)
    } catch (error) {
        channel.send("There was an error executing this command!")
        console.error(error)
    }
    
}
