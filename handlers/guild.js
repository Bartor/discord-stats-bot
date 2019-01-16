const connector = require('../connectors/eventConnector');
const res = require('../util/dbResponseHandler');

module.exports = {
    register: function(client) {
        client.on('guildCreate', (guild) => {
            connector.insertGuild(guild.id, guild.name, guild.owner.id, res);
            console.log('Syncing data...');

            require('../util/syncAll')(client, (r) => {
                r ? console.log('Synced') : console.log('Sync error!');
            });
        });

        client.on('guildDelete', (guild) => {
            connector.deleteGuild(guild.id, res);
        });

        client.on('guildUpdate', (guildOld, guildNew) => {
            if (guildOld.name != guildNew.name)
            connector.updateGuild(guildNew.id, guildNew.name, res);
        });
    }
}