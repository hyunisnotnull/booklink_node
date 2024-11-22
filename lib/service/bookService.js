const axios = require('axios');

const bookService = {
    detail: async (req, res) => {
        try {
            const { bookID } = req.params;

            console.log('bookID:::',bookID);

            // 선택된 도서 API 호출
            const bookDetailResponse = await axios.get(`${process.env.BOOK_API_URL}srchDtlList?authKey=${process.env.BOOK_API_KEY}&isbn13=${bookID}&format=json`);
            const bookDetail = bookDetailResponse.data.response;

            // 선택된 도서 응답
            if (!bookDetail || bookDetail.length === 0) {
                return res.status(404).json({ message: '선택 도서 없음' });
            }

            console.log('BOOK DETAIL:::', bookDetail);
            
            // 관련 도서 API 호출
            const bookRelatedResponse = await axios.get(`${process.env.BOOK_API_URL}recommandList?authKey=${process.env.BOOK_API_KEY}&type=reader&isbn13=${bookID}&format=json`);
            const bookRelated = bookRelatedResponse.data.response.docs;

            // 관련 도서 응답
            if (!bookRelated || bookRelated.length === 0) {
                return res.status(404).json({ message: '관련 도서 없음' });
            }

            console.log('BOOK RELATED:::', bookRelated);

            // 선택된 도서 전달
            return res.json({ bookDetail, bookRelated });
        } catch (error) {
            console.error('Error fetching books:', error);
            return res.status(500).json({ error: 'Failed to fetch books', details: error.message });
        }
    },

};

module.exports = bookService;