const express = require('express');
const router = express.Router();
const libraryService = require('../lib/service/libraryService');

// library JPA
router.post('/JPA', (req, res) => {  
    console.log('/library');
    libraryService.updateLibraryJPA(req, res);
});

module.exports = router;