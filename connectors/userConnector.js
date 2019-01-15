const fs = require('fs');

const db = require('mysql2');
const config = JSON.parse(fs.readFileSync('config/db.json'));

module.exports = {
    connectAndQueryMessages: function(msg, query, cb) {
        fs.readFile('config/dbUsers.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let users = JSON.parse(data);
                for (let u of users) {
                    if (u.login === msg.guild.id) {
                        db.createConnection({
                            host: config.host,
                            port: config.port,
                            user: u.login,
                            password: u.password,
                            database: "DiscordStats"
                        }, (err, con) => {
                            if(err) {
                                console.log(err);
                            } else {
                                con.query(query, [], cb);
                            }
                        });
                    }
                }
            }
        });
    }
}