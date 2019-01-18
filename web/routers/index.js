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

router.get('/advanced/', (req, res) => {
    connector.getSchema((err, schema, fields) => {
        res.render('advanced', {
            tables: schema.map(e => e.TABLE_NAME).filter((el, i) => schema.map(ele => ele.TABLE_NAME).indexOf(el) === i),
            schema: JSON.stringify(schema)
        });
    })
});

module.exports = router;