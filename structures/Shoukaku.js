const Logger = require("./Logger");
const logger = new Logger();

class MusicBot {


    log(Text) {
        logger.log(Text);
    }

    warn(Text) {
        logger.warn(Text);
    }

    error(Text) {
        logger.error(Text);
    }

}

module.exports = MusicBot;