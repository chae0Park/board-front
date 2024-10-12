const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const cors = require('cors');
const app = express();
const path = require('path'); //로컬 서버 사용을 위해path 임포트
const PORT = 5000;
const mongoose = require('mongoose');
const User = require('./model/User'); // User 모델 임포트
const {Post,Comment,Reply} = require('./model/Post'); // Post 모델 임포트 
const upload = require('./middleware/upload');
const { SourceTextModule } = require('vm');
const { v4: uuidv4 } = require('uuid');

//토큰 검증 시 사용되는 사인 혹은 도장임. - 위에 JWT_SECRET 명시해뒀음  
//const JWT_SECRET = 'your_jwt_secret'; .env 파일을 만들어서 더 안전하게 보관할 예정

app.use(cors());
app.use(express.json());

// 서버에서 uploads 폴더를 정적으로 제공 - 클라이언트가 접근하여 파일을 가져올 수 있도록 함 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/your_db_name', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register Route - http://localhost:5000/api/register
app.post('/api/register', async (req, res) => {
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
    //토큰생성: jwt.sign(payload, secret, options)
    const token = jwt.sign({ id: user._id, email: user.email, nickname: user.nickname, profileImage: user.profileImage }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, nickname: user.nickname, email: user.email, profileImage: user.profileImage } });
});

// Middleware to check for token (for protected routes)
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {//토큰검증: 클라이언트가 보낸 JWT의 유효성 확인 - 시크릿코드 서명확인해서 변조 유무 체크
        const user = jwt.verify(token, jwtSecret);
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


//also works now, async/await 이용
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



//==================================================================


//try-catch 문으로 만든 버전, 위에꺼 작동안하면 이서 사용하면됨
app.post('/api/post', upload.array('files', 5), async (req, res) => {
    console.log("post got called!!!")
    try {

        if(!req.headers.authorization){
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
        

        // Decode JWT to get the user info (assuming token is in authorization header)
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const userNickname = decoded.nickname; // Assuming 'nickname' is in the JWT payload
        const profileImage = decoded.profileImage; //newly added
        const userId = decoded.id; // Assuming 'id' is in the JWT payload

        const { title, content } = req.body;
        // Get the uploaded file paths
        const filePaths = req.files.map(file => file.path);

        // Create a new post with the logged-in user's nickname and file paths
        const newPost = new Post({
            title,
            content,
            author: userNickname,
            profileImage: profileImage,
            userId, // Include userId
            createdAt: Date.now(),
            files: filePaths // Store file paths in the post
        });

        // Save the post
        const savedPost = await newPost.save();

        // Console log the unique post ID
        console.log('New Post ID:', savedPost.post_id); // 또는 savedPost._id로 Mongoose의 기본 ID 확인 가능
        console.log('Comment ID:', savedPost.comment_id);
        console.log('Reply ID:', savedPost.reply_id);
        res.status(201).json(savedPost);
        
    } catch (error) {
        // Return an appropriate error message
        console.error('Error occurred while creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});


//게시글 list 조회-  + paging 처리 
app.get('/api/post', async (req, res) => {
    console.log('요청 받은 페이지:',req.query.page);
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 3;
    //const skip = (page - 1)*limit;
    const skip = page * limit;

    try{
        const posts = await Post.find().skip(skip).limit(limit);
        const totalPosts = await Post.countDocuments();

        res.json({
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
        });

        console.log("posts",posts);

    } catch(error){
        res.status(500).json({ message: '게시글을 불러오는 중 오류 발생'});
    }
});

// skip() 때문에 버그 걸릴 때 
// app.get('/api/post', async (req, res) => {
//     const lastId = req.query.last_id; // 클라이언트에서 last_id를 쿼리 파라미터로 받음
//     const limit = parseInt(req.query.limit) || 3;

//     try {
//         let posts;
//         if (lastId) {
//             // last_id가 제공된 경우 그 이후의 문서를 가져옴
//             posts = await Post.find({ _id: { $gt: lastId } }).limit(limit);
//         } else {
//             // last_id가 없으면 처음부터 가져옴
//             posts = await Post.find().limit(limit);
//         }

//         const totalPosts = await Post.countDocuments();

//         res.json({
//             posts,
//             totalPosts,
//             totalPages: Math.ceil(totalPosts / limit),
//         });

//     } catch (error) {
//         res.status(500).json({ message: '게시글을 불러오는 중 오류 발생' });
//     }
// });



//게시물(특정)get /api/post/:id
app.get('/api/post/:id', async(req,res) => {
    console.log("특정 게시물 get 요청 들어옴!!!!!!")
    const { id } = req.params;
    console.log("Request params:", req.params);

    try {
        const post = await Post.findById(id).populate('userId'); // userId를 참조하는 경우 populate 사용
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.json(post);
    } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
        res.status(500).json({ message: '게시글을 불러오는 중 오류 발생.' });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
