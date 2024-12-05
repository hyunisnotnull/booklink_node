const axios = require('axios');
const { getYesterdaysDate, getLastMonth, getFirstDayOfYear } = require('../config/utils');

const bookService = {
    detail: async (req, res) => {
        try {
            const { bookID } = req.params;

            console.log('Detail bookID :::',bookID);

            // 선택된 도서 API 호출
            const bookDetailResponse = await axios.get(`${process.env.BOOK_API_URL}srchDtlList?authKey=${process.env.BOOK_API_KEY}&isbn13=${bookID}&format=json`);
            const bookDetail = bookDetailResponse.data.response;

            // 선택된 도서 응답
            if (!bookDetail || bookDetail.length === 0) {
                return res.status(404).json({ message: '선택 도서 없음' });
            }

            // 선택된 도서 전달
            return res.json({ bookDetail });
        } catch (error) {
            console.error('Error fetching books:', error);
            return res.status(500).json({ error: 'Failed to fetch books', details: error.message });
        }
    },

    relatedBook: async (req, res) => {
      try {
          const { bookID } = req.params;

          console.log('Related bookID:::',bookID);

          const bookRelatedResponse = await axios.get(`${process.env.BOOK_API_URL}recommandList?authKey=${process.env.BOOK_API_KEY}&type=reader&isbn13=${bookID}&format=json`);
          const bookRelatedData = bookRelatedResponse.data.response.docs;

          if (bookRelatedData && bookRelatedData.length > 0) 
            bookRelated = bookRelatedData.slice(0, 8);
              
          return res.json({ bookRelated });
      } catch (error) {
          console.error('Error fetching books:', error);
          return res.status(500).json({ error: 'Failed to fetch books', details: error.message });
      }
    },

    search_book: async (req, res) => {
      const { title, author, publisher, isbn13, sort, order, pageNo } = req.query;
        console.log('검색어 입력값:', { title, author, publisher, isbn13, sort, order, pageNo });
        try {
          const response = await axios.get(`${process.env.BOOK_API_URL}srchBooks?authKey=${process.env.BOOK_API_KEY}`, {
            params: {
              title,
              author,
              publisher,
              isbn13,
              sort,
              order,
              pageNo,
              pageSize: 10,
              format: 'json',  // json 형식으로 응답 받기
            },
          });

          console.log('response ::: ', response);
          
          console.log('book ::: ', response.data.response);

          let books = response.data.response.docs;
          let totalCounts = response.data.response.numFound;
          let totalCount = (totalCounts > 1000 ? 1000 : totalCounts);

          console.log('books ::: ', books);
      
          res.json({ books, totalCount });
        } catch (error) {
          console.error('Error fetching books from API:', error);
          res.status(500).send('Error fetching books');
        }
    },

    search_library: async (req, res) => {
      const { title, isbn, region, pageNo } = req.query;
      console.log('검색어 입력값:', { title, isbn, region, pageNo });
    
      try {
        let response;
    
        // isbn 값이 없는 경우, title로 검색하여 isbn 추출
        if (!isbn && title) {
          console.log('제목으로 검색 중...');
          const bookResponse = await axios.get(`${process.env.BOOK_API_URL}srchBooks`, {
            params: {
              authKey: process.env.BOOK_API_KEY,
              title,
              pageSize: 1,
              format: 'json',
            },
          });
          
          console.log('11111', bookResponse.data.response);

          const searchBooks = bookResponse.data.response.docs;
          if (!searchBooks || searchBooks.length === 0) {
            return res.status(404).json({ message: '해당 제목으로 검색된 도서가 없습니다.' });
          }

          console.log('22222', searchBooks);
    
          const bookIsbn = searchBooks[0].doc.isbn13;
          console.log('추출된 ISBN:', bookIsbn);
    
          // 추출한 ISBN으로 다시 도서관 검색 실행
          response = await axios.get(`${process.env.BOOK_API_URL}libSrchByBook`, {
            params: {
              authKey: process.env.BOOK_API_KEY,
              isbn: bookIsbn,
              region,
              pageNo,
              pageSize: 10,
              format: 'json',
            },
          });
        } 
        // isbn 값이 있는 경우 바로 도서관 검색 실행
        else if (isbn) {
          console.log('ISBN으로 검색 중...');
          response = await axios.get(`${process.env.BOOK_API_URL}libSrchByBook`, {
            params: {
              authKey: process.env.BOOK_API_KEY,
              isbn,
              region,
              pageNo,
              pageSize: 10,
              format: 'json',
            },
          });
        } else {
          // title과 isbn 모두 없을 경우 에러 반환
          return res.status(400).json({ message: 'title 또는 isbn 중 하나는 필수입니다.' });
        }
    
        console.log('API 응답 데이터:', response.data.response);
    
        let libraries = response.data.response.libs || [];
        let totalCount = response.data.response.numFound || 0;
    
        console.log('검색된 도서관:', libraries);
    
        res.json({ libraries, totalCount });
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        res.status(500).send('도서 정보를 가져오는 중 오류가 발생했습니다.');
      }
    },

    // 인기 도서 가져오기
    getPopularBooks: async (req, res) => {
      try {
          const startDt = getFirstDayOfYear();
          const popularBooksResponse = await axios.get(`${process.env.BOOK_API_URL}loanItemSrch?authKey=${process.env.BOOK_API_KEY}&startDt=${startDt}&pageNo=1&pageSize=15&format=json`);
          const popularBooksRaw = popularBooksResponse.data.response.docs;
          const popularBooks = popularBooksRaw.filter(book => book.doc && book.doc.isbn13);
          // console.log('pop::', popularBooks);
          res.json({ popularBooks });
      } catch (error) {
          console.error('Error fetching popular books:', error);
          res.status(500).json({ error: 'Failed to fetch popular books' });
      }
  },

  // 신착 도서 가져오기
  getNewBooks: async (req, res) => {
      try {
          const libraryCode = req.query.libraryCode || '050001';

          console.log('libraryCode:::', libraryCode);

          const lastMonth = getLastMonth();
          const newBooksResponse = await axios.get(`${process.env.BOOK_API_URL}newArrivalBook?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&searchDt=${lastMonth}&format=json`);
          const newBooksRaw = newBooksResponse.data.response?.docs || [];
          const newBooks = newBooksRaw.filter(book => book.doc && book.doc.isbn13);
          console.log('new::', newBooks);
          res.json({ newBooks });
      } catch (error) {
          console.error('Error fetching new books:', error);
          res.status(500).json({ error: 'Failed to fetch new books' });
      }
  },

  // 급상승 도서 가져오기
  getRisingBooks: async (req, res) => {
      try {
          const searchDt = getYesterdaysDate();
          const risingBooksResponse = await axios.get(`${process.env.BOOK_API_URL}hotTrend?authKey=${process.env.BOOK_API_KEY}&searchDt=${searchDt}&format=json`);
          const risingBooksRaw = risingBooksResponse.data.response.results;
          const risingBooks = risingBooksRaw.length > 0 ? risingBooksRaw[0].result.docs || [] : [];
          // console.log('hot::', risingBooks);
          res.json({ risingBooks });
      } catch (error) {
          console.error('Error fetching rising books:', error);
          res.status(500).json({ error: 'Failed to fetch rising books' });
      }
  },
    
};

module.exports = bookService;