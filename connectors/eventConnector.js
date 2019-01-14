const db = require('mysql2');
const config = JSON.parse(require('fs').readFileSync('config/db.json'));

const connection = db.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: "DiscordStats",
    supportBigNumbers: true
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        process.exit();
    } else {
        console.log('Connected to db');
    }
})

module.exports = {
    insertMessage: function(id, author, channel, time, cb) {
        connection.query('INSERT INTO Messages VALUES(?, ?, ?, ?)', [id, time, author, channel], cb);
    },
    deleteMessage: function(id, author, channel, time, cb) {
        connection.query('INSERT INTO MessageLog VALUES(\'MessageDeleted\', ?, ?, ?, ?)', [id, channel, author, time], cb);
    },
    updateMessage: function(id, author, channel, time, cb) {
        connection.query('INSERT INTO MessageLog VALUES(\'MessageEdited\', ?, ?, ?, ?)', [id, channel, author, time], cb);
    },

    insertGuild: function(id, name, owner, cb) {
        connection.query('INSERT INTO Guilds VALUES(?, ?, ?)', [id, name, owner], cb);
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
        connection.query('UPDATE GuildUser SET name = ? WHERE guildId = ? AND userId = ?', [name, gid, uid], cb);
    },
    deleteGuildUser: function(gid, uid, cb) {
        connection.query('DELETE FROM GuildUser WHERE guildId = ? AND userId = ?', [gid, uid], cb);
    }
}