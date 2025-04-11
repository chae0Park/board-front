const multer = require('multer');
const dotenv = require('dotenv');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // v3에서의 클라이언트 및 명령어 사용
dotenv.config();

// S3 클라이언트 설정
const s3 = new S3Client({
    region: process.env.AWS_DEFAULT_REGION, // 원하는 리전 설정
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 최대 파일 크기 10MB
    },
 }).array('file', 5);


// 파일 업로드 처리 함수
const uploadToS3 = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const fileUrls = [];
        for (const file of req.files) {
            const params = {
                Bucket: 'chae-mern-board-project-images',
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            fileUrls.push(`https://${params.Bucket}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${params.Key}`);
        }

        req.files.forEach((file, index) => {
            file.s3Url = fileUrls[index];
        });
        
        next();
    } catch (err) {
        return res.status(500).send('Error uploading file: ' + err.message);
    }
  };
  
  // multer 업로드 미들웨어 내보내기
  module.exports = { upload, uploadToS3 };
