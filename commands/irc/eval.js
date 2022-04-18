const IRCCommand = require('../../util/irc_command')

class EvalCommand extends IRCCommand {
    constructor(irc) {
        super(irc)

        this.name = 'eval'
        this.aliases = ['e']
        this.description = 'Execute code on the bot'
    }

    onCommand(ircclient, discordclient, from, to, message) {
        let args = this.getArgs(message, from)
        let a = this
        let evalled
        ircclient.whois(from, function (data) {
            if (
                (data.nick == 'SlimeDiamond' &&
                    data.host == 'basher.zenoc.net') ||
                (data.nick == 'SlimeDiamond' &&
                    data.host == 'netadmin.example.org')
            ) {
                const codeToEval = args.join(' ')
                try {
                    evalled = eval(codeToEval)
                    a.sendIRCMessage(to, evalled, a.isHidden(message))
                } catch (error) {
                    console.log(error)
                    a.sendIRCMessage(to, error.message, a.isHidden(message))
                }
            } else {
                a.sendIRCMessage(to, 'You do not have permission to use this!')
                return
            }
        })
    }
}

module.exports = EvalCommand
