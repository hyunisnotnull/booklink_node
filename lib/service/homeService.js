const axios = require('axios');

const homeService = {
    home: async (req, res) => {
        try {
            const libraryCode = req.query.libraryCode || '050001';  // 기본 도서관 코드 설정

            console.log('LIBRARY CODE:::', libraryCode);

            // 1. 인기 도서 API 호출
            const popularBooksResponse = await axios.get(`http://data4library.kr/api/loanItemSrch?authKey=${process.env.BOOK_API}&pageNo=1&pageSize=12&format=json`);
            const popularBooks = popularBooksResponse.data.response.docs;

            console.log('POPULAR BOOKS:::', popularBooks);

            // 인기 도서 응답
            if (!popularBooks || popularBooks.length === 0) {
                return res.status(404).json({ message: '인기도서 없음' });
            }

            // 2. 신착 도서 API 호출
            const newBooksResponse = await axios.get(`https://data4library.kr/api/newArrivalBook?authKey=${process.env.BOOK_API}&libCode=${libraryCode}&pageNo=1&pageSize=12&format=json`);
            const newBooks = newBooksResponse.data.response.docs;

            console.log('NEW BOOKS:::', newBooks);

            // 신착 도서 응답
            if (!newBooks || newBooks.length === 0) {
                return res.status(404).json({ message: '신착도서 없음' });
            }

            // 3. 인기 도서와 신착 도서 모두 전달
            res.json({ popularBooks, newBooks });
        } catch (error) {
            console.error('Error fetching books:', error);
            res.status(500).json({ error: 'Failed to fetch books', details: error.message });
        }
    },
};

module.exports = homeService;
