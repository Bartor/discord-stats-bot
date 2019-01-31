const connector = require('../connectors/eventConnector');
const res = require('../util/dbResponseHandler');

module.exports = {
    register: function(client) {
        client.on('channelCreate', (channel) => {
            if (channel.type == 'text' || channel.type == 'voice')
            connector.insertChannel(channel.id, channel.name, channel.guild.id, channel.type, res);
        });

        client.on('channelDelete', (channel) => {
            if (channel.type == 'text' || channel.type == 'voice')
            connector.deleteChannel(channel.id, res);
        });

        client.on('channelUpdate', (channelOld, channelNew) => {
            if ((channelNew.type == 'text' || channelNew.type == 'voice') && channelOld.name != channelNew.name)
            connector.updateChannel(channelNew.id, channelNew.name, res);
        });
    }
}