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

router.get('/g/:id', (req, res) => {
    connector.getAllChannels(req.params.id, (err, channels, fields) => {
        if (err) {
            console.log(err); 
            res.render('guild', {data: []});
        } else {
            connector.getMessFromWeek(req.params.id, (err, days, fields) => {
                if (err) {
                    console.log(err);
                    res.render('guild', {data: []});
                } else {
                    let weekStats = [];
                    for (let i = 0; i < 7; i++) {
                        let dUp = new Date();
                        let dDown = new Date();
                        dUp.setHours(23,59,59,999);
                        dDown.setHours(23,59,59,999);
                        dUp = dUp.setDate(dUp.getDate() - i);
                        dDown = dDown.setDate(dDown.getDate() - i - 1);
                        weekStats.push([
                            d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear(),
                            days.filter(e => (e.time > dDown && e.time < d.dUp)).lenght
                        ]);
                    }
                    res.render('guild', {data: channels, stats: weekStats, max: Math.max(...weekStats.map(e => e[1]))});
                }
            });
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