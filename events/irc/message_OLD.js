const config = require('../../config.json')
const fs = require('fs')
module.exports = function (ircclient, discordclient, from, to, message) {
    if (
        message.startsWith(config.irc.prefix) ||
        message.startsWith('#' + config.irc.prefix) ||
        (message.startsWith('(MCS) <') && from == 'McObot')
    ) {
        args = message.split(' ')
        fs.readdir('./commands/irc', function (error, files) {
            if (error) {
                console.log(error)
                ircclient.say('An error occured!')
            } else {
                files.forEach(function (file) {
                    if (!file.endsWith('.js')) {
                        console.log(
                            `${file} does not end with .js! please remove it!`
                        )
                    } else
                        try {
                            if (
                                file.split('.js')[0] ==
                                    args[0].replace(config.irc.prefix, '') ||
                                file.split('.js')[0] ==
                                    args[0].replace(
                                        '#' + config.irc.prefix,
                                        ''
                                    ) ||
                                file.split('.js')[0] ==
                                    args[2].replace(config.irc.prefix, '')
                            ) {
                                const jsfile = require('../../commands/irc/' +
                                    file)
                                try {
                                    jsfile(
                                        ircclient,
                                        discordclient,
                                        from,
                                        to,
                                        message
                                    )
                                } catch (error) {
                                    ircclient.say('An error occured!')
                                    console.log(error)
                                    return
                                }
                            }
                        } catch (TypeError) {
                            return
                            // javascript is stupid
                        }
                })
            }
        })
    }
}
