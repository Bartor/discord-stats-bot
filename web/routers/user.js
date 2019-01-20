const express = require('express');
const router = express.Router();
const connector = require('../../connectors/webConnector');

router.get('/', (req, res) => {
    connector.getAllUsers((err, rows, fields) => {
        if (err) {
            console.error(err);
            res.status(500).render('errors/500');
            return;
        }

        res.render('userList', {
            data: rows
        });
    });
});

router.get('/:id/', (req, res) => {
    connector.getUserOnGuilds(req.params.id, (err, rows, fields) => {
        if (err) {
            console.error(err);
            res.status(500).render('errors/500');
            return;
        }

        if (rows.length === 0) {
            res.status(404).render('errors/404');
            return;
        }

        res.render('user', {
            id: rows[0].id,
            userName: rows[0].userName,
            userTag: rows[0].userTag,
            guilds: rows.map(e => ({id: e.guildId, name: e.name, nickname: e.nickname || '-'}))
        });
    });
});

module.exports = router;