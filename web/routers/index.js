const express = require('express');
const router = express.Router();
const connector = require('../../connectors/webConnector');

router.get('/', (req, res) => {
    connector.getAllGuilds((err, rows, fields) => {
        if (err) {
            console.log(err);
            res.render('index', {data: []});
        } else {
            res.render('index', {data: rows});
        }
    });
});

router.get('/g/:id/', (req, res) => {
    connector.getAllChannels(req.params.id, (err, channels, fields) => {
        if (err) {
            console.log(err); 
            res.sendStatus(500);
        } else {
            connector.getMessFromWeek(req.params.id, (err, days, fields) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    let weekStats = [];
                    for (let i = 0; i < 7; i++) {
                        let dUp = new Date();
                        let dDown = new Date();
                        dUp.setHours(23,59,59,999);
                        dDown.setHours(23,59,59,999);
                        dUp.setDate(dUp.getDate() - i);
                        dDown.setDate(dDown.getDate() - i - 1);
                        weekStats.push([
                            dUp.getDate() + "-" + (dUp.getMonth()+1) + "-" + dUp.getFullYear(),
                            days.filter(e => (e.time > dDown && e.time < dUp)).length,
                            dUp.getTime()
                        ]);
                    }
                    res.render('guild', {data: channels, stats: weekStats, max: Math.max(...weekStats.map(e => e[1]))});
                }
            });
        }
    });
});

router.get('/g/:id/day/:time/', (req, res) => {
    let d = new Date(new Number(req.params.time).valueOf());
    connector.getMessFromDay(req.params.id, d, (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            let hourStats = [];
            for (let i = 0; i < 24; i++) {
                hourStats.push([
                    i + ":00 - " + (i+1) + ":00",
                    rows.filter(e => new Date(e.time).getHours() === i).length
                ]);
            }
            let topUsers = {};
            for (let m of rows) {
                if (topUsers[m.userName] !== undefined) topUsers[m.userName]++;
                else topUsers[m.userName] = 0;
            }
            topUsers = Object.entries(topUsers).sort((a, b) => b[1] - a[1]);
            res.render('guildDay', {day: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,guildId: req.params.id, guild: rows[0].guildName, stats: hourStats, users: topUsers, maxStat: Math.max(...topUsers.map(e => e[1])), maxUser: Math.max(...hourStats.map(e => e[1]))});
        }
    });
});

router.get('/c/:id/', (req, res) => {

});

module.exports = router;