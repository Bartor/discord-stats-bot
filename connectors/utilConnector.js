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
});

module.exports = {
    getAllChannels: function(cb) {
        connection.query('SELECT * FROM Channels', cb);
    },
    getAllUsers: function(cb) {
        connection.query('SELECT * FROM Users', cb);
    },
    getAllGuildUsers: function(cb) {
        connection.query('SELECT * FROM GuildUser', cb);
    },
    getAllGuilds: function(cb) {
        connection.query('SELECT * FROM Guilds', cb);
    }
}