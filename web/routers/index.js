const express = require('express');
const router = express.Router();
const connector = require('../../connectors/webConnector');

router.get('/', (req, res) => {
    connector.getAllGuilds((err, rows, fields) => {
        if (err) {
            console.error(err);
            res.status(500).render('errors/500');
            return;
        }

        if (rows.length === 0) {
            res.status(404).render('errors/404');
            return;
        }

        res.render('index', {
            data: rows
        });
    });
});

router.get('/g/:id/', (req, res) => {
    connector.getAllChannels(req.params.id, (err, channels, fields) => {
        if (err) {
            console.error(err);
            res.status(500).render('errors/500');
            return;
        }

        if (channels.length === 0) {
            res.status(404).render('errors/404');
            return;
        }

        connector.getMessFromWeek(req.params.id, (err, days, fields) => {
            if (err) {
                console.error(err);
                res.status(500).render('errors/500');
                return;
            }

            let weekStats = [];
            for (let i = 0; i < 7; i++) {
                let dUp = new Date();
                let dDown = new Date();
                dUp.setHours(23, 59, 59, 999);
                dDown.setHours(23, 59, 59, 999);
                dUp.setDate(dUp.getDate() - i);
                dDown.setDate(dDown.getDate() - i - 1);
                weekStats.push([
                    dUp.getDate() + "-" + (dUp.getMonth() + 1) + "-" + dUp.getFullYear(),
                    days.filter(e => (e.time > dDown && e.time < dUp)).length,
                    dUp.getTime()
                ]);
            }

            res.render('guild', {
                data: channels,
                stats: weekStats,
                max: Math.max(...weekStats.map(e => e[1]))
            });
        });
    });
});

router.get('/g/:id/day/:time/', (req, res) => {
    let d = new Date(new Number(req.params.time).valueOf());
    connector.getMessFromDay(req.params.id, d, (err, rows, fields) => {
        if (err) {
            console.error(err);
            res.status(500).render('errors/500');
            return;
        }

        if (rows.length === 0) {
            res.status(404).render('errors/404');
            return;
        }

        let hourStats = [];
        for (let i = 0; i < 24; i++) {
            hourStats.push([
                i + ":00 - " + (i + 1) + ":00",
                rows.filter(e => new Date(e.time).getHours() === i).length
            ]);
        }

        let topUsers = {};
        for (let m of rows) {
            if (topUsers[m.userName] !== undefined) topUsers[m.userName]++;
            else topUsers[m.userName] = 0;
        }
        topUsers = Object.entries(topUsers).sort((a, b) => b[1] - a[1]);

        res.render('guildDay', {
            day: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
            guildId: req.params.id,
            guild: rows[0].guildName,
            stats: hourStats,
            users: topUsers,
            maxStat: Math.max(...topUsers.map(e => e[1])),
            maxUser: Math.max(...hourStats.map(e => e[1]))
        });
    });
});

router.get('/c/:id/', (req, res) => {
    connector.getMessFromChannel(req.params.id, (err, messages, fields) => {
        if (err) {
            console.error(err);
            res.status(500).render('errors/500');
            return;
        }
        connector.getChannelLogs(req.params.id, (err, logs, fields) => {
            if (err) {
                console.error(err);
                res.status(500).render('errors/500');
                return;
            }

            let topUsers = {};
            for (let m of messages) {
                if (topUsers[m.userName] !== undefined) topUsers[m.userName]++;
                else topUsers[m.userName] = 0;
            }
            topUsers = Object.entries(topUsers).sort((a, b) => b[1] - a[1]);

            let guildName, channelName, guildId;

            if (topUsers.length === 0) {
                connector.getChannelGuildInfo(req.params.id, (err, info, fields) => {
                    if (err) {
                        console.error(err);
                        res.status(500).render('errors/500');
                        return;
                    }

                    if (info.length === 0) {
                        res.status(404).render('errors/404');
                        return;
                    }

                    guildName = info[0].guildName;
                    channelName = info[0].channelName;
                    guildId = info[0].guildId;

                    res.render('channel', {
                        users: topUsers,
                        max: Math.max(...topUsers.map(e => e[1])),
                        guildId: guildId,
                        guildName: guildName,
                        channelName: channelName,
                        messCount: messages.length,
                        delCount: logs.filter(e => e.event === 'MessageDeleted').length,
                        ediCount: logs.filter(e => e.event === 'MessageEdited').length
                    });
                });
            } else {
                guildName = messages[0].guildName;
                channelName = messages[0].channelName;
                guildId = messages[0].guildId;


                res.render('channel', {
                    users: topUsers,
                    max: Math.max(...topUsers.map(e => e[1])),
                    guildId: guildId,
                    guildName: guildName,
                    channelName: channelName,
                    messCount: messages.length,
                    delCount: logs.filter(e => e.event === 'MessageDeleted').length,
                    ediCount: logs.filter(e => e.event === 'MessageEdited').length
                });
            }
        });
    });
});

module.exports = router;