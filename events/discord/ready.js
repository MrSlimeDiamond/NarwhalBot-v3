let channel

const clc = require('cli-color')
const config = require('../../config.json')
const Table = require('cli-table')
const update_cli = require('../../util/update_cli')
const Logger = require('../../util/logger')
const logger = new Logger('discord')
function botReady(ready, ircclient, discordclient) {
    // channel = discordclient.channels.cache.get("804227000406376490")
    logger.info('Discord bot ready!')
    //   update_cli(ircclient, discordclient);
}

module.exports = botReady
