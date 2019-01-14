const utilConnector = require('../connectors/utilConnector');
const eventConnector = require('../connectors/eventConnector');
const cb = require('../util/dbResponseHandler');

module.exports = function(client) {
    utilConnector.getAllChannels((err, res, fields) => {
        if (err) {
            console.log(err);
        } else {
            for (let r of res) {
                if (!client.channels.has(r.id)) {
                    console.log(`Channel ${r.id} no longer exists, deleting`);
                    eventConnector.deleteChannel(r.id, cb);
                    res.splice(res.indexOf(r), 1);
                }
            }

            for (let [key, value] of client.channels) {
                if (value.type === 'text' || value.type === 'voice') {
                    if (!res.map(e => e.id).includes(key)) {
                        console.log(`New channel ${key}, inserting`);
                        eventConnector.insertChannel(value.id, value.name, value.guild.id, value.type, cb);
                    } else {
                        for (let r of res) {
                            if (r.id === key && r.name !== client.channels.get(r.id).name) {
                                console.log(`Channel ${r.id} changed its name from ${r.name} to ${client.channels.get(r.id).name}, updating`);
                                eventConnector.updateChannel(r.id, client.channels.get(r.id).name, cb);
                            }
                        }
                    }
                }
            }
        }
    });
    utilConnector.getAllGuilds((err, res, fields) => {
        if (err) {
            console.log(err);
        } else {
            for (let r of res) {
                if (!client.guilds.has(r.id)) {
                    console.log(`Guild ${r.id} no longer exists, deleting`);
                    eventConnector.deleteGuild(r.id, cb);
                    res.splice(res.indexOf(r), 1);
                }
            }

            for (let [key, value] of client.guilds) {
                if (!res.map(e => e.id).includes(key)) {
                    console.log(`New guild ${key}, inserting`);
                    eventConnector.insertGuild(key, value.name, value.owner.id, cb);
                } else {
                    for (let r of res) {
                        if (r.id === key && r.name !== client.guilds.get(r.id).name) {
                            console.log(`Guild ${r.id} changed its name from ${r.name} to ${client.guilds.get(r.id).name}, updating`);
                            eventConnector.updateGuild(r.id, client.guilds.get(r.id).name, cb);
                        }
                    }
                }
            }
        }
    });
    utilConnector.getAllUsers((err, res, fields) => {
        if (err) {
            console.log(err);
        } else {
            for (let r of res) {
                if (!client.users.has(r.id)) {
                    console.log(`User ${r.id} no longer exists, deleting`);
                    eventConnector.deleteUser(r.id, cb);
                    res.splice(res.indexOf(r), 1);
                }
            }

            console.log(client.users.array().map(e => e.id));

            for (let [key, value] of client.users) {
                if (!res.map(e => e.id).includes(key)) {
                    console.log(`New user ${key}, inserting`);
                    eventConnector.insertUser(key, value.username, value.discriminator, cb);
                } else {
                    for (let r of res) {
                        if (r.id === key && (r.userName !== client.users.get(r.id).username || r.userTag !== client.users.get(r.id).discriminator)) {
                            console.log(`User ${r.id} changed its name or tag, updating`);
                            eventConnector.updateUser(r.id, client.users.get(r.id).username, client.users.get(r.id).discriminator, cb);
                        }
                    }
                }
            }
        }
    });
    utilConnector.getAllGuildUsers((err, res, fields) => {
        if (err) {
            console.log(err);
        } else {
            for (let r of res) { //r = {guildId:, userId:, nickname:}
                if (!client.guilds.has(r.guildId)) { //client.guilds = Map(guildId, guild)
                    console.log(`Guild ${r.guildId} no longer exists, deleting its users`);
                    eventConnector.deleteGuildUser(r.guildId, r.userId, cb);
                    res.splice(res.indexOf(r), 1);
                } else {
                    for (let [key, value] of client.guilds.get(r.guildId).members) { //key = clientId, value = client
                        let users = res.filter(e => e.guildId === r.guildId).map(e => e.userId);
                        console.log(users);
                        if (!(res.filter(e => e.guildId === r.guildId).map(e => e.userId).includes(key))) {
                            console.log(`User ${key} is no longer a part of ${r.guildId}, deleting`);
                            eventConnector.deleteGuildUser(r.guildId, key, cb);
                        } else if (value.nickname !== res.filter(e => e.userId === key && e.guildId === r.guildId)[0].nickname) {
                            console.log(`User ${key} nickname changed, updating`);
                            eventConnector.updateGuildUser(r.guildId, key, value.nickname, cb);
                        }
                    }
                }
            }
        }

        for (let [key, value] of client.guilds) {
            for (let [k, v] of value.members) {
                let flag = false;
                for (let r of res) {
                    if (r.guildId === key && r.userId === k) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    console.log(`User ${k} joined the guild ${key}, inserting`);
                    eventConnector.insertGuildUser(key, k, v.nickname, cb);
                }
            }
        }
    });
};