const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const adminService = {
    signup: (req, res) => {
        logger.info('signup', req.body)
        const body = req.body;

        fetch(`${process.env.SPRING_URL}/admin/addAdmin`,{
            method: "POST",
            body: JSON.stringify({
              a_ID: body.a_id,
              a_PW: bcrypt.hashSync(body.a_pw, 10),
              a_AGE: body.a_age,
              a_PHONE: body.a_phone,
              a_SEX: body.a_sex,
              a_ZIPCODE: body.a_zipcode,
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
    getadmin: (req, res) => {
        logger.info('getadmin', req.params.userId)
        const a_ID = req.params.userId

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
        logger.warn('modify', req.body)
        const body = req.body;

        let bcryptPw = "";
        if(body.a_pw !== 'undefined'){
           bcryptPw = bcrypt.hashSync(body.a_pw, 10);
        }
        
        fetch(`${process.env.SPRING_URL}/admin/modifyAdmin`,{
            method: "POST",
            
            body: JSON.stringify({
              a_ID: body.a_id,
              a_PW: bcryptPw,
              a_AGE: body.a_age,
              a_PHONE: body.a_phone,
              a_SEX: body.a_sex,
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
        logger.info('delete', req.params.adminId)
        const u_ID = req.params.userId

        fetch(`${process.env.SPRING_URL}/admin/deleteAdmin`,{
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
        logger.info('google', req.body.code)
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

                fetch(`${process.env.SPRING_URL}/admin/addAdmin`,{
                    method: "POST",
                    body: JSON.stringify({
                      a_ID: email,
                      a_PW: bcrypt.hashSync(email.split('@',1)[0], 10),
                      a_SEX: '-',
                      a_AGE: 0,
                      a_PHONE: '-',
                      a_ZIPCODE: '-',
                      a_POST_ADDRESS: '-',
                      a_DETAIL_ADDRESS: '-',
                      a_SNS_ID: id,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        credentials: 'include',
                    },
                    })
                    .then(response => response.json())
                //add new
            } else if(data.a_ID === email && data.a_SNS_ID === null)  {
                fetch(`${process.env.SPRING_URL}/admin/modifyAdmin`,{
                    method: "POST",
                    
                    body: JSON.stringify({
                      a_ID: email,
                      a_PW: "",
                      a_SEX: data.a_SEX,
                      a_AGE: data.a_AGE,
                      a_PHONE: data.a_PHONE,
                      a_ZIPCODE: data.a_ZIPCODE,
                      a_POST_ADDRESS: data.a_POST_ADDRESS,
                      a_DETAIL_ADDRESS: data.a_DETAIL_ADDRESS,
                      a_SNS_ID: id,
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

};

module.exports = adminService;
