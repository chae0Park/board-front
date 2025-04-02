const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
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
const SearchFrequency = require('./model/SearchFrequency');
const upload = require('./middleware/upload');

//Middleware setup
app.use(cors({
    origin: 'http://localhost:3000',  // 클라이언트의 URL
    credentials: true  // 쿠키를 허용하려면 credentials 옵션을 true로 설정
}));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({
    secret: 'My_Secr3t_Cod3_0202_QuEEn',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 } // 10분
}));
// 세션 만료 체크 미들웨어 추가
const sessionTimeout = 10 * 60 * 1000; // 10분

app.use((req, res, next) => {
    if (req.session.user) {
        const currentTime = Date.now();
        if (currentTime - req.session.lastActivity > sessionTimeout) {
            req.session.destroy(); // 세션 만료, 세션 삭제
            return res.status(401).json({ message: 'Session expired' });
        }
        req.session.lastActivity = currentTime; // 세션 활동 시간 갱신
    }
    next();
});

// 서버에서 uploads 폴더를 정적으로 제공 - 클라이언트가 접근하여 파일을 가져올 수 있도록 함 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/your_db_name', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register Route - http://localhost:5000/api/register
app.post('/api/register', async (req, res) => {
    const {
            email, 
            password, 
            nickname, 
            telNumber, 
            address, 
            addressDetail, 
            agreedPersonal, 
            profileImage, 
        } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    const existingNickname = await User.findOne({ nickname });
    const existingTelNum = await User.findOne({ telNumber });

    if (existingUser) {
        return res.status(400).json({ message: '이메일이 이미 존재합니다.' });
    }
    if (existingNickname) {
        return res.status(400).json({ message: '닉네임이 이미 존재합니다.' });
    }
    if (existingTelNum) {
        return res.status(400).json({ message: '전화번호가 이미 존재합니다.' });
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
        }
    );
   
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

     // 액세스 토큰 생성: 짧은 만료 시간 (예: 1시간)
     const accessToken = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            nickname: user.nickname, 
            profileImage: user.profileImage 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '5m' }  // 1시간 후 만료
    );
    console.log("로그인 할 때 만든 accessToken", accessToken);

    // 리프레시 토큰 생성: 긴 만료 시간 (예: 7일)
    const refreshToken = jwt.sign(
        { 
            id: user._id, 
            email: user.email 
        }, 
        process.env.REFRESH_TOKEN_SECRET,  // 리프레시 토큰 전용 비밀 키
        { expiresIn: '7d' }  // 7일 후 만료
    );
    console.log("로그인 할 때 만든 refreshToken", refreshToken);


    //req.session에 사용자 id 저장
    req.session.user = user._id;; //사용자 아이디
    req.session.lastActivity = Date.now(); // 마지막 사용시간 

    // 리프레시 토큰을 HTTP-only 쿠키로 설정
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    

    return res.status(200).json({ 
        token: accessToken, //클라이언트에게 accessToken을 전달
        user: { 
            id: user._id, 
            nickname: user.nickname, 
            email: user.email, 
            profileImage: user.profileImage 
        } 
    });
});

// Middleware
const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    console.log('authenticateToken - Token in header:', token);

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const refreshToken = req.cookies.refreshToken;
                    console.log('authenticateToken 함수에서 가져온 refreshToken', refreshToken);
                    if (!refreshToken) {
                        return res.status(403).json({ message: 'no refreshToken exists' });
                    }

                    // 리프레시 토큰을 검증하고 새 액세스 토큰 발급
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshUser) => {
                        if (refreshErr) {
                            req.session.destroy((err) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Failed to end session' });
                                }
                                // 세션 쿠키 삭제
                                res.clearCookie('connect.sid'); 
                            return res.status(403).json({ message: 'Invalid refresh token' });
                            });
                        }

                        // 새 액세스 토큰 발급
                        const newAccessToken = jwt.sign(
                            { id: refreshUser.id, email: refreshUser.email },
                            process.env.JWT_SECRET,
                            { expiresIn: '15m' }
                        );

                        console.log('newAccessToken', newAccessToken);

                        jwt.verify(newAccessToken, process.env.JWT_SECRET, (newAccessTokenErr, user) => {
                            if (newAccessTokenErr) {
                                // 새 액세스 토큰이 유효하지 않다면
                                return res.status(403).json({ message: 'Invalid new access token' });
                            }

                            req.user = user;
                            console.log('req.user: ', req.user);
                            next();
                        });
                    });
                } else {
                    return res.status(403).json({ message: 'Invalid token' });
                }
            } else {
                req.user = user; //? 왜 undefiend 로 찍혀나오는 걸까?
                next(); 
            }
        });
    } catch (err) {
        console.error('Token validation error:', error);
        res.status(403).json({ message: 'Invalid token' }); 
    }
};


// const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Access denied' });

//     try {//토큰검증: 클라이언트가 보낸 JWT의 유효성 확인 - 시크릿코드 서명확인해서 변조 유무 체크
//         // const user = jwt.verify(token, jwtSecret);
//         jwt.verify(token, jwtSecret, (err, user) => {
//             if (err) {
//                 // 만료된 토큰인 경우
//                 if (err.name === 'TokenExpiredError') {
//                     return res.status(401).json({ message: 'Token expired' });
//                 }
//                 return res.status(403).json({ message: 'Invalid token' });
//             }
//         req.user = user;
//         next();
//         });
//     } catch (error) {
//         console.error('authenticateToken-Token validation error:', error);
//         res.status(403).json({ message: 'Invalid token' });
//     }
// };


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



app.put('/api/users/:id', authenticateToken, upload.single('profileImage'), async (req, res) => {
    const userId = req.user.id; 
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


//accessToken 을 삭제하는 방식으로 로그아웃 진행 
// Protected Route for Logout (or other secured actions)
app.post('/api/logout', authenticateToken, (req, res) => {
    console.log("로그아웃 성공적으로 호출");
    req.session.destroy(); //clear session
    res.status(200).json({ message: 'Logged out successfully' });
});



//post method==================================================================

app.post('/api/post',authenticateToken, upload.array('files', 5), async (req, res) => {
    try {
        const userId = req.user.id; 

        const { title, content } = req.body;
        const filePaths = req.files.map(file => `/uploads/${file.filename}`);

        //user의 최신 프로필 사진 반영
        const user = await User.findById(userId); // userId를 사용하여 현재 유저 정보를 조회
        const profileImage = user.profileImage; // 최신 프로필 이미지를 가져오기

        // Create a new post with the logged-in user's nickname and file paths
        const newPost = new Post({
            title,
            content,
            author: user.nickname, // 여전히 nickname을 사용
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

//전체 posts데이터 불러오기 - 주간 3 게시물을 불러오긴 위한 api
app.get('/api/posts/all', async (req, res) => {
    try {
        const posts = await Post.find()
        .populate('userId', 'profileImage'); 

        posts.forEach(post => {
            post.profileImage = post.userId.profileImage;
            post.userId = undefined; // delete userId to not include in res
        })

        res.json(posts); // 모든 게시글을 반환
    } catch (error) {
        res.status(500).json({ message: '게시글을 불러오는 중 오류 발생' });
    }
});

//게시글 list 조회-  + paging 처리 
app.get('/api/post', async (req, res) => {
    //console.log('요청 받은 페이지:',req.query.page);
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const skip = page * limit;

    try{
        const posts = await Post.find()
        .populate('userId', 'profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        posts.forEach(post => {
            post.profileImage = post.userId.profileImage;
            post.userId = undefined; // delete userId to not include in res
        });

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


//필터링 작업이 더해진 게시물 조회
app.get('/api/posts/search', async (req, res) => {
    console.log('포스트 서치 api 호출❤️');
    try{const { query, option, userId, date } = req.query; 
        const filters = {};
    console.log('클라이언트에서 받은값', {query, option, userId, date});

        if (query) {
            //검색어의 빈도수 증가
            const freq = await SearchFrequency.findOne({ term: query });
            if(freq){
                freq.count++
                await freq.save();
            }else{
                const newFreq = new SearchFrequency({term: query, count: 1});
                await newFreq.save();
            }

            const regexFilter = { $regex: query, $options: 'i' }; 

            if (option === 'all') {
                filters.$or = [
                    { title: regexFilter },
                    { content: regexFilter },
                    { author: regexFilter }
                ];
            } else {
                filters[option] = regexFilter;
            }
        }

        if (userId) {
            filters.userId = userId;
        }

        //댓글이 달린 게시물 가져오기 
        const comments = userId ? await Comment.find({ userId }) : [];
        const commentedPostIds = comments.map(comment => comment.postId); // 코맨트가 가지고 있는 포스트 아이디 들을 추출해냄
        const postsWithComments = await Post.find({ _id: {$in: commentedPostIds } })
            .populate('userId', 'profileImage');
            
            postsWithComments.forEach(postWithComments => postWithComments.profileImage = postWithComments.userId.profileImage);

        //좋아요를 누른 게시물가져오기 
        const likedPosts = userId ? await Post.find({ likedBy : userId })
            .populate('userId', 'profileImage')
        : [];
        
        if(likedPosts.length > 0){
            likedPosts.forEach(likedPost => likedPost.profileImage = likedPost.userId.profileImage);
        }


        if (date) {
            filters.date = { $gte: new Date(date) };
        }
        //필터에 따른 게시물 가져오기 
        const posts = await Post.find(filters)
        .populate('userId', 'profileImage');

        posts.forEach(post =>  post.profileImage = post.userId.profileImage );
        
        console.log('query값:', query);
        res.json({posts, query, postsWithComments, likedPosts});
        
    } catch (error) {
        res.status(500).json({ message: 'Interna server error' });
    }
    
});

//인기검색어
app.get('/api/search-frequencies', async (req, res) => {
    try {
//count기준으로 내림차 순 정렬하고 9개만 가지고 오면서 term만 선택
        const frequencies = await SearchFrequency.find({}, {term: 1, _id: 1 })
		.sort({ count: -1 })
		.limit(9);
        res.json(frequencies);
    } catch (error) {
        console.error('Error fetching search frequencies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// 상세 게시물
app.get('/api/post/:id', async(req,res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'userId', // 댓글의 작성자 정보도 함께 가져옴
                    select: 'profileImage nickname' // 필요한 필드만 선택
                }
            })
            .populate('userId', 'profileImage'); 

            post.profileImage = post.userId.profileImage;

        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
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
app.post('/api/comment/:postId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
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
        const comments = await Comment.find({ postId, parentId: null })
            .populate('userId', 'profileImage');

            comments.forEach(comment => comment.profileImage = comment.userId.profileImage);

        const replies = await Comment.find({ postId, parentId: { $ne: null} })
            .populate('userId', 'profileImage');

            replies.forEach(reply => reply.profileImage = reply.userId.profileImage);

        //부모 댓글에 대댓글 추가 
        const commentsWithReplies = comments.map(comment => ({
            ...comment.toObject(),
            replies: replies.filter(reply => reply.parentId.toString() === comment._id.toString())
        }));

        // console.log('댓글과 대댓글의 생김새,', commentsWithReplies);

        res.status(200).json(commentsWithReplies);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
