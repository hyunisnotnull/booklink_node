const axios = require('axios');

const libraryService = {
    updateLibrary: async (req, res) => {
        try {
            const pageSize = 10;
            const format = 'json';

            // 첫 번째 페이지 요청하여 총 도서관 수 얻기
            const firstPageRes = await axios.get(
                `${process.env.BOOK_API_URL}extends/libSrch`, {
                    params: {
                        authKey: process.env.BOOK_API_KEY,
                        pageNo: 1,
                        pageSize: pageSize,
                        format: format,
                    }
                }
            );

            const totalLibraries = firstPageRes.data.response.numFound;
            const totalPages = Math.ceil(totalLibraries / pageSize);

            console.log(`Total libraries: ${totalLibraries}, Total pages: ${totalPages}`);

            // 모든 페이지 요청을 병렬로 처리
            const pageRequests = [];

            for (let page = 1; page <= totalPages; page++) {
                pageRequests.push(
                    axios.get(
                        `${process.env.BOOK_API_URL}extends/libSrch`, {
                            params: {
                                authKey: process.env.BOOK_API_KEY,
                                pageNo: page,
                                pageSize: pageSize,
                                format: format,
                            }
                        }
                    )
                );
            }

            // 모든 페이지 요청이 완료될 때까지 기다리고, 결과를 합칩니다.
            const responses = await Promise.all(pageRequests);

            // 모든 도서관 정보 추출
            const allLibraries = responses.flatMap(response => response.data.response.libs.map(lib => lib.lib.libInfo));

            console.log(`Fetched all libraries: ${allLibraries.length}`);

            if (!allLibraries || allLibraries.length === 0) {
                return res.status(404).json({ message: '도서관 없음' });
            }

            // Spring 서버로 데이터 전송
            const springRes = await axios.post(`${process.env.SPRING_URL}/api/library/update`, allLibraries);

            if (springRes.status === 200) {
                return res.json({ message: '도서관 데이터가 성공적으로 저장되었습니다.' });
            } else {
                return res.status(500).json({ message: 'Spring 서버에 데이터 저장 실패' });
            }

        } catch (error) {
            console.error('Error fetching libraries:', error);
            res.status(500).json({ error: 'Failed to fetch libraries', details: error.message });
        }
    },
};

module.exports = libraryService;
