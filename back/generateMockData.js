require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/User'); // 실제 유저 모델을 불러옵니다.
const Post = require('./model/Post'); // Post 모델을 불러옵니다.

// 예시로 새로운 유저 5명 생성하기
const generateMockUsers = async () => {
    const users = [];
    for (let i = 0; i < 5; i++) {
        const user = await User.create({
            email: `test${i}@test.com`,
            password: `!Testuser${i}`,
            nickname: `test${i}`,
            telNumber: `0${i}`,
            address: `0${i}`
        });
        users.push(user);
    }
    return users;
};

const getRandomDate = (startDate, endDate) => {
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

const generateMockPosts = async (users,num) => {
    const titles = [
        "A new way to think about development", 
        "Introduction to MongoDB", 
        "How to manage state in React", 
        "Understanding JavaScript closures", 
        "10 Tips for better coding practices"
    ];
    const content = [
        "This is a sample content for the post. It can contain markdown, HTML or plain text.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
        "Curabitur sit amet nisl at nunc congue lacinia. Sed nec bibendum lectus.",
        "Aliquam erat volutpat. Nulla facilisi. Etiam ut turpis eu elit consequat sollicitudin.",
        "Phasellus ullamcorper orci non suscipit pretium. Nam non velit ut ligula consectetur interdum."
    ];

    for (let i = 0; i < num; i++) {
        const user = users[i % users.length]; // 사용자 선택
        const post = new Post({
            userId: user._id,
            profileImage: user.profileImage,
            title: titles[i % titles.length],
            content: content[i % content.length],
            author: user.nickname,
            createdAt: getRandomDate(new Date(2023, 0, 1), new Date()), // 생성일은 2023년부터 현재까지의 임의의 날짜
            views: Math.floor(Math.random() * 1000), // 랜덤 조회수
            like: Math.floor(Math.random() * 100), // 랜덤 좋아요 수
            likedBy: [user._id], // 예시로 첫 번째 사용자만 좋아요를 누른 것으로 설정
            comments: [] // 댓글은 비워두기
        });

        try {
            await post.save();
            console.log(`Post ${i + 1} created`);
        } catch (err) {
            console.error('Error creating post:', err);
        }
    }
};

// 23개의 게시물 생성
const createMockData = async () => {
    try {
        // 1. 유저 생성
        const users = await generateMockUsers();

        // 2. 유저가 생성된 후, 게시물 생성
        await generateMockPosts(users, 23); // 23개의 게시물 생성
    } catch (error) {
        console.error('Error in generating mock data:', error);
    }
};

// 23개의 게시물을 생성합니다.
createMockData();
