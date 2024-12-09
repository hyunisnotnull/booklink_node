const express = require('express');
const router = express.Router();
const statService = require('../lib/service/statService');

// 읽은 책 가지고 오기
router.get('/book_read', (req, res) => {  
    console.log('/stat/book_read');
    statService.book_read(req, res);
});

// 도서 찜 순위 가지고 오기
router.get('/book_rank', (req, res) => {  
    console.log('/stat/book_rank');
    statService.book_rank(req, res);
});

// 도서관 찜 순위 가지고 오기
router.get('/library_rank', (req, res) => {  
    console.log('/stat/library_rank');
    statService.library_rank(req, res);
});

module.exports = router;