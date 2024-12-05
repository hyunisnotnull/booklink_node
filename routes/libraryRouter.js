const express = require('express');
const router = express.Router();
const libraryService = require('../lib/service/libraryService');

// library JPA
router.post('/JPA', (req, res) => {  
    console.log('/library/JPA');
    libraryService.updateLibraryJPA(req, res);
});

// 이름으로 도서관 검색
router.get('/search_library_name', (req, res) => {  
    console.log('/library/search_library_name');
    libraryService.search_library_name(req, res);
});

// 도서관 대출, 소장 여부 롸우톼
router.get('/loanAvailable', (req, res) => {  
    console.log('/library/loanAvailable');
    libraryService.getLoanAvailable(req, res);
});

// 도서관 상세 정보
router.get('/library_detail/:libCode', (req, res) => {  
    console.log('/library/library_detail/:libCode');
    libraryService.library_detail(req, res);
});

module.exports = router;