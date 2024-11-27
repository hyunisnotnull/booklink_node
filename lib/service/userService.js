const axios = require('axios');

const userService = {
    signin: async (req, res) => {
        try {
        } catch (error) {
            console.error(error)
        }
    },
    signup: async (req, res) => {
        console.log('signup', req.body)


        fetch('http://localhost:8090/user/addUser',{
            method: "POST",
            body: JSON.stringify({
              u_ID: u_id,
              u_PW: u_pw,
              u_AGE: null,
              u_PHONE: null,
              u_MAIL: null,
              u_SEX: null,
              u_POST_ADDRESS: null,
              u_DETAIL_ADDRESS: null,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            if (data.u_ID) {

                //const res = bcrypt.compareSync(password, data.u_PW);
                const res = true;
                if (res){

                    // const payload = {
                    //     userId: data.u_ID,
                    // };

                    // const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
                    // console.log ('token:', token)
                    done(null, data.u_ID);
                } else{
                    done(null, false, {message: "비밀번호가 일치하지 않습니다."})
                }


                }
            })
        .catch(error => console.error(error));
        
    },
};

module.exports = userService;
