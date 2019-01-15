module.exports = {
    parseUser: function(user, guild) {
        let discriminator, username, nickname = user, id;

        if (user.indexOf('#') !== -1) {
            username = user.split('#')[0];
            discriminator = user.split("#")[1];
        } 
        if (typeof new Number(user).valueOf() === 'number') {
            id = new Number(user);
        }
        
        for (let [mid, member] of guild.members) {
            if (mid == id || member.displayName.toLowerCase() === nickname || (member.client.user.discriminator === discriminator && member.client.user.username.toLowerCase() === username)) {
                return member;
            }
        }
        throw 'Unknown user';
    },
    parseChannel: function(channel, guild) {
        let name, id;
        if (typeof new Number(channel) === 'number') {
            id = new Number(channel).valueOf();
        } else {
            name = channel;
        }

        for (let [cid, channel] of guild.channels) {
            if (cid === id || channel.name === name) {
                return channel;
            }
        }
        throw 'Uknown channel';
    }
}