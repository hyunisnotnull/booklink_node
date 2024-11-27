const axios = require('axios');
const {removeMiddleDot} = require('../config/utils');

const libraryService = {
    updateLibrary: async (req, res) => {
        try {
            const pageSize = 10;
            const format = 'json';

            // 첫 번째 요청을 통해 전체 도서관 개수와 페이지 수를 계산
            const firstPageRes = await axios.get(
                `${process.env.BOOK_API_URL}extends/libSrch`, {
                    params: {
                        authKey: process.env.BOOK_API_KEY,
                        pageNo: 1,
                        pageSize: pageSize,
                        format: format,
                    },
                    timeout: 30000
                }
            );

            const totalLibraries = firstPageRes.data.response.numFound;
            const totalPages = Math.ceil(totalLibraries / pageSize);

            // 페이지별로 데이터를 받아와서 바로 서버에 전송
            for (let page = 1; page <= totalPages; page++) {
                const pageRes = await axios.get(`${process.env.BOOK_API_URL}extends/libSrch`, {
                    params: {
                        authKey: process.env.BOOK_API_KEY,
                        pageNo: page,
                        pageSize: pageSize,
                        format: format,
                    },
                    timeout: 30000
                });

                const librariesFromPage = pageRes.data.response.libs.map(lib => lib.lib.libInfo);

                const cleanedLibraries = removeMiddleDot(librariesFromPage);
                console.log("Cleaned Libraries:", cleanedLibraries);

                // 각 페이지의 데이터를 스프링 서버로 바로 전송
                const springRes = await axios.post(`${process.env.SPRING_URL}/api/library/update`, cleanedLibraries);
                
                console.log(`Page ${page} data sent, ${librariesFromPage.length} libraries saved.`);

                // await sleep(1000);  // 1초 대기 (옵션)
            }

            return res.json({ message: '도서관 데이터가 성공적으로 저장되었습니다.' });

        } catch (error) {
            console.error('Error fetching libraries:', error);
            res.status(500).json({ error: 'Failed to fetch libraries', details: error.message });
        }
    },
};

module.exports = libraryService;
