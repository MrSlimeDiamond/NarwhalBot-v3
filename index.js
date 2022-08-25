const irc = require('irc')
const fs = require('fs')
const readline = require('readline')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('./config.json')
const ircMessageEventHandler = require('./events/irc/message.js')
const discordReadyEventHandler = require('./events/discord/ready.js')
const discordMessageEventHandler = require('./events/discord/message.js')
const ircDisconnectHandler = require('./events/irc/disconnect.js')
const ircKickHandler = require('./events/irc/kick.js')
const ircJoinHandler = require('./events/irc/join.js')
const ircPartHandler = require('./events/irc/part.js')
const ircQuitHandler = require('./events/irc/quit')
const ircRegisteredJoinHandler = require('./events/irc/registered.js')
const ircSelfMessageHandler = require('./events/irc/selfMessage')
const Logger = require('./util/logger.js')
const irclog = new Logger('irc')
const dislog = new Logger('discord')
const genlog = new Logger('general')
const { stdin: input, stdout: output } = require('process')
// const rl = readline.createInterface({ input, output });
const ircclient = new irc.Client(config.irc.server, config.irc.nick, {
    // channels: config.irc.channels,
    realName: config.irc.realName,
    userName: config.irc.username,
})

const discordclient = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
})

genlog.info('Starting bot')

readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) process.stdin.setRawMode(true)

ircclient.addListener('message', function (from, to, message) {
    ircMessageEventHandler(ircclient, discordclient, from, to, message)
})

ircclient.addListener('selfMessage', function (to, message) {
    ircSelfMessageHandler(ircclient, discordclient, to, message)
})

ircclient.addListener('disconnect', function (reason) {
    ircDisconnectHandler(ircclient, discordclient, reason)
})

ircclient.addListener('kick', function (channel, nick, by, reason, message) {
    ircKickHandler(ircclient, discordclient, channel, nick, by, reason, message)
})

ircclient.addListener('join', function (channel, nick, message) {
    ircJoinHandler(ircclient, discordclient, channel, nick, message)
})

ircclient.addListener('part', function (channel, nick, message) {
    ircPartHandler(ircclient, discordclient, channel, nick, message)
})

ircclient.addListener('quit', function (nick, reason, channels, message) {
    ircQuitHandler(ircclient, discordclient, nick, reason, channels, message)
})

ircclient.addListener('registered', function () {
    ircRegisteredJoinHandler(ircclient)
    for (const channel of config.irc.channels) {
        ircclient.join(channel)
    }
})

discordclient.on('ready', function (ready) {
    discordReadyEventHandler(ready, ircclient, discordclient)
})

discordclient.on('messageCreate', function (message) {
    discordMessageEventHandler(ircclient, discordclient, message)
})

discordclient.login(config.discord.token)

process.stdin.on('keypress', (chunk, key) => {
    if (key && key.name == 'q') {
        genlog.info('Stopping bots...')
        ircclient.disconnect('Stopping...')
        discordclient.destroy()
        process.exit()
    }
})

process.once('SIGINT', function () {
    genlog.info('Caught SIGINT, stopping bots...')
    ircclient.disconnect('Caught SIGINT')
    discordclient.destroy()
    process.exit()
})

process.once('SIGTERM', function () {
    genlog.info('Caught SIGTERM, stopping bots...')
    ircclient.disconnect('Caught SIGTERM')
    genlog.warn('Bot caught sigterm (???)')
    discordclient.destroy()
    process.exit()
})

setInterval(function () {
    let now = moment().format('HH:mm:ss')
    if (now == '00:00:00') {
        let date = new Date()
        fs.appendFile(
            './minecraftonline.txt',
            `--- DAY CHANGED ${date.toUTCString()} ---\n`,
            function (error) {
                if (error) genlog.error(error)
            }
        )
    }
}, 1000)
;(module.exports = ircclient), discordclient
