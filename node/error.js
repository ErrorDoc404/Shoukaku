module.exports.run = (client, name, error) => {
    client.logger.error(`Lavalink ${name}: Error Caught: ${error}`);
};