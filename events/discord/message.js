const config = require('../../config.json')
const fs = require('fs')
const ircMessageEventHandler = require('../../util/irc_message_handler.js')
const c = require('irc-colors')
module.exports = function (ircclient, discordclient, message) {
    if (message.author.id == '802747951369551973') return
    if (message.channel.id == '804227000406376490') {
        ircclient.say(
            '#narwhalbot',
            c.bold(`<${message.author.tag}> `) + message.content
        )
        if (message.content.startsWith(config.irc.prefix)) {
            let from = message.author.username
            let to = '#narwhalbot'
            let handler = new ircMessageEventHandler(this)
            handler.handle(ircclient, discordclient, from, to, message.content)
        }
    }
    let voting = true
    if (
        message.channel.id == '619518988237537310' &&
        message.attachments.size > 0 &&
        voting == true
    ) {
        message.react('🔼')
        message.react('🔽')
        message.react('❤️')
    }

    if (
        message.content.startsWith(config.discord.prefix) ||
        message.content.startsWith('#' + config.discord.prefix)
    ) {
        args = message.content.split(' ')
        fs.readdir('./commands/discord', function (error, files) {
            if (error) {
                console.log(error)
                message.channel.send('An error occured')
            } else {
                files.forEach(function (file) {
                    if (!file.endsWith('.js')) {
                        console.log(
                            `${file} does not end with .js! please remove it!`
                        )
                    } else if (
                        file.split('.js')[0] ==
                            args[0].replace(config.discord.prefix, '') ||
                        file.split('.js')[0] ==
                            args[0].replace('#' + config.discord.prefix, '')
                    ) {
                        const jsfile = require('../../commands/discord/' + file)
                        try {
                            jsfile(ircclient, discordclient, message)
                        } catch (error) {
                            message.channel.send('An error occured')
                            console.log(error)
                            return
                        }
                    }
                })
            }
        })
    }
}
