import { Link } from 'react-router-dom';
import React from 'react';
import './Post.css';

const Post = ({ post }) => {
    if (!post) {
        return null; // 게시글이 없는 경우 null 반환
    }
    const id = post._id;
    console.log("profilepic:",post.profileImage);
    const previewText = post.content.length > 70 
        ? post.content.slice(0, 70) + '...' // 글자 수가 초과할 경우 '...' 추가
        : post.content;
    return (
        <div className="Post-container">
        <div className='Post'>   
       
            <div className='Post-content'>         
                    <div className='Post-top'>
                        <div className='Post-img'><img src={post.profileImage} alt={post.author} /></div>
                        <div className='Post-user-info'> 
                            <div className='Post-id'>{post.author}</div>
                            {/* 일/월/년 순으로  */}
                            <div className='Post-date'>
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // 월을 약어로 표시
                                day: '2-digit'
                                })}
                            </div> 
                        </div>
                    </div>
                
                    <div className='Post-mid'>
                        <div className='Post-mid-title'>
                            <Link to={`/detail/${id}`}
                                style={{ textDecoration: "none", color: "black"}}
                            >
                                {post.title}
                            </Link>
                        </div> 
                        <div className='Post-mid-content'>{previewText}</div>
                    </div>

                    <div className='Post-btm'>
                        <div>댓글 0 ·</div>
                        <div>좋아요 0 ·</div>
                        <div>조회수 0</div>    
                    </div>
            </div> 
          
            

                    {/* 만약 게시물에 이미지가 있으면 미리보이도록 하기 
                    이미지 컨테이너를 미리 넣어준다 
                    */}
            {/* <div className='post-content-img'><img className='post-content-img-src' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShmrYrkdowb1COVNhgCF8id6juxqoU14v9AQ&s' alt='gelato'/></div> */}
        </div>
    </div>
    );
};

export default Post;