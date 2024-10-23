const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// 댓글 스키마
const commentSchema = new mongoose.Schema({
    commentId: { type: Number, unique: true }, // 자동 증가 필드
    profileImage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    like: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } // 부모 댓글 ID 

});

commentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


commentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment; // User 모델 내보내기


