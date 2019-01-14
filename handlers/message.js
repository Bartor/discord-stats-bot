const connector = require('../connectors/eventConnector');
const res = require('../util/dbResponseHandler');

module.exports = {
    register: function(client) {
        client.on('message', (msg) => {
            if (msg.channel.type == 'text'){
                connector.insertMessage(msg.id, msg.author.id, msg.channel.id, new Date(msg.createdAt), res);
                require('../messageInterpreter').interpret(msg);
            }
        });
        
        client.on('messageDelete', (msg) => {
            if (msg.channel.type == 'text')
            connector.deleteMessage(msg.id, msg.author.id, msg.channel.id, new Date(msg.createdAt), res);
        });
        
        client.on('messageUpdate', (msgOld, msgNew) => {
            if (msgNew.channel.type == 'text')
            connector.updateMessage(msgNew.id, msgNew.author.id, msgNew.channel.id, new Date(msgNew.createdAt), res);
        });
    }
}