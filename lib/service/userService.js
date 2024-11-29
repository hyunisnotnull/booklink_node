const axios = require('axios');
const bcrypt = require('bcrypt');

const userService = {
    signup: (req, res) => {
        console.log('signup', req.body)
        const body = req.body;

        fetch('http://localhost:8090/user/addUser',{
            method: "POST",
            body: JSON.stringify({
              u_ID: body.u_id,
              u_PW: bcrypt.hashSync(body.u_pw, 10),
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
    getuser: (req, res) => {
        console.log('getuser', req.params.userId)
        const u_ID = req.params.userId

        fetch('http://localhost:8090/user/isUser',{
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
        
        fetch('http://localhost:8090/user/modifyUser',{
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

        fetch('http://localhost:8090/user/deleteUser',{
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
};

module.exports = userService;
