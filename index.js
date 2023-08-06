const MusicBot = require('./library/MusicBot');

const client = new MusicBot();

client.warn(`Making Things Necessary`);

client.build();

module.exports = client;