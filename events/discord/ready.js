let channel

const clc = require('cli-color')
const config = require('../../config.json')
const Table = require('cli-table')
const Logger = require('../../util/logger')
const logger = new Logger('discord')
function botReady(ready, ircclient, discordclient) {
    // channel = discordclient.channels.cache.get("804227000406376490")

    discordclient.user.setActivity('narwhalbot kinda vibin', {
        type: 'PLAYING',
    })
    logger.info('Set Discord bot status')

    logger.info('Discord bot ready!')
    //   update_cli(ircclient, discordclient);
}

module.exports = botReady
