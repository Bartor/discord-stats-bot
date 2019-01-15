const fs = require('fs');

const db = require('mysql2');
const config = JSON.parse(fs.readFileSync('config/db.json'));

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
        console.log('Connected to db');
    }
});

module.exports = {
    insertMessage: function(id, author, channel, time, cb) {
        connection.query('INSERT INTO Messages VALUES(?, ?, ?, ?)', [id, time, author, channel], cb);
    },
    deleteMessage: function(id, cb) {
        connection.query('DELETE FROM Messages WHERE id = ?', [id], cb);
    },
    updateMessage: function(id, author, channel, time, cb) {
        connection.query('INSERT INTO MessageLog VALUES(\'MessageEdited\', ?, ?, ?, ?)', [id, channel, author, time], cb);
    },

    insertGuild: function(id, name, owner, cb) {
        connection.query('INSERT INTO Guilds VALUES(?, ?, ?)', [id, name, owner], cb);
        let pass = Math.floor(Math.random()*10e18).toString();
        fs.readFile('config/dbUsers.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let users = JSON.parse(data);
                users.push({login: id, password: pass});
                fs.writeFile('config/dbUsers.json', JSON.stringify(users), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
        connection.query(`CREATE VIEW ${'v'+id} AS SELECT 
        M.id AS messageId,
        M.author AS messageAuthor,
        M.time AS messageTime,
        M.channel AS messageChannel,
        C.id AS channelId,
        C.name AS channelName,
        C.guildId AS channelGuild,
        C.type AS channelType,
        G.id AS guildId,
        G.name AS guildName,
        G.ownerId AS guildOwner,
        U.id AS userId,
        U.userName AS userUserName,
        U.userTag AS userUserTag,
        GU.nickname AS nickname
        FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildId = G.id JOIN Users U ON U.id = M.author JOIN GuildUser GU ON U.id = GU.user WHERE G.id = ?`, [id], cb);
        connection.query('CREATE USER ?@localhost IDENTIFIED WITH mysql_native_password BY ?', [id, pass], cb);
        connection.query(`GRANT SELECT ON DiscordStats.${'v'+id} TO ?@'localhost'`, [id], cb);
    },
    updateGuild: function(id, name, cb) {
        connection.query('UPDATE Guilds SET name = ? WHERE id = ?', [name, id], cb);
    },
    deleteGuild: function(id, cb) {
        connection.query('DELETE FROM Guilds WHERE id = ?', [id], cb);
    },

    insertChannel: function(id, name, guild, type, cb) {
        connection.query('INSERT INTO Channels VALUES(?, ?, ?, ?)', [id, name, guild, type], cb);
    },
    updateChannel: function(id, name, cb) {
        connection.query('UPDATE Channels SET name = ? WHERE id = ?', [name, id], cb);
    },
    deleteChannel: function(id, cb) {
        connection.query('DELETE FROM Channels WHERE id = ?', [id], cb);
    },

    insertUser: function(id, name, tag, cb) {
        connection.query('INSERT INTO Users VALUES(?, ?, ?)', [id, name, tag], cb);
    },
    updateUser: function(id, name, tag, cb) {
        connection.query('UPDATE Users SET userName = ?, userTag = ? WHERE id = ?', [name, tag, id], cb);
    },
    deleteUser: function(id, cb) {
        connection.query('DELETE FROM Users WHERE id = ?', [id], cb);
    },

    insertGuildUser: function(gid, uid, name, cb) {
        connection.query('INSERT INTO GuildUser VALUES(?, ?, ?)', [gid, uid, name], cb);
    },
    updateGuildUser: function(gid, uid, name, cb) {
        connection.query('UPDATE GuildUser SET nickname = ? WHERE guildId = ? AND user = ?', [name, gid, uid], cb);
    },
    deleteGuildUser: function(gid, uid, cb) {
        connection.query('DELETE FROM GuildUser WHERE guildId = ? AND user = ?', [gid, uid], cb);
    }
}