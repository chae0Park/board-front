import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../board/footer/Footer';
import './Edit.css';
import { updatePost,fetchPostById } from '../../features/postSlice';
import default_user from '../../assets/image/user-1699635_1280.png';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 스타일 import



const Edit = () => {
    //로그인한 사용자의 data가져옴 
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth); 
    const post = useSelector((state) => state.posts.currentPost);
    //게시물의 id가져옴 
    const { id } = useParams();
    //게시물 내용을 저장함 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    //const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    
    //수정 이전에 올라간 멀티파일 삭제하기 
    //const [deleteFiles, setDeleteFiles] = useState([]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPostById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            //setFiles(post.files || []);             
        }
    }, [post]); 


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        //files.forEach(file => formData.append('files', file));
        formData.append('updatedAt', new Date()); 

        dispatch(updatePost({ id, formData })) 
            .then(() => {
                alert('게시글이 수정되었습니다.');
                return dispatch(fetchPostById(id));
            })
            .then(() => {
                navigate(`/detail/${id}`);
            })
            .catch((error) => {
                console.error('게시글 수정 중 오류 발생:', error);
            });
    };


    return (
        <div>       
            <div className='Edit'>
                <div className='Edit-title'>
                    <div className='Edit-title-input'>
                        
                            <input type='text' 
                                className='Edit-title-inputbox'
                                placeholder='제목을 입력해주세요'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                /> 
                            {/* 구분선 */}
                            <div className='detail-divide'></div>  
                                
                            {/* WYSIWYG 에디터 */}
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

                        <button type='submit' className='Edit-submit-btn' onClick={handleSubmit}>edit</button>
                        
                        
                    </div> 
                </div>

                <div className='Edit-detail-container1'>
                    <div className='Edit-detail-author-info'>
                        <div className='Edit-detail-author-profile'>
                            <img className='edit-profile-img' src={user.profileImage || default_user } alt="Profile" />
                        </div>
                        <div className='Edit-detail-author-id'>{user.nickname} |</div>
                        
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )       
}

export default Edit;