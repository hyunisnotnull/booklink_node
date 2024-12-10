const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const emailService = require('../nodemailer/emailService');
const uuid4 = require('uuid4');

const adminService = {
    signup: (req, res) => {
        logger.info('signup' + req.body)
        const body = req.body;

        fetch(`${process.env.SPRING_URL}/admin/addAdmin`,{
            method: "POST",
            body: JSON.stringify({
              a_ID: body.a_id,
              a_PW: bcrypt.hashSync(body.a_pw, 10),
              a_MAIL: body.a_mail,
              a_PHONE: body.a_phone,
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
    getadmin: (req, res) => {
        logger.info('getadmin' + req.params.adminId)
        const a_ID = req.params.adminId

        fetch(`${process.env.SPRING_URL}/admin/isAdmin`,{
            method: "POST",
            body: JSON.stringify({
              a_ID: a_ID,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            console.warn(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
    modify: (req, res) => {
        logger.warn('modify' + req.body)
        const body = req.body;

        let bcryptPw = "";
        if(body.a_pw){
            logger.info(req.body.a_pw)
           bcryptPw = bcrypt.hashSync(body.a_pw, 10);
        }
        
        fetch(`${process.env.SPRING_URL}/admin/modifyAdmin`,{
            method: "POST",
            
            body: JSON.stringify({
              a_ID: body.a_id,
              a_PW: bcryptPw,
              a_MAIL: body.a_mail,
              a_PHONE: body.a_phone,
              a_POST_ADDRESS: body.a_post_address,
              a_DETAIL_ADDRESS: body.a_detail_address,
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
        logger.info('delete' + req.params.adminId)
        const a_ID = req.params.adminId

        fetch(`${process.env.SPRING_URL}/admin/deleteAdmin`,{
            method: "POST",
            body: JSON.stringify({
              a_ID: a_ID,
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
    getid: (req, res) => {
        logger.info('getid' + req.body)
        const body = req.body;

        fetch(`${process.env.SPRING_URL}/admin/getid`,{
            method: "POST",
            
            body: JSON.stringify({
              a_PHONE: body.a_phone,
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
        const id = body.a_id;
        const phone = body.a_phone;

        function generateTemporaryPassword() {
            const uuid = uuid4();
            return uuid.replace(/-/g, "").substring(0, 8);
        }


        fetch(`${process.env.SPRING_URL}/admin/getpw`,{
            method: "POST",
            
            body: JSON.stringify({
                a_ID: id,
                a_PHONE: phone,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            logger.warn(JSON.stringify(data));
            if (data.a_ID === id && data.a_PHONE === phone){
                const tempPassword = generateTemporaryPassword();


                fetch(`${process.env.SPRING_URL}/admin/updatepw`,{
                    method: "POST",
            
                    body: JSON.stringify({
                        a_ID: id,
                        a_PHONE: phone,
                        a_PW: bcrypt.hashSync(tempPassword, 10),
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        credentials: 'include',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    logger.info(JSON.stringify(data))
                    if(data.a_ID === id && data.a_PHONE === phone) {
                        const mail = data.a_MAIL
                        emailService.sendPasswordResetEmail(data.a_MAIL, tempPassword)
                        .then(() => {
                            res.json({ success: true, message: `임시 비밀번호 ${mail}으로 전송 완료` });
                        })
                        .catch(emailError => {
                            console.error("이메일 전송 오류:", emailError);
                            res.json({ success: false, message: '이메일 전송에 실패했습니다.' });
                        });

                    } else {
                        res.json({ success: false, message: `일치하는 데이터가 없습니다.` });
                    }

                });
   
            }   else {
            res.json({ success: false, message: '일치하는 데이터가 없습니다.' })
            }
            })
        .catch(error => console.error(error));
    },

};

module.exports = adminService;
