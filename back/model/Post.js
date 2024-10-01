const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);// id

// Post 모델 정의
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, // 작성자 이메일 또는 닉네임
    createdAt: { type: Date, default: Date.now },
    comments: [{
        content: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        replies: [{
            content: { type: String, required: true },
            author: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }]
    }],
    files: [{ type: String }] // 업로드된 파일 경로 배열
});

const Post = mongoose.model('Post', postSchema); // Post 모델 생성

// 자동으로 ID 증가 설정
postSchema.plugin(AutoIncrement, { inc_field: 'seq' });

module.exports = Post; // Post 모델 내보내기
