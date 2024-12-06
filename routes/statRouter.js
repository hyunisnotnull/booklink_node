const express = require('express');
const router = express.Router();
const statService = require('../lib/service/statService');

// 읽은 책 가지고 오기
router.get('/book_read', (req, res) => {  
    console.log('/stat/book_read');
    statService.book_read(req, res);
});

// 이름으로 도서관 검색
router.get('/', (req, res) => {  
    console.log('/stat/search_library_name');
    statService.search_library_name(req, res);
});

// 도서관 대출, 소장 여부 롸우톼
router.get('/', (req, res) => {  
    console.log('/stat/loanAvailable');
    statService.getLoanAvailable(req, res);
});

// 도서관 상세 정보
router.get('/', (req, res) => {  
    console.log('/stat/library_detail/:libCode');
    statService.library_detail(req, res);
});

module.exports = router;