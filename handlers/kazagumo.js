const fs = require('fs');

module.exports = (client) => {
    fs.readdir('./node/', async (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const node = require(`../node/${file}`);
            let nodeName = file.split('.')[0];
            client.kazagumo.shoukaku.on(nodeName, node.run.bind(null, client));
            client.log(`Loaded nodes '${nodeName}'`);
        });
    });
}