const express = require('express');
const router = express.Router();
const connector = require('../../connectors/webConnector');

router.get('/', (req, res) => {
    connector.getAllGuilds((err, rows, fields) => {
        if (err) {
            console.log(err);
            res.render('index', {status: false, text: "", data: []});
        } else {
            res.render('index', {status: true, text: "Tracked guilds:", data: rows});
        }
    });
});

router.get('/g/:id', (req, res) => {
    connector.getAllChannels(req.params.id, (err, rows, fields) => {
        if (err) {
            console.log(err); 
            res.render('guild', {status: false, text: "", data: []});
        } else {
            res.render('guild', {status: true, text: "Channels:", data: rows});
        }
    });
});

router.get('/c/:id', (req, res) => {
    connector.getAllDelsCount(req.params.id, (err, rows, fields) => {
        if (err) {
            console.log(err); 
            res.render('channel', {status: false, text: "", data: []});
        } else {
            let data = rows.map(e => ({name: "Deletions", count: e.Count}));
            connector.getAllEditsCount(req.params.id, (err, rows, fields) => {
                if (err) {
                    console.log(err); 
                    res.render('channel', {status: false, text: "", data: []});
                } else {
                    data = data.concat(rows.map(e => ({name: "Edits", count: e.Count})));
                    connector.getAllMessCount(req.params.id, (err, rows, fields) => {
                        if (err) {
                            console.log(err); 
                            res.render('channel', {status: false, text: "", data: []});
                        } else {
                            data = data.concat(rows.map(e => ({name: "Messages", count: e.Count})));
                            res.render('channel', {status: true, text: "Channel information:", data: data});
                        }        
                    });
                }        
            });
        }
    })
})

module.exports = router;