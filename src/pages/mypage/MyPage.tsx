import React, { useState ,useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, uploadProfileImage } from '../../features/authSlice';
import { fetchMyPosts } from '../../features/postSlice';
import default_user from '../../assets/image/user-1699635_1280.png';
import Post from '../../component/Post';
import './MyPage.css';
import { AppDispatch, RootState } from '@/app/store';
import { Post as PostType } from 'types/PostType'; // Post 타입을 가져옵니다.

const MyPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [nav, setNav] = useState<string>('post'); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, userFetched } = useSelector((state: RootState) => state.auth);
    const { myPosts, postsWithComments, likedPosts } = useSelector((state: RootState) => ({
        myPosts: state.posts.myPosts,
        postsWithComments: state.posts.postsWithComments,
        likedPosts: state.posts.likedPosts,
    }));
    


    // 사용자 정보를 가져오는 액션 호출
    useEffect(() => {
        if (user && !userFetched) {
            dispatch(fetchUserProfile(user.id)); 
        }

    }, [dispatch, user, userFetched]);
  
    //유저 프로필 사진 변경 
    const handleFileChange = (event:React.ChangeEvent<HTMLInputElement> ) => {
        // const file = event.target.files[0];
        let file: File | null = null; // file 변수를 null로 초기화
        if(event.target.files && event.target.files.length > 0){
            file = event.target.files[0]
        }
        if(file && user){
            dispatch(uploadProfileImage(file, user.id))
        }
    };
    
    // profileImage 클릭으로 input 트리거 
    const handleProfileClick = () => {
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    };


    //nav
    const handleSelect = (selection: string) => {
        setNav(selection);
        console.log('선택된 nav 키는?',selection);
    }

    //유저가 작성한 게시글 가지고 오기  - post 
    useEffect(() => {   
        if(user && userFetched){ // userFetched가 true일 때만 호출
            dispatch(fetchMyPosts(user.id));
        }  
    }, [dispatch, user, userFetched]);



    if (!user) {
        return <div>Loading...</div>; // 사용자 정보가 로드 중일 때 표시할 메시지
    }

    return (
        <div className='MyPage'>
            {/* <h2 className='MyPage-title'>My Page</h2> */}
            <div className='MyPage-userInfo'>
                <div> 
                    <img 
                        src={user.profileImage || default_user } 
                        alt="Profile" 
                        onClick={handleProfileClick} 
                        style={{ width: '100px', height: '100px', borderRadius: '100%', cursor: 'pointer'  }} 
                    />
                </div>
                <div>
                    <h4 className='MyPage-nickname'>welcome, {user.nickname}</h4>
                    <p className='MyPage-email'>{user.email}</p>
                </div>
                <div className='MyPage-navbar'>
                    <p 
                        onClick={() => handleSelect('post')}
                        className={nav === 'post' ? 'active' : ''}
                    >
                        post
                    </p>
                    <p 
                        onClick={() => handleSelect('comment')}
                        className={nav === 'comment' ? 'active' : ''}
                    >
                        comment
                    </p>
                    <p 
                        onClick={() => handleSelect('like')}
                        className={nav === 'like' ? 'active' : ''}
                    >
                        like
                    </p>
                    <p><Link to={'/write'} style={{textDecoration:'none', color:'black'}}>create post</Link></p>
                </div>
            </div>

            {/* 프로필 이미지 업데이트  */}
            <input 
                type="file" 
                name="file"
                accept="image/*" ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} // input 요소 숨기기
            />
            {/*유저가 작성한 게시물 */}
            <div className='user-contents'>
            {nav === 'post' && myPosts.length > 0 && (
                myPosts.map(post => (
                    <Post key={post._id} post={post} />
                ))
            )}
            </div>     

            {/*유저가 댓글 단 게시물 */}
            <div className='user-contents'>
            {nav === 'comment' && (postsWithComments && postsWithComments.length > 0) && (
                postsWithComments.map(post => (
                    <Post key={post._id} post={post} />
                ))
            )}
            </div>   

            {/*유저가 좋아요한 게시물 */}
            <div className='user-contents'>
            {nav === 'like' && (likedPosts && likedPosts.length > 0) && (
                likedPosts.map(post => (
                    <Post key={post._id} post={post} />
                ))
            )}
            </div>   
        </div>
    );
};

export default MyPage;
