const connector = require('../connectors/eventConnector');
const res = require('../util/dbResponseHandler');

module.exports = {
    register: function(client) {
        client.on('guildMemberAdd', (member) => {
            console.log('xD');
            connector.insertUser(member.id, member.client.user.username, member.client.user.discriminator, res);
            connector.insertGuildUser(member.guild.id, member.id, member.nickname, res);
        });

        client.on('guildMemberRemove', (member) => {
            connector.deleteGuildUser(member.guild.id, member.id, res);
        });

        client.on('guildMemberUpdate', (memberOld, memberNew) => {
            if (memberOld.nickname != memberNew.nickname)
            connector.updateGuildUser(memberNew.guild.id, memberNew.id, memberNew.nickname, res);
        });
    }
}