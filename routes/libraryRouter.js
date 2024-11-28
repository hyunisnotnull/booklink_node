const express = require('express');
const router = express.Router();
const libraryService = require('../lib/service/libraryService');

// library JPA
router.post('/JPA', (req, res) => {  
    console.log('/library');
    libraryService.updateLibraryJPA(req, res);
});

// 이름으로 도서관 검색
router.get('/search_library_name', (req, res) => {  
    console.log('/library/search_library_name');
    libraryService.search_library_name(req, res);
});

module.exports = router;