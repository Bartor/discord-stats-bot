const express = require('express');
const router = express.Router();
const connector = require('../../connectors/webConnector');

router.get('/:id/', (req, res) => {
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
                else topUsers[m.userName] = 1;
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