const nodemailer = require('nodemailer');


// SMTP 설정 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PW
    }
});



// 비밀번호 찾기 이메일 전송 함수
function sendPasswordResetEmail(userEmail, tempPassword) {
    const mailOptions = {
        from: process.env.GMAIL_ID,
        to: userEmail,
        subject: '[GoodBuy] 임시 비밀번호 안내입니다.',
        text: `임시 비밀번호는 ${tempPassword} 입니다. 로그인 후 비밀번호를 변경해 주세요.`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error while sending email:', error);
                reject(error);
            } else {
                console.log('Password reset email sent:', info.response);
                resolve(info.response);
            }
        });
    });
}

module.exports = {
    sendPasswordResetEmail
};