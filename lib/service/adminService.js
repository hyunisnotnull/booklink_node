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
        logger.info('getadmin', req.params.adminId)
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
        logger.info('delete', req.params.adminId)
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
        logger.info('getid', req.body)
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

};

module.exports = adminService;
