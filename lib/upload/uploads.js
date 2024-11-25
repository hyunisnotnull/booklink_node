const multer = require('multer');

const uploads = {

    UPLOAD_EVENT_IMAGES_MIDDLEWARE: () => {
        const upload = multer({
            storage: multer.memoryStorage(),  // 파일을 메모리에 저장
            limits: {
                fileSize: 1024 * 1024 * 5, // 파일 크기 제한 (5MB)
            },
        });

        return upload.single('event_image');
    },

}

module.exports = uploads;