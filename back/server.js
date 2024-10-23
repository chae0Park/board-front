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
const Post = require('./model/Post'); // Post 모델 임포트 
const Comment = require('./model/Comment');// Comment 모델 임포트
const upload = require('./middleware/upload');
//const { SourceTextModule } = require('vm');
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

//jwt 연장 시간 늘리기
app.post('/api/extend-session', authenticateToken, (req, res) => {
    // Create a new token with the same payload
    const token = jwt.sign(
        { id: req.user._id, email: req.user.email, nickname: req.user.nickname, profileImage: req.user.profileImage }, 
        jwtSecret, 
        { expiresIn: '1h' }
    );
    res.status(200).json({ token });
});

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



//post method==================================================================
//글 작성 하기 전, 로그인 한 유저만  글 쓸 수 있게 authentication 처리 
app.post('/api/post', upload.array('files', 5), async (req, res) => {
    console.log("post got called!!!");
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        // Decode JWT to get the user info
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.id; // Assuming 'id' is in the JWT payload

        const { title, content } = req.body;
        // Get the uploaded file paths
        //const filePaths = req.files.map(file => file.path);
        const filePaths = req.files.map(file => `/uploads/${file.filename}`);

        // 최신 프로필 이미지를 가져오기
        const user = await User.findById(userId); // userId를 사용하여 현재 유저 정보를 조회
        const profileImage = user.profileImage; // 최신 프로필 이미지를 가져오기

        // Create a new post with the logged-in user's nickname and file paths
        const newPost = new Post({
            title,
            content,
            author: decoded.nickname, // 여전히 nickname을 사용
            profileImage: profileImage, // 최신 프로필 이미지 사용
            userId, // Include userId
            createdAt: Date.now(),
            files: filePaths, // Store file paths in the post
            comments: [] // 빈 배열로 초기화
        });

        // Save the post
        const savedPost = await newPost.save();

        res.status(201).json(savedPost);

    } catch (error) {
        // Return an appropriate error message
        console.error('Error occurred while creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});







//게시글 list 조회-  + paging 처리 
app.get('/api/post', async (req, res) => {
    //console.log('요청 받은 페이지:',req.query.page);
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

        //console.log("posts",posts);

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



//게시물(상세 조회)
app.get('/api/post/:id', async(req,res) => {
    //console.log("특정 게시물 get 요청 들어옴!!!!!!")
    const { id } = req.params;
    //console.log("Request params:", req.params);

    try {
        const post = await Post.findById(id)
            .populate('userId') // userId를 참조하는 경우 populate 사용
            .populate('comments');
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        // console.log("post값- 이미지 주소 잘보기",post);
        res.json(post);
    } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
        res.status(500).json({ message: '게시글을 불러오는 중 오류 발생.' });
    }
});


// 게시물 조회수 증가
app.get('/api/posts/:id/view', async (req, res) => {
    const { id } = req.params;
    try {
        // 조회수 증가
        const post = await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        // 증가된 조회수 반환
        res.json({ views: post.views });
    } catch (error) {
        console.error('조회수 증가 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});


//좋아요 - 로그인 한 유저만 가능, 유저 당 게시물 한개만 좋아요 가능
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
    console.log('좋아요 api콜 요청! :', req.params.id);
    const { id } = req.params;
    const userId = req.user.id; // post에 쓰인 유저의 정보를 가지고 올 때는 _id이지만 유저 객체 자체의 아이디는 .id로 가지고 옴
    console.log('Authenticated User ID:', userId); // 인증된 사용자 ID 로그

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        if (post.likedBy.includes(userId)) {
            // 사용자가 이미 좋아요를 눌렀다면, 좋아요 취소
            post.like -= 1; // 좋아요 수 감소
            post.likedBy.pull(userId); // 사용자 ID 제거
        } else {
            // 사용자가 좋아요를 누르지 않았다면, 좋아요 추가
            post.like += 1; // 좋아요 수 증가
            post.likedBy.push(userId); // 사용자 ID 추가
        }

        await post.save();
        res.json({ like: post.like });
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});




//게시글 수정
app.put('/api/post/:id', upload.array('files', 5), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const files = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  try {
        const updatedData = { title, content, files, updatedAt: new Date() };
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: updatedData }, 
            { new: true }
        );

        if (!updatedPost) return res.status(404).json({ message: '게시글을 찾을 수 없음.' });
        res.json(updatedPost);
    } catch (error) {
        console.error('게시글 수정 중 오류 발생:', error); 
        res.status(500).json({ message: '게시글 수정 중 오류 발생.' });
    }
});

// 게시글 삭제
app.delete('/api/post/:id', async (req, res) => {
    const { id } = req.params;
    console.log('삭제할 게시글 ID:', req.params.id); // 로그로 확인
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ message: '게시글을 찾을 수 없음.' });
        res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '게시글 삭제 중 오류 발생.' });
    }
});



//댓글===========================================================================
// 댓글 작성
app.post('/api/comment/:postId', async (req, res) => {
    console.log("comment got called!!!");
    try {
        // Authorization 헤더 확인
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        // JWT 디코드하여 사용자 정보 얻기
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.id; // JWT 페이로드에서 'id' 가져오기

        // 게시글 ID와 댓글 내용을 받아옴
        const { content, parentId } = req.body; 
        const postId = req.params.postId; // URL에서 게시글 ID 가져오기

        // 사용자 정보를 조회하여 프로필 이미지와 닉네임 가져오기
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const profileImage = user.profileImage; // 최신 프로필 이미지
        const nickname = user.nickname; // 사용자의 닉네임

        // 댓글 또는 대댓글 생성
        const newComment = new Comment({
            content,
            author: nickname, // 닉네임
            profileImage, // 프로필 이미지
            userId, // 댓글 작성자 ID
            postId, // 게시글 ID
            createdAt: Date.now(), // 작성일자
            parentId: parentId || null
        });

        // 댓글 저장
        const savedComment = await newComment.save();
        console.log('Saved Comment:', savedComment);

        // 포스트에 댓글 ID 추가
        await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });

        //댓글 수 증가 
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

        res.status(201).json(savedComment);

    } catch (error) {
        // 에러 메시지 반환
        console.error('Error occurred while creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});


//작성된 댓글을 받아오는 api 
app.get('/api/comments/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId, parentId: null });
        const replies = await Comment.find({ postId, parentId: { $ne: null} });

        //부모 댓글에 대댓글 추가 
        const commentsWithReplies = comments.map(comment => ({
            ...comment.toObject(),
            replies: replies.filter(reply => reply.parentId.toString() === comment._id.toString())
        }));
        res.status(200).json(commentsWithReplies);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
