import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../footer/Footer';
import './Write.css';
import { fetchUserProfile } from '../../../features/authSlice';
import { addPost,fetchPosts } from '../../../features/postSlice';
import default_user from '../../../assets/image/user-1699635_1280.png'
import { useNavigate } from 'react-router-dom';
import { usePageContext } from '../../../app/PageContext';
import Modal from '../../../component/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 스타일 import


const Write = () => {
    //로그인한 사용자의 data가져옴 
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);  
    //게시물 내용을 저장함 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    //const [file, setFile] = useState(null);

    const [ modalOpen, setModalOpen ] = useState(true);
    const navigate = useNavigate();

    const { currentPage } = usePageContext();
    const postsPerPage = 3;
    // 날짜생성 
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`

    //로그인한 유저의 정보를 가져온다 
    useEffect(() => {
        if (user) {
            dispatch(fetchUserProfile(user.id)); // 사용자 정보를 가져오는 액션 호출
        }
    }, [dispatch, user]);

    const handleCloseModal = () => {
        setModalOpen(false); 
        navigate('/signIn');
    }
    
    //로그인 상태가 아니여서 user가 없을 때 
    if (!user) {
        return <div>{modalOpen && (<Modal  message={'글을 작성하려면 로그인이 필요합니다.'} onClose={handleCloseModal} />)}</div>

    }


    //게시물올리기 
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('프로필 이미지:', user.profilePicture); // 추가: 프로필 이미지 확인

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', user.nickname);
        formData.append('profilePicture', user.profilePicture); // 추가: 프로필 사진 URL

        // if (file && file.length > 0) {
        //     Array.from(file).forEach((fileItem) => formData.append('files', fileItem)); 
        // }

        dispatch(addPost(formData))
        
        .then((action) => {
            if (addPost.fulfilled.match(action)) {
                const newPost = action.payload; // 생성된 포스트 데이터
                console.log('새로 작성된 포스트:', newPost); // 콘솔에 출력
            }
            setTitle('');
            setContent('');      
            // setFile(null);
            dispatch(fetchPosts({ page: currentPage, postsPerPage }));
            navigate('/'); // 작성 후 페이지 이동
        })
        .catch((error) => {
            // Handle any errors (you can also update UI here)
            console.error('Failed to submit post:', error);
        });
        
    };

    
    

    return (
        <div>       
            <div className='Write'>
                <div className='write-title'>
                    <div className='write-title-input'>
                        <form onSubmit={handleSubmit}>
                            <input type='text' 
                                className='write-title-inputbox'
                                placeholder='제목을 입력해주세요'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                />
                            
                            
                            {/* 구분선 */}
                            <div className='detail-divide'></div>  


                                {/* <input 
                                className='write-file'  
                                type="file" multiple
                                onChange={(e) => setFile(e.target.files)} /> */}
                                <div className='w-detail-author-date'>{formattedDate}</div>

                                <ReactQuill                                
                                className="custom-quill"
                                style={{ position : "relative", top : "50px", height : "400px"}}
                                value={content}
                                onChange={setContent}
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        ['bold', 'italic', 'underline'],
                                        ['image', 'code-block'],
                                        ['clean']                                         
                                    ],
                                }}
                            />
                        <button type='submit' className='write-submit-btn'>게시하기</button>
                        </form>
                        
                    </div> 
                </div>

                <div className='write-detail-container1'>
                    <div className='write-detail-author-info'>
                        <div className='w-detail-author-profile'>
                            <img className='w-profileImg' src={user.profileImage || default_user } alt="Profile" />
                        </div>
                        <div className='w-detail-author-id'>{user.nickname}</div>
                        
                    </div>
                    
                    {/* <div className='w-detail-eidt-delete'>수정 | 삭제</div> */}
                </div>

                {/* files preview */} 
                {/* {file}
                <div className='detail-content-img'><img type='file' src='' alt=''/></div> */}
               
            </div>

            <Footer />
        </div>
    )       
}

export default Write;
