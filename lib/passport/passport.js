const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const secretKey = process.env.SECURITY_KEY; 
const logger = require('../config/logger');

exports.passport = (app) => {

    let passport = require('passport');
    let LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) { 
        logger.warn('1. serializeUser : ' + user);
         done(null, { user });
        
    });
    
    passport.deserializeUser(function(user, done) {
        logger.warn('3. deserializeUser : ' + user);
        done(null, user);

    });


    passport.use('admin', new LocalStrategy(
        {
            usernameField: 'u_id',
            passwordField: 'u_pw',
        },
        function(username, password, done) {
            logger.warn('username of LocalStrategy admin ID : ' + username);
            logger.warn('password of LocalStrategy admin PW : ' + password);

            fetch(`${process.env.SPRING_URL}/admin/isAdmin`,{
                method: "POST",
                body: JSON.stringify({
                  a_ID: username,
                  a_PW: password,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    credentials: 'include',
                },
                })
            .then(response => response.json())
            .then(data => {
                logger.warn(JSON.stringify(data))

                if (data.a_ID) {

                    const res = bcrypt.compareSync(password, data.a_PW);
                    if (res){

                        done(null, {user:data.a_ID, role:data.a_ROLE});
                    } else{
                        done(null, false, {message: "비밀번호가 일치하지 않습니다."})
                    }


                    } else {
                        done(null, false, {message: "일치하는 사용자가 없습니다."})
                    }

                })
            .catch(error => console.error(error));
        }
    ));

    passport.use('user', new LocalStrategy(
        {
            usernameField: 'u_id',
            passwordField: 'u_pw',
        },
        function(username, password, done) {
            logger.warn('username of LocalStrategy user ID : ' + username);
            logger.warn('password of LocalStrategy user PW : ' + password);

            fetch(`${process.env.SPRING_URL}/user/isUser`,{
                method: "POST",
                body: JSON.stringify({
                  u_ID: username,
                  u_PW: password,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    credentials: 'include',
                },
                })
            .then(response => response.json())
            .then(data => {
                logger.warn(JSON.stringify(data))   

                if (data.u_ID && data.u_ACTIVE === 1) {

                    const res = bcrypt.compareSync(password, data.u_PW);
                    if (res){
                        done(null, data.u_ID);
                    } else{
                        done(null, false, {message: "비밀번호가 일치하지 않습니다."})
                    }


                    } else {
                        done(null, false, {message: "일치하는 사용자가 없습니다."})
                    }

                })
            .catch(error => logger.error(error));
        }
    ));

    return passport;

}