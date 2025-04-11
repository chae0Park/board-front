import './Detail.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchPosts, fetchPostById, deletePost, likePost } from '../../../features/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Comment from '../../../component/Comment';
import Reply from '../../../component/Reply';
import { addComment } from '../../../features/commentSlice';
import { useTranslation } from 'react-i18next';
import default_user from '../../../assets/image/user-1699635_1280.png';



const Detail = () => {
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth); // 토큰 가져오기
    const isLoggedIn = !!token; // 토큰이 있으면 로그인 상태
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector((state) => state.posts.currentPost);
    const currentUser = useSelector((state) => state.auth.user);
    const comments = useSelector((state) => state.posts.comments);

    const [loading, setLoading] = useState(true);
    const [likeActive, setLikeActive] = useState(false);

    //comment part setting 
    const [commentInput, setCommentInput] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [replyInputs, setReplyInputs] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({}); // 각 댓글에 대한 토글 상태

    //다국어 처리 
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true); // 데이터 로딩 시작
            dispatch(fetchPostById(id));
            setLoading(false); // 데이터 로딩 완료
        };

        fetchPostData();
    }, [dispatch, id]);

    //삭제 후 다시 posts가지고옴 
    useEffect(() => {
        dispatch(fetchPosts()); // 페이지에 맞는 게시물 가져오기
    }, [dispatch]);


    // 삭제
    const handleDelete = (id) => {
        if (window.confirm(t('delete-confirm'))) {
            dispatch(deletePost(id))
                .then(() => {
                    alert(t('delete-msg'));
                    navigate('/');  // 게시물이 남아 있으면 목록 페이지로 이동

                })
                .catch((error) => {
                    console.error('게시글 삭제 중 오류 발생:', error);
                    alert(t('delete-err-msg'));
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
            alert(t('log-in feature'));
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
        if (!isLoggedIn) {
            alert(t('log-in feature'));
            return;
        }
        const content = parentId ? replyInputs[parentId] : commentInput;

        if (content.trim()) {
            await dispatch(addComment(post._id, content, parentId));
            await dispatch(fetchPostById(post._id));
            if (parentId) {
                setReplyInputs((prev) => ({ ...prev, [parentId]: '' })); //대댓글 입력 필드 초기화
                // 대댓글 작성 후 댓글 목록을 다시 가져오기
                setShowReplyInput(prev => !prev);
            } else {
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
    // ? const postComments = comments.filter(comment => comment.postId === post._id);

    if (loading) {
        return <p className="spinner">Loading...</p>; // 로딩 중 표시
    }


    if (!post) {
        return <p>{t('find no post')}</p>;
    }

    return (
        <div>
            <div className='Detail'>
                <div className='detail-title'>{post.title}</div>

                <div className='detail-container1'>
                    <div className='detail-author-info'>
                        <div className='detail-author-profile'>
                            <img className='detail-profileImg' src={post.profileImage ? post.profileImage : default_user} alt={post.author} />
                        </div>
                        <div className='detail-author-id'>{post.author} |</div>

                        {post.updatedAt ? (
                            <div className='detail-modified-date'>
                                edited: {new Date(post.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short', // 월을 약어로 표시
                                    day: '2-digit'
                                })}
                            </div>
                        ) : (
                            <div className='detail-author-date'>
                                posted: {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short', // 월을 약어로 표시
                                    day: '2-digit'
                                })}
                            </div>
                        )}
                    </div>

                    <div className='detail-eidt-delete'>{/* 수정 | 삭제 */}
                        {currentUser && currentUser.nickname === post.author && ( // 수정 및 삭제 버튼 조건부 표시
                            <>
                                <Link to={`/edit/${post._id}`}><button className='detail_edit_btn'>edit</button></Link>
                                <button className='detail_delete_btn' onClick={() => { handleDelete(post._id) }}>delete</button>
                            </>
                        )}
                    </div>
                </div>

                <div className='detail-container2'>
                    <div className='detail-content'>
                        {/* 마크다운이나 HTML을 처리할 수 있는 방법을 통해 변환된 내용을 렌더링 */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <div className='detail-like-comment'>
                        <div onClick={handleLike} style={{ cursor: 'pointer' }}>{likeActive ? '❤️' : '🤍'}</div>
                        <div onClick={handleLike} style={{ cursor: 'pointer' }}>{t('like')} &nbsp; &nbsp; </div>

                        <div onClick={handleCommentToggle} style={{ cursor: 'pointer' }} > ✏️</div>
                        <div onClick={handleCommentToggle} style={{ cursor: 'pointer' }}>{t('comment')}</div>
                    </div>

                    {isCommenting && ( // 댓글 창을 클릭하면 작성할 수 있도록 
                        <form onSubmit={handleCommentSubmit}>
                            <input
                                value={commentInput}
                                className='commentInput'
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder={t('comment here')}
                                required
                            />
                            <button className='reply-btn' type='submit'>submit</button>
                        </form>
                    )}
                    <div className="comments-list">
                        {comments.map((comment) => (
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
                                                onChange={(e) => handleReplyInputChange(comment._id, e.target.value)}
                                                placeholder={t('reply here')}
                                                className='replyInputbox'
                                            />
                                            <button className='reply-btn' type='submit'>submit</button>
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