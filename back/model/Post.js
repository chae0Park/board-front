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
    //comments: [commentSchema], // 댓글 배열
    files: [{ type: String }], // 업로드된 파일 경로 배열
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // 댓글 참조
});

const commentSchema = new mongoose.Schema({
    //comment_id: { type: Number, unique: true }, // 자동 증가 필드
    profileImage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User 모델과 연결
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // 포스트 참조
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }
});

const replySchema = new mongoose.Schema({
    //reply_id: { type: Number, unique: true }, // 자동 증가 필드
    profileImage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User 모델과 연결
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } // 댓글 참조
});


// 각각의 스키마에 대해 AutoIncrement 플러그인 설정
postSchema.plugin(AutoIncrement, { inc_field: 'post_id' });
// commentSchema.plugin(AutoIncrement, { inc_field: 'comment_id' });
// replySchema.plugin(AutoIncrement, { inc_field: 'reply_id' });



//Post 모델 생성 
const Post = mongoose.model('Post', postSchema); 
const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);



module.exports = { Post, Comment, Reply }; // Post 모델 내보내기
