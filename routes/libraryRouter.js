const express = require('express');
const router = express.Router();
const libraryService = require('../lib/service/libraryService');

// library JPA
router.post('/JPA', (req, res) => {  
    console.log('/library/JPA');
    libraryService.updateLibraryJPA(req, res);
});

// 도서관 대출, 소장 여부 롸우톼
router.get('/loanAvailable', (req, res) => {  
    console.log('/library/loanAvailable');
    libraryService.getLoanAvailable(req, res);
});

module.exports = router;