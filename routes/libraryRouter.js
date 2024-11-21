const express = require('express');
const router = express.Router();
const libraryService = require('../lib/service/libraryService');

// library
router.post('/', (req, res) => {  
    console.log('/library');
    libraryService.updateLibrary(req, res);
});

module.exports = router;