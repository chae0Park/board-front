import React, { useState ,useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, uploadProfileImage } from '../../features/authSlice';
import { fetchMyPosts } from '../../features/postSlice';
import default_user from '../../assets/image/user-1699635_1280.png';
import Post from '../../component/Post';
import './MyPage.css';

const MyPage = () => {
    const dispatch = useDispatch();
    const [nav, setNav] = useState('post'); // 디폴트를 post로 세팅하고 코멘트 라이크 누를 때 바뀌게
    const fileInputRef = useRef(null);
    const { user } = useSelector(state => state.auth); // Redux 상태에서 사용자 정보 가져오기
    const { myPosts } = useSelector(state => state.posts);


    // 사용자 정보를 가져오는 액션 호출
    useEffect(() => {
        if (user) {
            dispatch(fetchUserProfile(user.id)); 
        }

    }, [dispatch, user]);
  
    //유저 프로필 사진 변경 
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            dispatch(uploadProfileImage(file, user.id))
        }
    };
    // profileImage 클릭으로 input 트리거 
    const handleProfileClick = () => {
        fileInputRef.current.click(); 
    };


    //처음 앱 실행 후 현재 페이지에 맞는 data 가져오는 식 
    useEffect(() => {   
        dispatch(fetchMyPosts(user.id));
    }, [dispatch, user.id]);






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

                        style={{ width: '100px', height: '100px', borderRadius: '100%', cursor: 'pointer'  }} />
                </div>
                <div>
                    <h4 className='MyPage-nickname'>welcome, {user.nickname}</h4>
                    <p className='MyPage-email'>{user.email}</p>
                    {/* <p>{user.id}</p> */}
                </div>
                <div className='MyPage-navbar'>
                    <p>post</p>
                    <p>comment</p>
                    <p>like</p>
                    <p><Link to={'/write'} style={{textDecoration:'none', color:'black'}}>create post</Link></p>
                </div>
            </div>

            {/* 프로필 이미지 업데이트  */}
            <input 
                type="file" 
                accept="image/*" ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} // input 요소 숨기기
            />
            {/*유저가 작성한 게시물 */}
            <div className='user-contents'>
            {myPosts.length > 0 ? (
                myPosts.map(post => (
                    <Post key={post._id} post={post} />
                ))
            ) : (
                <p>게시물이 없습니다.</p>
            )}
            </div>     
        </div>
    );
};

export default MyPage;
