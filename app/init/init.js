let fs = require('fs');
let readline = require('readline');
let { exec } = require('child_process');

let discord = require('discord.js');

function main() {
    console.log('Welcome to the initial configurator. Please provide the bot with some information to start. All the configuration will be stored in a config directory as a JSON files, so don\'t let anyone access it, as it may contain sensitive data.');

    const config = {};
    
    const readStream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    readStream.question('Discord bot token: ', (a1) => {
        new discord.Client().login(a1).then(s => {
            let key = a1;
            readStream.question('MySQL host (leave blank for localhost): ', (a2) => {
                config.host = a2 || 'localhost';
                readStream.question('MySQL port (leave blank for 3306): ', (a3) => {
                    config.port = a3 || 3306;
                    readStream.question('MySQL root (won\'t be stored) (leave blank for root): ', (a4) => {
                        let root = a4 || 'root';
                        readStream.question('MySQL root pswd (won\'t be stored): ', (a5) => {
                            let rootpswd = a5;
                            readStream.question('Bot user pswd (for manual debug): ', (a6) => {
                                config.password = a6;
    
                                if (!fs.existsSync('../config')) fs.mkdirSync('../config');
    
                                fs.writeFileSync('sql.sql', fs.readFileSync('sqlinit.sql', 'utf8').replace("???", config.password));

                                exec(`mysql --host=${config.host} --port=${config.port} --user=${root} --password=${rootpswd} < ${__dirname.replace(/\\/g, '\\\\') + '\\\\' + 'sql.sql'}`, (err, stdout, stderr) => {
                                    if (err) {
                                        console.log(err);
                                        process.exit();
                                    } else {
                                        console.log(stdout);
                                        console.log(stderr);

                                        config.user = 'DiscordStatsBot';
                                        config.webuser = 'DiscordStatsWeb';

                                        fs.writeFileSync('../config/db.json', JSON.stringify(config));
                                        fs.writeFileSync('../config/discord.json', JSON.stringify({token: key}));

                                        console.log('Configuration files saved to ../config');
                                        console.log('Exiting, please run main to start the bot next time');
                                        process.exit();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }).catch(e => {
            console.log('Token cannot be verified. Please start the config again.');
            process.exit();
        });
    })
}

main();