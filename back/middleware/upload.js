// back/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//절대 경로 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads');

        // 폴더가 없으면 생성
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
