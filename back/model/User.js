const mongoose = require('mongoose');

// User 스키마 정의
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    telNumber: { type: String },
    address: { type: String },
    addressDetail: { type: String },
    agreedPersonal: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema); // User 모델 생성

module.exports = User; // User 모델 내보내기
