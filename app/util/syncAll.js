const utilConnector = require('../connectors/utilConnector');
const eventConnector = require('../connectors/eventConnector');
const cb = require('../util/dbResponseHandler');

module.exports = function(client, callback) {
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
                utilConnector.getAllGuildUsers((err, res, fields) => {
                    if (err) {
                        console.log(err);
                    } else {
                        for (let r of res) { //r = guildUser
                            if (!client.guilds.has(r.guildId)) {
                                console.log(`Guild ${r} no longer exists, deleting its user`);
                                eventConnector.deleteGuildUser(r.guildId, r.user, cb);
                            } else {
                                let guild = client.guilds.get(r.guildId);
                                if (guild.members.has(r.user)) {
                                    if (guild.members.get(r.user).nickname !== r.nickname) {
                                        console.log(`User ${r.user} changed its nickname, updating`);
                                        eventConnector.updateGuildUser(r.guildId, r.user, guild.members.get(r.user).nickname, cb);
                                    }
                                } else {
                                    console.log(`User ${r.user} is no longer part of ${r.guildId}, deleting`);
                                    eventConnector.deleteGuildUser(r.guildId, r.user, cb);
                                }
                            }
                        }
                    }
            
                    for (let [key, value] of client.guilds) {
                        for (let [k, v] of value.members) {
                            let flag = false;
                            for (let r of res) {
                                if (r.guildId === key && r.user === k) {
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

                    callback(true);
                });
            });
        });
    });
};