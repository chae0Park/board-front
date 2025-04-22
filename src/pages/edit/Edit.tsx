import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../board/footer/Footer';
import './Edit.css';
import { updatePost,fetchPostById } from '../../features/postSlice';
import default_user from '../../assets/image/user-1699635_1280.png';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/app/store';



const Edit = () => {
    //로그인한 사용자의 data가져옴 
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth); 
    const post = useSelector((state: RootState) => state.posts.currentPost);
    const quillRef = useRef<ReactQuill | null>(null);
    //게시물의 id가져옴 
    const { id } = useParams();
    //게시물 내용을 저장함 
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    

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


    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('updatedAt', new Date().toISOString()); 

        if(typeof id === 'string'){
            dispatch(updatePost({ id, formData })) 
                .then(() => {
                    alert(t('post-edit success alert'));
                    return dispatch(fetchPostById(id));
                })
                .then(() => {
                    navigate(`/detail/${id}`);
                })
                .catch((error) => {
                    console.error(t('post-edit error alert'), error);
            });
        }
        
    };


    return (
        <div>       
            <div className='Edit'>
                <div className='Edit-title'>
                    <div className='Edit-title-input'>
                        
                            <input type='text' 
                                className='Edit-title-inputbox'
                                placeholder={t('enter a title')}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                /> 
                            {/* 구분선 */}
                            <div className='detail-divide'></div>  
                                
                            {/* WYSIWYG 에디터 */}
                            <ReactQuill    
                                ref={quillRef}                            
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
                            <img className='edit-profile-img' src={(user && typeof user.profileImage === 'string') ? user.profileImage : default_user } alt="Profile" />
                        </div>
                        <div className='Edit-detail-author-id'>{(user && typeof user.profileImage === 'string') && user.nickname} |</div>
                        
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )       
}

export default Edit;