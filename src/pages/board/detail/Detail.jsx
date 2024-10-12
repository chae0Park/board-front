import './Detail.css';
//import Header from '../header/Header'
import Footer from '../footer/Footer'
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../../features/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const Detail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const post = useSelector((state) => state.posts.currentPost);
    console.log(post);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true); // 데이터 로딩 시작
            await dispatch(fetchPostById(id));
            setLoading(false); // 데이터 로딩 완료
        };

        fetchPostData();
    }, [dispatch, id]);

    // const handleDelete = (id) => {
    //     if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')){
    //         dispatch(deletePost(id))
    //             .then(() => {
    //                 alert('게시글이 삭제되었습니다.');
    //                 navigate('/list');  // 삭제 후 목록 페이지로 이동
    //             })
    //             .catch((error) => {
    //                 console.error('게시글 삭제 중 오류 발생:', error);
    //                 alert('게시글 삭제에 실패했습니다.');
    //             });
    //     }
        
    // };
    
    if (loading) {
        return <p className="spinner">Loading...</p>; // 로딩 중 표시
    }

    if (!post) {
        return <p>게시물을 찾을 수 없습니다.</p>;
    }

    return(
        <div>
            <div className='Detail'>
                <div className='detail-title'>
                    <div className='detail-title-writing'>{post.title}</div>
                    
                </div>

                <div className='detail-container1'>
                    <div className='detail-author-info'>
                        <div className='detail-author-profile'><img src={post.profileImage} alt={post.author} /></div>
                        <div className='detail-author-id'>{post.author} |</div>
                        <div className='detail-author-date'>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // 월을 약어로 표시
                                day: '2-digit'
                                })}
                        </div>
                    </div>

                    <div className='detail-eidt-delete'>수정 | 삭제</div>
                </div>
                
                

        

                {/* 구분선 */}
                <div className='detail-divide'></div>  

                    
                <div className='detail-container2'>
                    <div className='detail-content'>{post.content}</div>
                    
                    <div className='detail-like-comment'>
                        <div>❤️</div>
                        <div>좋아요</div>
                        <div>✏️</div>
                        <div>댓글</div>
                    </div>
                </div>
                
                {/* 만약 이미지가 있으면 이미지 삽입  */}
                {/* 
                    <div className='detail-content-img'><img  src='' alt=''/></div>
                */}


                
            </div>

                <Footer />
               
        </div>
            
            
    )       
}

export default Detail;