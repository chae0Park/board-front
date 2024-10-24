import './Detail.css';
//import Header from '../header/Header'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchPosts, fetchPostById, deletePost, likePost  } from '../../../features/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Comment from '../../../component/Comment';
import Reply from '../../../component/Reply';
import { addComment,fetchComments  } from '../../../features/commentSlice';
import { fetchUserProfile } from '../../../features/authSlice';



const Detail = () => {
    const { id  } = useParams();
    const { token } = useSelector((state) => state.auth); // 토큰 가져오기
    const isLoggedIn = !!token; // 토큰이 있으면 로그인 상태
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector((state) => state.posts.currentPost);
    const currentUser = useSelector((state) => state.auth.user);
    const comments = useSelector((state) => state.comments.comments);
    
    const [loading, setLoading] = useState(true);
    const [likeActive, setLikeActive] = useState(false);

    //comment part setting 
    const [commentInput, setCommentInput] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [replyInputs, setReplyInputs] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({}); // 각 댓글에 대한 토글 상태

   

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true); // 데이터 로딩 시작
            await dispatch(fetchPostById(id));
            await dispatch(fetchComments(id)); // 댓글 목록 가져오기
            setLoading(false); // 데이터 로딩 완료
        };

        fetchPostData();
    }, [dispatch, id]);

    //삭제 후 다시 posts가지고옴 
    useEffect(() => {
        dispatch(fetchPosts()); // 페이지에 맞는 게시물 가져오기
    }, [dispatch]);
 

    // 삭제
    const handleDelete =  (id) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')){
            dispatch(deletePost(id))
                .then(() => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/');  // 게시물이 남아 있으면 목록 페이지로 이동
                    
                })
                .catch((error) => {
                    console.error('게시글 삭제 중 오류 발생:', error);
                    alert('게시글 삭제에 실패했습니다.');
                });
        }
        
    };

    //like
    useEffect(() => {
        if (post && isLoggedIn) {
            // 현재사용자의 아이디 확인 
            console.log("Current User ID:", currentUser.id);
            setLikeActive(post.likedBy.includes(currentUser.id));
        }
    }, [post, isLoggedIn, currentUser]);

    const handleLike = async () => {
        if (!isLoggedIn) {
            alert('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }

        try {
            const response = await dispatch(likePost(post._id));
            if (response.payload) {
                setLikeActive(!likeActive); // 좋아요 상태 토글
            }
            //alert('좋아요 상태가 변경되었습니다.');
        } catch (error) {
            console.error('좋아요 추가 중 오류 발생:', error);
            //alert('좋아요 추가에 실패했습니다.');
        }
    };

    //댓글창 토글
    const handleCommentToggle = () => { //max 강의 참조
        setIsCommenting((commenting) => !commenting);
    };

    //대댓글 입력창 토글 
    const toggleReplyInput = (commentId) => {
        setShowReplyInput(prev => ({
            ...prev,
            [commentId]: !prev[commentId], // 현재 상태 반전
        }));
    };


    //댓글 작성 
    const handleCommentSubmit = async (e, parentId = null) => {
        e.preventDefault();
        const content = parentId ? replyInputs[parentId] : commentInput;

        if(content.trim()){
            await dispatch(addComment(post._id, content, parentId));
            if(parentId){
                setReplyInputs((prev) => ({...prev, [parentId]: '' })); //대댓글 입력 필드 초기화
                 // 대댓글 작성 후 댓글 목록을 다시 가져오기
                await dispatch(fetchComments(post._id));
                setShowReplyInput(prev => !prev);
                
            } else{
                setCommentInput('');
                setIsCommenting(false);
            }
                
        }
    };

    //내가 선택한 댓글에만 대댓글 작성  
    const handleReplyInputChange = (commentId, value) => {
        setReplyInputs((prev) => ({
            ...prev,
            [commentId]: value,
        }));
    };
    
     // 특정 포스트의 댓글만 필터링
     const postComments = comments.filter(comment => comment.postId === post._id);
    
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
                        <div className='detail-author-profile'><img className='detail-profileImg' src={post.profileImage} alt={post.author} /></div>
                        <div className='detail-author-id'>{post.author} |</div>
                        <div className='detail-author-date'>
                            작성일자: {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // 월을 약어로 표시
                                day: '2-digit'
                            })}
                        </div>
                        {post.updatedAt && (
                        <div className='detail-modified-date'>
                            수정일자: {new Date(post.updatedAt).toLocaleDateString('en-US')}
                        </div>
                    )}
                    </div>
                    
                    <div className='detail-eidt-delete'>{/* 수정 | 삭제 */}
                    {currentUser && currentUser.nickname === post.author && ( // 수정 및 삭제 버튼 조건부 표시
                        <>
                            <Link to={`/edit/${post._id}`}><button className='edit_btn'>수정</button></Link>
                            <button className='delete_btn' onClick={() => {handleDelete(post._id)}}>삭제</button>
                        </>
                    )}    
                    </div>
                </div>

                {/* 구분선 */}
                <div className='detail-divide'></div>  

                    
                <div className='detail-container2'>
                    <div className='detail-content'>
                         {/* 마크다운이나 HTML을 처리할 수 있는 방법을 통해 변환된 내용을 렌더링 */}
                         <span dangerouslySetInnerHTML={{ __html: post.content }} />                        
                    </div>
                    
                    <div className='detail-like-comment'>
                        <div onClick={handleLike} style={{ cursor: 'pointer' }}>{likeActive ? '❤️' : '🤍'}</div>
                        <div>like{}</div>
                        <div onClick={handleCommentToggle} style={{ cursor: 'pointer' }} > ✏️</div>
                        <div>댓글</div>
                    </div>

                    {isCommenting && ( // 댓글 창을 클릭하면 작성할 수 있도록 
                        <form onSubmit={handleCommentSubmit}>
                            <input
                                value={commentInput}
                                className='commentInput'
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder='댓글을 입력하세요.'
                                required
                            />
                            <button type='submit'>등록</button>
                        </form>
                    )}
                    <div className="comments-list">
                        {postComments.map((comment) => (
                            <div key={comment._id} className='detail-comment'>
                                <Comment
                                    author={comment.author}
                                    profileImg={comment.profileImage}
                                    timestamp={comment.createdAt}
                                    content={comment.content}
                                    flip={() => toggleReplyInput(comment._id)} // 함수 전달
                                />
                                {showReplyInput[comment._id] && ( //reply 인풋 flip
                                    <div className='reply-input'>
                                        <form onSubmit={(e) => handleCommentSubmit(e, comment._id)}>
                                            <input
                                                value={replyInputs[comment._id] || ''}
                                                onChange={(e) => handleReplyInputChange( comment._id, e.target.value)}
                                                placeholder='대댓글을 입력하세요.'
                                                className='replyInputbox'
                                            />
                                            <button type='submit'>등록</button>
                                        </form>
                                    </div>

                                )}
                                
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className='replies_in_detail'>
                                        {comment.replies.map(reply => (
                                            <Reply
                                                key={reply._id}
                                                author={reply.author}
                                                profileImg={reply.profileImage}
                                                timestamp={reply.createdAt}
                                                content={reply.content}
                                                className='reply_to_comment'
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div> 
                    
                     
                    
                </div>
            </div>
               
        </div>
            
            
    )       
}

export default Detail;