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
};

module.exports = userService;
