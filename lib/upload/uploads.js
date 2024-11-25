const multer = require('multer');
const uuid4 = require('uuid4');
const path = require('path');
const fs = require('fs');

const uploads = {

    UPLOAD_EVENT_IMAGES_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.diskStorage({
                destination(req, file, done) {
                    let fileDir = `${process.env.MEMBER_PROFILE_PATH}${req.body.e_no}/`;
                    if (!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, { recursive: true });
                    }
                    done(null, fileDir);
                },
                filename(req, file, done) {
                    let uuid = uuid4();
                    let extName = path.extname(file.originalname);
                    let fileName = `${uuid}${extName}`;
                    done(null, fileName);
                }
            }),
            limits: {
                fileSize: 1024 * 1024 * 5, // 파일 크기 제한 (5MB)
            },
        });

        return upload.array('event_images', 5); // 'event_images' 필드에서 최대 5개 파일 업로드
    },

}

module.exports = uploads;