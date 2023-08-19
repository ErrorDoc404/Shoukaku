const MusicBot = require('./backend/class/MusicBot');

const client = new MusicBot();

client.warn(`Making Things Necessary`);

client.build();

module.exports = client;