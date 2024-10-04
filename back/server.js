const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const path = require('path'); //로컬 서버 사용을 위해path 임포트
const PORT = 5000;
const mongoose = require('mongoose');
const User = require('./model/User'); // User 모델 임포트
const upload = require('./middleware/upload');

//const users = []; // Temporary storage for user data
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// 서버에서 uploads 폴더를 정적으로 제공 - 클라이언트가 접근하여 파일을 가져올 수 있도록 함 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/your_db_name', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register Route
app.post('/api/register', async (req, res) => {
    //const { name, email, password } = req.body;
    const {email, password, nickname, telNumber, address, addressDetail, agreedPersonal, profileImage } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    const existingTelNum = await User.findOne({ telNumber });
    if (existingUser || existingTelNum) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(
        { 
            email, 
            password: hashedPassword, 
            nickname, 
            telNumber, 
            address, 
            addressDetail, 
            agreedPersonal,
            profileImage: null
        });
   
    await newUser.save(); // MongoDB에 사용자 저장

    res.status(201).json({ message: 'Registration successful' });
});


// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; //사용자가 이메일과 비번으로 req를 보냄

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, nickname: user.nickname, profileImage: user.profileImage }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, nickname: user.nickname, email: user.email, profileImage: user.profileImage } });
});

// Middleware to check for token (for protected routes)
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// User Profile Route (GET)
app.get('/api/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id; // URL 파라미터에서 사용자 ID 가져오기

    try {
        const user = await User.findById(userId).select('-password'); // 비밀번호 제외하고 사용자 정보 조회
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: { id: user._id, email: user.email, nickname: user.nickname, telNumber: user.telNumber, address: user.address, addressDetail: user.addressDetail, profileImage: user.profileImage } });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error });
    }
});


//doesn't work 
app.put('/api/users/:id', authenticateToken, upload.single('profileImage'), async (req, res) => {
    const userId = req.user.id; // JWT에서 복호화된 사용자 ID
    const newProfileImage = req.file ? `/uploads/${req.file.filename}` : null; // 업로드된 파일이 있으면 경로 설정

    try {

        const existingUser = await User.findById(userId); // then과 마찬가지로 이 Promise객체가 결과 값을 생성해서 반환할 때 까지 코드 멈춤 
        if(!existingUser){
            return res.status(200).json({message: '그런유저 없는데용..'});
        }
        //반대로 있을 때
        const updatedUser = await User.findByIdAndUpdate( // 여기적힌 코드를 실행햇 Promise 객체에 결과 담기전까지 await-> 딴짓금지
            userId,// 이걸로 찾고 
            { profileImage: newProfileImage }, // 업데이트할 필드
            { new: true } // 업데이트 후 새 문서 반환
        );
        //update된 유저가 없을 때 
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

    console.log('Updated user:', updatedUser); // 추가
    res.status(200).json({ message: 'Profile image updated successfully', profileImage: updatedUser.profileImage });
    } catch (error) {
        console.error('Error in PUT route:', error); // 수정
        res.status(500).json({ message: 'Error uploading profile image', error });
    } 
});


//this one works
// app.put('/api/users/:id', authenticateToken, upload.single('profileImage'), (req, res) => {
//     console.log('PUT request received for user ID:', req.params.id); // 요청이 들어왔는지 확인

//     // req.user에서 사용자 ID 가져오기
//     const userId = req.user.id; // JWT에서 복호화된 사용자 ID
//     const newProfileImage = req.file ? `/uploads/${req.file.filename}` : null; // 업로드된 파일이 있으면 경로 설정

//     // 로그 추가
//     console.log('가지고 온 userId', userId)
//     console.log('Form Data:', req.file); // 업로드된 파일 정보
    

//     // 사용자 ID로 사용자 찾기
//     User.findById(userId)
//         .then(existingUser => {
//             if (!existingUser) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // 사용자 정보가 존재하는 경우 프로필 이미지 업데이트
//             return User.findByIdAndUpdate(userId, { profileImage: newProfileImage }, { new: true });
//         })
//         .then(updatedUser => {
//             console.log('Updated user:', updatedUser); // 추가
//             res.status(200).json({ message: 'Profile image updated successfully', profileImage: updatedUser.profileImage });
//         })
//         .catch(error => {
//             console.error('Error in PUT route:', error); // 수정
//             res.status(500).json({ message: 'Error uploading profile image', error });
//         });
// });





// Protected Route for Logout (or other secured actions)
app.post('/api/logout', authenticateToken, (req, res) => {
    // Clear token logic could be handled on client side.
    res.status(200).json({ message: 'Logged out successfully' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
