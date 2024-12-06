const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminService = {
    signup: (req, res) => {
        console.log('signup', req.body)
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
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    getadmin: (req, res) => {
        console.log('getadmin', req.params.adminId)
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
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    modify: (req, res) => {
        console.log('modify', req.body)
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
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    delete: (req, res) => {
        console.log('delete', req.params.adminId)
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
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },

};

module.exports = adminService;
