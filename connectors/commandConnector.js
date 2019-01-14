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
    getMessageCount: function(guildId, channelIds, authorIds, from, to, cb) {
        let channelState = Array.isArray(channelIds);
        let authorState = Array.isArray(authorIds);
        let authorString = 'AND';
        let channelString = 'AND';

        if (authorState) {
            for (let i of authorIds.keys()) {
                if (i != authorIds.length -1) {
                    authorString.concat(' author = ? OR');
                } else {
                    authorString.concat(' author = ?');
                }
            }
        } else {
            authorIds = [];
        }

        if (channelState) {
            for (let i of channelIds.keys()) {
                if (i != channelIds.length -1) {
                    channelString.concat(' channel = ?  OR');
                } else {
                    channelString.concat(' channel = ?');
                }
            }
        } else {
            channelIds = [];
        }

        connection.query(`SELECT COUNT(*) AS 'Count', name AS 'Channel' FROM Messages M JOIN Channels C ON M.channel = C.id WHERE time > ? AND time < ? ${authorState ? authorString : ''} ${channelState ? channelString : ''} GROUP BY channel ORDER BY COUNT(*) DESC`, [from, to, ...authorIds, ...channelIds], cb);
    }
};