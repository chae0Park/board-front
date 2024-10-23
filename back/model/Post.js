const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);// id


// Post 모델 정의
const postSchema = new mongoose.Schema({
    post_id: { type: Number, unique: true }, // 자동 증가 필드
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User 모델과 연결
    profileImage: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, // 작성자 이메일 또는 닉네임
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }, // 추가된 수정일자 필드
    files: [{ type: String }], // 업로드된 파일 경로 배열
    views: { type:Number, default:0 }, //조회수
    like: { type:Number, default:0 }, //좋아요
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 좋아요를 누른 사용자 ID 배열
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // 댓글 참조
});


// 각각의 스키마에 대해 AutoIncrement 플러그인 설정
postSchema.plugin(AutoIncrement, { inc_field: 'post_id' });


//Post 모델 생성 
const Post = mongoose.model('Post', postSchema); 

module.exports = Post ; // Post 모델 내보내기
