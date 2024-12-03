const axios = require('axios');
const bcrypt = require('bcrypt');

const userService = {
    signup: (req, res) => {
        console.log('signup', req.body)
        const body = req.body;

        fetch(`${process.env.SPRING_URL}/user/addUser`,{
            method: "POST",
            body: JSON.stringify({
              u_ID: body.u_id,
              u_PW: bcrypt.hashSync(body.u_pw, 10),
              u_AGE: body.u_age,
              u_PHONE: body.u_phone,
              u_SEX: body.u_sex,
              u_ZIPCODE: body.u_zipcode,
              u_POST_ADDRESS: body.u_post_address,
              u_DETAIL_ADDRESS: body.u_detail_address,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    getuser: (req, res) => {
        console.log('getuser', req.params.userId)
        const u_ID = req.params.userId

        fetch(`${process.env.SPRING_URL}/user/isUser`,{
            method: "POST",
            body: JSON.stringify({
              u_ID: u_ID,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    modify: (req, res) => {
        console.log('modify', req.body)
        const body = req.body;

        let bcryptPw = "";
        if(body.u_pw !== undefined){
           bcryptPw = bcrypt.hashSync(body.u_pw, 10);
        }
        
        fetch(`${process.env.SPRING_URL}/user/modifyUser`,{
            method: "POST",
            
            body: JSON.stringify({
              u_ID: body.u_id,
              u_PW: bcryptPw,
              u_AGE: body.u_age,
              u_PHONE: body.u_phone,
              u_SEX: body.u_sex,
              u_POST_ADDRESS: body.u_post_address,
              u_DETAIL_ADDRESS: body.u_detail_address,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    delete: (req, res) => {
        console.log('delete', req.params.userId)
        const u_ID = req.params.userId

        fetch(`${process.env.SPRING_URL}/user/deleteUser`,{
            method: "POST",
            body: JSON.stringify({
              u_ID: u_ID,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },

    // User Wish Book START
    addWishBook: async (req, res) => {
        const WishBookDto = req.body;

        if (!WishBookDto.W_U_ID || WishBookDto.W_U_ID.trim() === '') {
            return res.status(400).json({ message: '사용자 ID 가 필요합니다.' });
        }

        console.log('Wish Book Node :::', WishBookDto);

        try {
            // Spring 서버에 wishBookData를 직접 전달
            const response = await axios.post(`${process.env.SPRING_URL}/wishlist/addWishBook`, WishBookDto,
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 형태로 요청 보내기
                    }
                }
            );
            res.status(200).json({ message: '찜하기 성공', data: response.data });
        } catch (error) {
            console.error('Spring 서버로 전달 중 에러 발생:', error);
            res.status(500).json({ message: '찜하기 실패' });
        }
    },

    wishBooks: async (req, res) => {
        const { userId } = req.body;

        if (!userId || userId.trim() === '') {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
        }
        console.log('UserID1', req.body);
        console.log('UserID2', req.params);
        console.log('UserID3', userId);

        try {
        // Spring 서버에 찜한 도서 목록 요청
        const response = await axios.post(`${process.env.SPRING_URL}/wishlist/wishBooks`, {
            userId : userId
        });

        // Spring 서버에서 반환된 찜한 도서 목록
        res.status(200).json({ wishlistBooks: response.data });
        } catch (error) {
        console.error('찜한 도서 조회 중 에러 발생:', error);
        res.status(500).json({ message: '찜한 도서 조회 실패' });
        }
       
    },

    cancleWishBook: async (req, res) => {
        const { W_U_ID, W_ISBN13 } = req.body;

        if (!W_U_ID || !W_ISBN13) {
          return res.status(400).json({ message: '사용자 ID 및 ISBN13이 필요합니다.' });
        }
    
        console.log('Cancel wish book for:', W_U_ID, W_ISBN13);
    
        try {
          // Spring 서버에서 찜한 도서 취소 요청
          const response = await axios.delete(`${process.env.SPRING_URL}/wishlist/cancleWishBook`, {
            data: { W_U_ID, W_ISBN13 }
          });
    
          res.status(200).json({ message: '찜 취소 성공', data: response.data });
        } catch (error) {
          console.error('찜 취소 중 에러 발생:', error);
          res.status(500).json({ message: '찜 취소 실패' });
        }
    },


};

module.exports = userService;
