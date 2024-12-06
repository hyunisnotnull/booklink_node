const express = require('express');
const router = express.Router();
const libraryService = require('../lib/service/libraryService');
const logger = require('../lib/config/logger');

// library JPA
router.post('/JPA', (req, res) => {  
    logger.info('/library/JPA');
    libraryService.updateLibraryJPA(req, res);
});

// 이름으로 도서관 검색
router.get('/search_library_name', (req, res) => {  
    logger.info('/library/search_library_name');
    libraryService.search_library_name(req, res);
});

// 도서관 대출, 소장 여부 롸우톼
router.get('/loanAvailable', (req, res) => {  
    logger.info('/library/loanAvailable');
    libraryService.getLoanAvailable(req, res);
});

// 도서관 상세 정보
router.get('/library_detail/:libCode', (req, res) => {  
    logger.info('/library/library_detail/:libCode');
    libraryService.library_detail(req, res);
});

module.exports = router;