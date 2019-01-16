const db = require('mysql2');
const config = JSON.parse(require('fs').readFileSync('config/db.json'));

const connection = db.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: "DiscordStats"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        process.exit();
    } else {
        console.log('commandConnector connected to db');
    }
});

module.exports = {
    getMessageCount: function(guildId, channelIds, authorIds, from, to, group, cb) {
        let channelState = Array.isArray(channelIds);
        let authorState = Array.isArray(authorIds);
        let authorString = 'AND';
        let channelString = 'AND';

        if (authorState) {
            for (let i of authorIds.keys()) {
                if (i != authorIds.length -1) {
                    authorString += ' author = ? OR';
                } else {
                    authorString += ' author = ?';
                }
            }
        } else {
            authorIds = [];
        }

        if (channelState) {
            for (let i of channelIds.keys()) {
                if (i != channelIds.length -1) {
                    channelString += ' channel = ?  OR';
                } else {
                    channelString += ' channel = ?';
                }
            }
        } else {
            channelIds = [];
        }


        switch(group) {
            case 'channel': {
                connection.query(`SELECT COUNT(*) AS 'Count', name AS 'Channel' FROM Messages M JOIN Channels C ON M.channel = C.id WHERE guildId = ? AND time > ? AND time < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY channel ORDER BY COUNT(*) DESC`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
            case 'author': {
                connection.query(`SELECT COUNT(*) AS 'Count', userName AS 'User', userTag AS 'Tag' FROM Messages M JOIN Users U ON M.author = U.id JOIN Channels C ON M.channel = C.id WHERE guildId = ? AND time > ? AND time < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY author ORDER BY COUNT(*) DESC`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
            default: {
                connection.query(`SELECT COUNT(*) AS 'Count' FROM Messages M JOIN Channels C ON M.channel = C.id WHERE guildId = ? AND time > ? AND time < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''}`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
        }

    },

    getEditsCount: function(guildId, channelIds, authorIds, from, to, group, cb) {
        let channelState = Array.isArray(channelIds);
        let authorState = Array.isArray(authorIds);
        let authorString = 'AND';
        let channelString = 'AND';

        if (authorState) {
            for (let i of authorIds.keys()) {
                if (i != authorIds.length -1) {
                    authorString += ' user = ? OR';
                } else {
                    authorString += ' user = ?';
                }
            }
        } else {
            authorIds = [];
        }

        if (channelState) {
            for (let i of channelIds.keys()) {
                if (i != channelIds.length -1) {
                    channelString += ' channel = ?  OR';
                } else {
                    channelString += ' channel = ?';
                }
            }
        } else {
            channelIds = [];
        }


        switch(group) {
            case 'channel': {
                connection.query(`SELECT COUNT(*) AS 'Edits', name AS 'Channel' FROM MessageLog M JOIN Channels C ON M.channel = C.id WHERE guildId = ? AND event = 'MessageEdited' AND time > ? AND TIME < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY channel ORDER BY COUNT(*) DESC`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
            case 'author': {
                connection.query(`SELECT COUNT(*) AS 'Edits', username AS 'User' FROM MessageLog M JOIN Channels C ON M.channel = C.id JOIN Users U ON M.user = U.id WHERE guildId = ? AND event = 'MessageEdited' AND time > ? AND TIME < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY user ORDER BY COUNT(*) DESC`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
            default: {
                connection.query(`SELECT COUNT(*) AS 'Edits' FROM MessageLog M JOIN Channels C ON M.channel = C.id JOIN Users U ON M.user = U.id WHERE guildId = ? AND event = 'MessageEdited' AND time > ? AND TIME < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''}`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
        }
    },

    getDeletionsCount: function(guildId, channelIds, authorIds, from, to, group, cb) {
        let channelState = Array.isArray(channelIds);
        let authorState = Array.isArray(authorIds);
        let authorString = 'AND';
        let channelString = 'AND';

        if (authorState) {
            for (let i of authorIds.keys()) {
                if (i != authorIds.length -1) {
                    authorString += ' user = ? OR';
                } else {
                    authorString += ' user = ?';
                }
            }
        } else {
            authorIds = [];
        }

        if (channelState) {
            for (let i of channelIds.keys()) {
                if (i != channelIds.length -1) {
                    channelString += ' channel = ?  OR';
                } else {
                    channelString += ' channel = ?';
                }
            }
        } else {
            channelIds = [];
        }


        switch(group) {
            case 'channel': {
                connection.query(`SELECT COUNT(*) AS 'Deletions', name AS 'Channel' FROM MessageLog M JOIN Channels C ON M.channel = C.id WHERE guildId = ? AND event = 'MessageDeleted' AND time > ? AND TIME < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY channel ORDER BY COUNT(*) DESC`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
            case 'author': {
                connection.query(`SELECT COUNT(*) AS 'Deletions', username AS 'User' FROM MessageLog M JOIN Channels C ON M.channel = C.id JOIN Users U ON M.user = U.id WHERE guildId = ? AND event = 'MessageDeleted' AND time > ? AND TIME < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY user ORDER BY COUNT(*) DESC`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
            default: {
                connection.query(`SELECT COUNT(*) AS 'Deletions' FROM MessageLog M JOIN Channels C ON M.channel = C.id JOIN Users U ON M.user = U.id WHERE guildId = ? AND event = 'MessageDeleted' AND time > ? AND TIME < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''}`, [guildId, from, to, ...authorIds, ...channelIds], cb);
                break;
            }
        }
    },

    getUserHistory: function(guildId, user, cb) {
        connection.query('SELECT event, G.nickname, userName, time FROM GuildUserLog G LEFT JOIN Users U ON G.user = U.id LEFT JOIN GuildUser GU ON G.user = GU.user WHERE G.guildId = ? AND G.user = ?', [guildId, user], cb);
    },

    getChannelHistory: function(guildId, channelId, cb) {
        connection.query('SELECT event, name, time FROM ChannelLog WHERE guildId = ? AND channelId = ?', [guildId, channelId], cb);
    },

    getGuildHistory: function(guildId, cb) {
        connection.query('SELECT event, name, time FROM GuildLog WHERE guildId = ?', [guildId], cb);
    }
};