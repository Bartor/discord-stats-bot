const express = require('express');
const router = express.Router();
const connector = require('../../connectors/webConnector');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/advanced/', (req, res) => {
    connector.getSchema((err, schema, fields) => {
        res.render('advanced', {
            tables: schema.map(e => e.TABLE_NAME).filter((el, i) => schema.map(ele => ele.TABLE_NAME).indexOf(el) === i),
            schema: JSON.stringify(schema)
        });
    })
});

router.post('/query/', (req, res) => {
    connector.customQuery(req.body.query, (err, rows, fields) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        res.json({rows: rows, fields: fields});
    })
});

module.exports = router;