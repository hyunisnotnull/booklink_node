const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken'); // 설치한 모듈을 불러온다.
const secretKey = process.env.SECURITY_KEY; // secretKey는 보안을 위해 일반적으로 .env 파일에 작성한다.
const logger = require('../config/logger');

// // 사용자 신원 확인 후
// const payload = { username: 'user' };
// const token = jwt.sign(payload, secretKey); // 토큰 생성

// const receivedToken = 'received-token-from-client';
// try {
//   const decoded = jwt.verify(receivedToken, secretKey);

  
//     // 새로운 페이로드 생성
//     const payload = {
//       userId: decoded.userId,
//       isAdmin: decoded.isAdmin,
//     };
    
//   // 사용자의 신원 확인
// } catch (err) {
//   // 토큰이 유효하지 않은 경우 에러 처리
// }



exports.passport = (app) => {

    let passport = require('passport');
    let LocalStrategy = require('passport-local').Strategy;
    // let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    // let NaverStrategy = require('passport-naver').Strategy;

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

            fetch('http://localhost:8090/admin/isAdmin',{
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
                logger.warn(JSON.stringify(data))   // 이 로그 정책상 지워야댐

                if (data.a_ID) {

                    const res = bcrypt.compareSync(password, data.a_PW);
                    if (res){

                        // const payload = {
                        //     userId: data.u_ID,
                        // };
    
                        // const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
                        // logger.warn ('token:' + token)
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

            fetch('http://localhost:8090/user/isUser',{
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
                logger.warn(JSON.stringify(data))   // 이 로그 정책상 지워야댐

                if (data.u_ID && data.u_ACTIVE === 1) {

                    const res = bcrypt.compareSync(password, data.u_PW);
                    if (res){

                        // const payload = {
                        //     userId: data.u_ID,
                        // };
    
                        // const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
                        // logger.info ('token:' + token)
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


    // // Google START
    // const googleCredential = JSON.parse(process.env.GOOGLE_LOGIN_API); // JSON 파싱

    // passport.use(new GoogleStrategy({
    //     clientID: googleCredential.web.client_id,
    //     clientSecret: googleCredential.web.client_secret,
    //     callbackURL: googleCredential.web.redirect_uris[0]
    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         logger.info('0. ');

    //         let email = profile.emails[0].value;

    //         DB.query(
    //             `
    //                 SELECT * FROM TBL_USER WHERE U_ID = ?
    //             `,
    //             [email], 
    //             (error, user) => {
    //                 if (user.length > 0) {    
    //                     DB.query(
    //                         `
    //                             UPDATE TBL_USER SET U_SNS_ID = ? WHERE U_ID = ?
    //                         `,
    //                         [profile.id, email],
    //                         (error, result) => {
    //                             done(null, user[0]);

    //                         }
    //                     );
                    
    //                 } else {      
    //                     let u_no;
    //                     let u_id = email;
    //                     let u_pw = shortid.generate();
    //                     let u_nick = shortid.generate();
    //                     let u_phone = '--';
    //                     let u_sex = '--';
    //                     let u_age = '--';
    //                     let u_post_address = '--';
    //                     let u_detail_address = '--';
    //                     let u_sns_id = profile.id;

    //                     DB.query(
    //                         `
    //                             INSERT INTO TBL_USER(U_ID, U_PW, U_NICK, U_PHONE, U_SEX, U_AGE, U_POST_ADDRESS, U_DETAIL_ADDRESS, U_SNS_ID) 
    //                             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    //                         `,
    //                         [u_id, bcrypt.hashSync(u_pw, 10), u_nick, u_phone, u_sex, u_age, u_post_address, u_detail_address, u_sns_id],
    //                         (error, result) => {
    //                             if (error) {
    //                                 return done(error);
    //                             }
                                
    //                             u_no = result.insertId;
                                
    //                             done(null, { U_ID: u_id, U_NO: u_no, isNewUser: true });
    //                         }
    //                     );

    //                 }

    //             }
    //         );

    //     }
    // ));

    // app.get('/auth/google',
    //         passport.authenticate(
    //             'google', 
    //             {
    //                 scope: ['https://www.googleapis.com/auth/plus.login', 'email'] 
    //             }
    //         )
    // );

    // app.get('/auth/google/callback', 
    //         passport.authenticate(
    //             'google', 
    //             { 
    //                 failureRedirect: '/user/sign_in_form' 
    //             }
    //         ),
    //         (req, res) => {
    //             logger.info('2. ');
    //             logger.info('Google Logged in user: ', req.user);

    //             if (req.user && req.user.isNewUser) {
    //                 req.logout(() => {
    //                     return res.redirect('/user/social_sign_up_ok?newUser=true');
    //                 });
                    
    //             } else {
    //                 res.redirect('/');
    //             }
    //         }
    // );

    // // Naver START
    // passport.use(new NaverStrategy({
    //     clientID: process.env.NAVER_CLIENT_ID,
    //     clientSecret: process.env.NAVER_CLIENT_SECRET,
    //     callbackURL: process.env.NAVER_CALLBACK_URL
    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         logger.info('0. naver');
    //         logger.info('0. profile', profile);

    //         let email = profile._json.email;
    //         logger.info('0. email', email);

    //         DB.query(
    //             `
    //                 SELECT * FROM TBL_USER WHERE U_ID = ?
    //             `,
    //             [email], 
    //             (error, user) => {
    //                 if (user.length > 0) {    
    //                     DB.query(
    //                         `
    //                             UPDATE TBL_USER SET U_SNS_ID = ? WHERE U_ID = ?
    //                         `,
    //                         [profile.id, email],
    //                         (error, result) => {
    //                             done(null, user[0]);

    //                         }
    //                     );
                    
    //                 } else {      
    //                     let u_no;
    //                     let u_id = email;
    //                     let u_pw = shortid.generate();
    //                     let u_nick = profile._json.nickname;
    //                     let u_phone = '--';
    //                     let u_sex = '--';
    //                     let u_age = profile._json.age;
    //                     let u_post_address = '--';
    //                     let u_detail_address = '--';
    //                     let u_sns_id = email;

    //                     DB.query(
    //                         `
    //                             INSERT INTO TBL_USER(U_ID, U_PW, U_NICK, U_PHONE, U_SEX, U_AGE, U_POST_ADDRESS, U_DETAIL_ADDRESS, U_SNS_ID) 
    //                             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    //                         `,
    //                         [u_id, bcrypt.hashSync(u_pw, 10), u_nick, u_phone, u_sex, u_age, u_post_address, u_detail_address, u_sns_id],
    //                         (error, result) => {
    //                             if (error) {
    //                                 return done(error);
    //                             }
                                
    //                             u_no = result.insertId;
                                
    //                             done(null, { U_ID: u_id, U_NO: u_no, isNewUser: true });
    //                         }
    //                     );

    //                 }

    //             }
    //         );

    //     }
    // ));

    // app.get('/auth/naver',
    //         passport.authenticate(
    //             'naver', 
    //             {
    //                 scope: ['email', 'profile']
    //             }
    //         )
    // );

    // app.get('/auth/naver/callback', 
    //         passport.authenticate(
    //             'naver', 
    //             { 
    //                 failureRedirect: '/user/sign_in_form' 
    //             }
    //         ),
    //         (req, res) => {
    //             logger.info('2. ');
    //             logger.info('Naver Logged in user: ', req.user);

    //             if (req.user && req.user.isNewUser) {
    //                 req.logout(() => {
    //                     return res.redirect('/user/social_sign_up_ok?newUser=true');
    //                 });

    //             } else {
    //                 res.redirect('/');
    //             }
    //         }
    // );

    return passport;

}