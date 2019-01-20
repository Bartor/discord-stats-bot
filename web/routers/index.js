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

module.exports = router;