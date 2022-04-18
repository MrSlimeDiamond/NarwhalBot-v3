const chalk = require('chalk')

class Logger {
    constructor(type) {
        this.type = type

        if (type == 'irc') {
            return new IRCLogger()
        } else if (type == 'discord') {
            return new DiscordLogger()
        } else if (type == 'general') {
            return new GeneralLogger()
        } else {
            return new Error('Invalid logger type')
        }
    }
}
class DiscordLogger {
    constructor(discord) {
        this.discord = discord
    }

    info(message) {
        console.log(chalk.blue(chalk.bold('Discord > INFO >'), message))
    }

    warn(message) {
        console.log(
            chalk.blue(
                chalk.bold('Discord >', chalk.yellow('WARN >')),
                chalk.yellow(message)
            )
        )
    }

    error(message) {
        console.log(
            chalk.blue(
                chalk.bold('Discord >', chalk.red('ERROR >')),
                chalk.red(message)
            )
        )
    }

    log(message) {
        console.log(chalk.blue(chalk.bold('DISCORD > LOG >'), message))
    }
}

class IRCLogger {
    constructor(irc) {
        this.irc = irc
    }

    info(message) {
        console.log(chalk.green(chalk.bold('IRC > INFO >'), message))
    }

    warn(message) {
        console.log(
            chalk.green(
                chalk.bold('IRC >', chalk.yellow('WARN >')),
                chalk.yellow(message)
            )
        )
    }

    error(message) {
        console.log(
            chalk.mega(
                chalk.bold('IRC >', chalk.red('ERROR >')),
                chalk.red(message)
            )
        )
    }

    log(message) {
        console.log(chalk.green(chalk.bold('IRC > LOG >'), message))
    }
}

class GeneralLogger {
    constructor(irc) {
        this.irc = irc
    }

    info(message) {
        console.log(chalk.magenta(chalk.bold('General > INFO >'), message))
    }

    warn(message) {
        console.log(
            chalk.magenta(
                chalk.bold('General >', chalk.yellow('WARN >')),
                chalk.yellow(message)
            )
        )
    }

    error(message) {
        console.log(
            chalk.magenta(
                chalk.bold('General >', chalk.red('ERROR >')),
                chalk.red(message)
            )
        )
    }

    log(message) {
        console.log(chalk.magenta(chalk.bold('GENERAL > LOG >'), message))
    }
}

module.exports = Logger
