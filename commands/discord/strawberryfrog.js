const fs = require('fs')
function strawberryfrogCommand(ircclient, discordclient, message) {
    try {
        message.reply({ files: ['./media/strawberryfrog.png'] })
    } catch (error) {
        message.reply('An error occured! (may be lack of permissions)')
    }
}

module.exports = strawberryfrogCommand
