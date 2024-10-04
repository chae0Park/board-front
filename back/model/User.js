const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);// id

// User 스키마 정의
const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // 자동 증가 필드
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    telNumber: { type: String },
    address: { type: String },
    addressDetail: { type: String },
    agreedPersonal: { type: Boolean, default: false },
    profileImage: { type: String }, // 프로필 이미지 경로 필드 추가
});

// 자동으로 ID 증가 설정
userSchema.plugin(AutoIncrement, { inc_field: 'id' });

const User = mongoose.model('User', userSchema); // User 모델 생성
module.exports = User; // User 모델 내보내기
