module.exports.run = (client, name, code, reason) => {
    client.logger.error(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`);
};