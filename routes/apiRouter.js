const express = require('express');
const router = express.Router();
const apiService = require('../lib/service/apiService');
const logger = require('../lib/config/logger');

// api
router.get('/region/:region', (req, res) => {  
    logger.info('/api/library/region');
    apiService.region(req, res);
});

router.get('/name/:name', (req, res) => {  
    logger.info('/api/library/name');
    apiService.name(req, res);
});

module.exports = router;