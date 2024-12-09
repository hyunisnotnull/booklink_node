const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const emailService = require('../nodemailer/emailService');
const uuid4 = require('uuid4');

const userService = {
    signup: (req, res) => {
        logger.info('signup', req.body)
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
            logger.warn(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
    getuser: (req, res) => {
        logger.info('getuser', req.params.userId)
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
            logger.warn(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
    modify: (req, res) => {
        logger.info('modify', req.body)
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
            logger.warn(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
    delete: (req, res) => {
        logger.info('delete', req.params.userId)
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
            logger.warn(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
    google: (req, res) => {
        logger.warn('google', req.body.code)
        const code = req.body.code
        let email = '';
        let id = '';

        fetch(process.env.GOOGLE_TOKEN_URI,{
            method: "POST",
            body: JSON.stringify({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                code: code,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            logger.warn('token info ---> ', data);
            // return res.json(data)
       
            return fetch(`${process.env.GOOGLE_OAUTH2_URI}/userinfo?access_token=${data.access_token}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`)})

        .then(response => response.json())
        .then(data => {
            logger.warn('user info ---> ', data)
                email = data.email;
                id = data.id;
                // return res.json(data);
                return fetch(`${process.env.SPRING_URL}/user/isUser`,{
                    method: "POST",
                    body: JSON.stringify({
                      u_ID: data.email,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        credentials: 'include',
                    },})
                })
        .then(response => response.json())
        .then(data => {
            logger.warn('after sns login --> ', data)
            if(data.u_ID === null) {

                fetch(`${process.env.SPRING_URL}/user/addUser`,{
                    method: "POST",
                    body: JSON.stringify({
                      u_ID: email,
                      u_PW: bcrypt.hashSync(email.split('@',1)[0], 10),
                      u_SEX: '-',
                      u_AGE: 0,
                      u_PHONE: '-',
                      u_ZIPCODE: '-',
                      u_POST_ADDRESS: '-',
                      u_DETAIL_ADDRESS: '-',
                      u_SNS_ID: id,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        credentials: 'include',
                    },
                    })
                    .then(response => response.json())
                //add new
            } else if(data.u_ID === email && data.u_SNS_ID === null)  {
                fetch(`${process.env.SPRING_URL}/user/modifyUser`,{
                    method: "POST",
                    
                    body: JSON.stringify({
                      u_ID: email,
                      u_PW: "",
                      u_SEX: data.u_SEX,
                      u_AGE: data.u_AGE,
                      u_PHONE: data.u_PHONE,
                      u_ZIPCODE: data.u_ZIPCODE,
                      u_POST_ADDRESS: data.u_POST_ADDRESS,
                      u_DETAIL_ADDRESS: data.u_DETAIL_ADDRESS,
                      u_SNS_ID: id,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        credentials: 'include',
                    },
                    })
                    .then(response => response.json())
                //mod sns id
            } else if (data.u_ID === email && data.u_SNS_ID === id) {
                
                return data;
            }
        })
        // .then(response => response.json())        
        .then(data => {
            logger.warn(data);
            const payload = {
                userId: email,
              };
      
            const token = jwt.sign(payload,  process.env.SECURITY_KEY , { expiresIn: 60 * 1 });
            logger.warn ('token:', token)
            // res.set("Access-Control-Allow-Credentials", "true");
            res.cookie('token', token)
            return res.json(payload);
        })

        .catch(error => logger.error(error));
    },
    getid: (req, res) => {
        logger.info('getid', req.body)
        const body = req.body;

        fetch(`${process.env.SPRING_URL}/user/getid`,{
            method: "POST",
            
            body: JSON.stringify({
              u_PHONE: body.u_phone,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            logger.warn(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    getpw: (req, res) => {
        logger.info('getpw', req.body)
        const body = req.body;
        const id = body.u_id;
        const phone = body.u_phone;

        function generateTemporaryPassword() {
            const uuid = uuid4();
            return uuid.replace(/-/g, "").substring(0, 8);
        }


        fetch(`${process.env.SPRING_URL}/user/getpw`,{
            method: "POST",
            
            body: JSON.stringify({
                u_ID: id,
                u_PHONE: phone,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            logger.info('data --- > '+ JSON.stringify(data));
            if (data.u_ID === id && data.u_PHONE === phone){
                const tempPassword = generateTemporaryPassword();


                fetch(`${process.env.SPRING_URL}/user/updatepw`,{
                    method: "POST",
            
                    body: JSON.stringify({
                        u_ID: id,
                        u_PHONE: phone,
                        u_PW: bcrypt.hashSync(tempPassword, 10),
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        credentials: 'include',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    logger.info('data update--- > '+ JSON.stringify(data));
                    if(data.u_ID === id) {
                        
                        emailService.sendPasswordResetEmail(data.u_ID, tempPassword)
                        .then(() => {
                            res.json({ success: true, message: `임시 비밀번호 ${data.u_ID}으로 전송 완료` });
                        })
                        .catch(emailError => {
                            console.error("이메일 전송 오류:", emailError);
                            res.json({ success: false, message: '이메일 전송에 실패했습니다.' });
                        });

                    }

                });
   
            }   
            res.json({ success: false, message: '일치하는 데이터가 없습니다.' })
            })
        .catch(error => console.error(error));
    },


    // User Wish Book START
    addWishBook: async (req, res) => {
        const WishBookDto = req.body;

        if (!WishBookDto.W_U_ID || WishBookDto.W_U_ID.trim() === '') {
            return res.status(400).json({ message: '사용자 ID 가 필요합니다.' });
        }

        logger.info('Wish Book Node :::', WishBookDto);

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
            logger.error('Spring 서버로 전달 중 에러 발생:', error);
            res.status(500).json({ message: '찜하기 실패' });
        }
    },

    wishBooks: async (req, res) => {
        const { userId } = req.body;

        if (!userId || userId.trim() === '') {
            return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
        }

        try {
        // Spring 서버에 찜한 도서 목록 요청
        const response = await axios.post(`${process.env.SPRING_URL}/wishlist/wishBooks`, {
            userId : userId
        });

            // Spring 서버에서 반환된 찜한 도서 목록
            res.status(200).json({ wishlistBooks: response.data });
        } catch (error) {
            logger.error('찜한 도서 조회 중 에러 발생:', error);
            res.status(500).json({ message: '찜한 도서 조회 실패' });
        }
       
    },

    cancleWishBook: async (req, res) => {
        const { W_U_ID, W_ISBN13 } = req.body;

        if (!W_U_ID || !W_ISBN13) {
            return res.status(400).json({ message: '사용자 ID 및 ISBN13이 필요합니다.' });
        }
    
        logger.info('Cancel wish book:', W_U_ID, W_ISBN13);
    
        try {
            // Spring 서버에서 찜한 도서 취소 요청
            const response = await axios.delete(`${process.env.SPRING_URL}/wishlist/cancleWishBook`, {
                data: { W_U_ID, W_ISBN13 }
            });
    
            res.status(200).json({ message: '내 도서 취소를 완료했습니다.', data: response.data });
        } catch (error) {
            logger.error('찜 취소 중 에러 발생:', error);
            res.status(500).json({ message: '내 도서 취소중 에러가 발생했습니다.' });
        }
    },

    readWishBook: async (req, res) => {
        const { W_U_ID, W_ISBN13, W_B_READ } = req.body;

        if (!W_U_ID || !W_ISBN13) {
            return res.status(400).json({ message: '사용자 ID 및 ISBN13이 필요합니다.' });
        }
    
        logger.info('read wish book:', W_U_ID, W_ISBN13, W_B_READ);
    
        try {

            const response = await axios.put(`${process.env.SPRING_URL}/wishlist/readWishBook`, {
               W_U_ID, W_ISBN13, W_B_READ,
            });
    
            res.status(200).json({ message: '독서 상태 변경에 성공했습니다.', data: response.data });
        } catch (error) {
            logger.error('독서 상태 변경 중 에러 발생:', error);
            res.status(500).json({ message: '독서 상태 변경중 에러가 발생했습니다.' });
        }
    },

    // User Favorite Library START
    addWishLib: async (req, res) => {
        const WishLibraryDto = req.body;
        logger.info('Favorite Library Dto Node :::', WishLibraryDto);

        if (!WishLibraryDto.ML_U_ID || WishLibraryDto.ML_U_ID.trim() === '' || !WishLibraryDto.ML_L_CODE) {
            return res.status(400).json({ message: '오류가 발생했습니다. 잠시후 시도해주세요.' });
        }

        try {

            const response = await axios.post(`${process.env.SPRING_URL}/wishlist/addMyLibrary`, WishLibraryDto,
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 형태로 요청 보내기
                    }
                }
            );
            res.status(200).json({ message: '찜하기 성공', data: response.data });
        } catch (error) {
            const errorMessage = error.response ? error.response.data : '서버 오류 발생';
            res.status(500).json({ message: errorMessage });
        }
    },

    cancleWishLib: async (req, res) => {
        const { ML_U_ID, ML_L_CODE } = req.body;

        if (!ML_U_ID || !ML_L_CODE) {
            return res.status(400).json({ message: '사용자 ID 및 ISBN13이 필요합니다.' });
        }
    
        logger.info('Cancel wish book:', ML_U_ID, ML_L_CODE);
    
        try {

            const response = await axios.delete(`${process.env.SPRING_URL}/wishlist/cancleMyLibrary`, {
                data: { ML_U_ID, ML_L_CODE }
            });
    
            res.status(200).json({ message: '내 도서관에서 삭제 되었습니다.', data: response.data });
        } catch (error) {
            logger.error('찜 취소 중 에러 발생:', error);
            res.status(500).json({ message: '내 도서관 삭제 중 에러가 발생했습니다.' });
        }
    },

    wishLibrarys: async (req, res) => {
        const { userId } = req.body;

        if (!userId || userId.trim() === '') {
            return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
        }

        try {

        const response = await axios.post(`${process.env.SPRING_URL}/wishlist/wishLibrarys`, {
            userId : userId
        });

            res.status(200).json({ wishlistLibs: response.data });
        } catch (error) {
            logger.error('찜한 도서관 조회 중 에러 발생:', error);
            res.status(500).json({ message: '찜한 도서 조회 실패' });
        }
       
    },


};

module.exports = userService;
