const axios = require('axios');

const bookService = {
    detail: async (req, res) => {
        try {
            const { bookID } = req.params;

            console.log('bookID:::',bookID);

            // 선택된 도서 API 호출
            const bookDetailResponse = await axios.get(`${process.env.BOOK_API_URL}srchDtlList?authKey=${process.env.BOOK_API_KEY}&isbn13=${bookID}&format=json`);
            const bookDetail = bookDetailResponse.data.response;

            console.log('BOOK DETAIL:::', bookDetail);

            // 선택된 도서 응답
            if (!bookDetail || bookDetail.length === 0) {
                return res.status(404).json({ message: '선택 도서 없음' });
            }

            // 선택된 도서 전달
            res.json({ bookDetail });
        } catch (error) {
            console.error('Error fetching books:', error);
            res.status(500).json({ error: 'Failed to fetch books', details: error.message });
        }
    },
};

module.exports = bookService;
