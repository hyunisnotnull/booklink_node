const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const form_data = multer();
const compression = require('compression');
const path = require('path');
const session = require('express-session');
//const MemoryStore = require('memorystore')(session);
const dotenv = require('dotenv');
const pp = require('./lib/passport/passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const secretKey = process.env.SECURITY_KEY; 

app.use(cors({ 
  origin: ['http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());
// app.use(cookieParser());

if (process.env.NODE_ENV === 'local') {
    console.log('LOCAL ENV!!');
    dotenv.config();

} else if (process.env.NODE_ENV === 'dev') {
    console.log('DEV ENV!!');
    dotenv.config({ path: path.resolve(__dirname, '.env.dev') });

} else {
    console.log('PROD ENV!!');
    dotenv.config({ path: path.resolve(__dirname, '.env.prod') });
    
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(form_data.array());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(process.env.EVENT_IMAGE_PATH));

// session setting START
const maxAge = 1000 * 60 * 30;
const sessionObj = {
    secret: 'green!@#$%^',
    resave: false,
    saveUninitialized: true,
    // store: new MemoryStore({checkPeriod: maxAge}),
    cookie: {
        maxAge: maxAge,
        sameSite:"none",
    }
};
app.use(session(sessionObj));
// session setting END

// app.use(cors({
//     origin: '*', // 출처 허용 옵션
//     credential: 'true' // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
// }));


let passport = pp.passport(app);
//  app.post('/signin', passport.authenticate('local', {
//     successRedirect: 'http://localhost:8090/user/testUser',
//     //successRedirect: 'http://localhost:3000/',
//      failureRedirect: '/signin?errMsg=ID 또는 PW가 일치하지 않습니다.',
//  }));

 app.post('/signin', async (req, res, next) => {
//     if (!req.isAuthenticated()) {
//       next();
//     } else {
//         next()
//       //res.status(403).send('이미 로그인 됨.');
//     }
//   }, async(req, res, next) => {
     passport.authenticate('local', (authError, user, info) => {
//       if (authError) {
//         console.error(authError);
//         res.status(500);
//         return next(authError);
//       }
       if (user) {
         //req.cookie('token', user)
         //res.status(500);
         //req.redirect('http:localhost:8090/user/testUser');
       //}
       return req.login(user, (loginError) => {
         if (loginError) {
           console.error(loginError);
           res.status(500);
           return next(loginError);
         }
         console.log("before send : ---- ", user)

         const payload = {
          userId: user,
        };

      const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 30 });
      console.log ('token:', token)



          res.cookie('token', token,{ path: "/" })
          return res.json(payload);
        });
      }
      res.clearCookie('token');
      return res.json({msg:'err'});
     })(req, res, next);
   });

app.use(ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    const cookies = cookie.parse(req.headers.cookie)
    const receivedToken = cookies.token;
    try {

      if (jwt.verify(receivedToken, secretKey)){
  
        const decoded = jwt.verify(receivedToken, secretKey);
        req.payload = decoded;
        console.log(decoded);
        return next();
      }
    } catch(err) {
      console.log(err)
      return res.redirect('http://localhost:3001/signin');
    }

  }
  return next();
});




app.get('/test', (req,res) => {

  //console.log(req)
  // console.log(req.user)
  // console.log(req.payload)
    // console.log("request: ", req.user)

    // try{
    //     const receivedToken = req.user.user.token;
    //     console.log("token: ", receivedToken)
    //     const decoded = jwt.verify(receivedToken, secretKey);
    //     console.log(decoded);

    // }catch (err){
    //     console.log('token check error!!');
    // }
res.redirect('/')



});


app.get('/', (req, res) => {
    console.log('/');
    res.redirect('/home');

});


// router setting START
const homeRouter = require('./routes/homeRouter');
app.use('/home', homeRouter);

const userRouter = require('./routes/userRouter');
app.use('/user', userRouter);

const adminRouter = require('./routes/adminRouter');
app.use('/admin', adminRouter);

const bookRouter = require('./routes/bookRouter');
app.use('/book', bookRouter);

const libraryRouter = require('./routes/libraryRouter');
app.use('/library', libraryRouter);

const apiRouter = require('./routes/apiRouter');
app.use('/api/library', apiRouter);

const eventRouter = require('./routes/eventRouter');
app.use('/event', eventRouter);

const statRouter = require('./routes/statRouter');
app.use('/stat', statRouter);

app.listen(3000);