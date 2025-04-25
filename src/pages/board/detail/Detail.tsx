import './Detail.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchPosts, fetchPostById, deletePost, likePost } from '../../../features/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Comment from '../../../component/Comment';
import Reply from '../../../component/Reply';
import { addComment } from '../../../features/commentSlice';
import { useTranslation } from 'react-i18next';
import default_user from '../../../assets/image/user-1699635_1280.png';
import { RootState } from '@/app/store';
import { AppDispatch } from '@/app/store';
import { Post } from 'types/PostType';
import { User } from 'types/UserType';
import { Comment as CommentType } from 'types/CommentType';



const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useSelector((state: RootState) => state.auth); // 토큰 가져오기
    const isLoggedIn = !!token; // 토큰이 있으면 로그인 상태
    const [ commentList, setCommentList ] = useState<CommentType[]>([]); // 댓글 상태 관리
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const post = useSelector((state:RootState) => state.posts.currentPost) as Post | null;
    const currentUser = useSelector((state:RootState) => state.auth.user)  as User | null;
    const comments = useSelector((state:RootState) => state.posts.comments);

    useEffect(() => {
        if (comments && comments.length > 0) {
            setCommentList(comments);
        }
    }, [comments]);

    const [loading, setLoading] = useState(true);
    const [likeActive, setLikeActive] = useState(false);

    //comment part setting 
    const [commentInput, setCommentInput] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
    const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({}); // 각 댓글에 대한 토글 상태

    //다국어 처리 
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true); // 데이터 로딩 시작
            if(id){
                dispatch(fetchPostById(id));
            }
            setLoading(false); // 데이터 로딩 완료
        };

        fetchPostData();
    }, [dispatch, id]);

    //삭제 후 다시 posts가지고옴 
    useEffect(() => {
        dispatch(fetchPosts({ page: 0, postsPerPage: 3 })); // 페이지에 맞는 게시물 가져오기
    }, [dispatch]);


    // 삭제
    const handleDelete = (id: string) => {
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
        if (post && isLoggedIn && currentUser) {
            console.log("Current User ID:", currentUser?.id);
            if(post.likedBy && post.likedBy.length > 0) {
                setLikeActive(post.likedBy.includes(currentUser.id));
            }
        }
    }, [post, isLoggedIn, currentUser]);


    const handleLike = async () => {
        if (!isLoggedIn) {
            alert(t('log-in feature'));
            return;
        }

        try {
            if(post){
                const response = await dispatch(likePost(post._id));
                if (response.payload) {
                    setLikeActive(!likeActive); // 좋아요 상태 토글
                }
            }
        } catch (error) {
            console.error('좋아요 추가 중 오류 발생:', error);
            //alert('좋아요 추가에 실패했습니다.');
        }
    };

    //댓글창 토글
    const handleCommentToggle = () => { 
        setIsCommenting((commenting) => !commenting);
    };

    //대댓글 입력창 토글 
    const toggleReplyInput = (commentId: string): void => {
        setShowReplyInput(prev => ({
            ...prev,
            [commentId]: !prev[commentId], // 현재 상태 반전
        }));
    };


    //댓글 작성 
    const handleCommentSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert(t('log-in feature'));
            return;
        }

        if(!post) return;

        const content = parentId ? replyInputs[parentId] : commentInput;

        if (content && content.trim()) {
            await dispatch(addComment(post._id, content, parentId));
            await dispatch(fetchPostById(post._id));
            if (parentId) {
                setReplyInputs((prev) => ({ ...prev, [parentId]: '' })); //대댓글 입력 필드 초기화
                // 대댓글 작성 후 댓글 목록을 다시 가져오기
                setShowReplyInput(prev => ({...prev, [parentId]: false}));
            } else {
                setCommentInput('');
                setIsCommenting(false);
            }

        }
    };

    //내가 선택한 댓글에만 대댓글 작성  
    const handleReplyInputChange = (commentId: string, value: string) => {
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
                                posted: {post.createdAt ? (
                                    new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit',
                                    })
                                ) : ('')}
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
{/* ----------------------------이 코드 위로는 css 잘 들어감 ----------------------------------------------------------------- */}



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
                        {(commentList && commentList.length > 0) && commentList.map((comment) => (
                            (comment.author && comment.profileImage && comment.createdAt ) && 
                            <div key={comment._id} className='detail-comment'>
                                <Comment
                                    author={comment.author}
                                    profileImg={comment.profileImage}
                                    timestamp={comment.createdAt}
                                    content={comment.content}
                                    flip={() => toggleReplyInput(comment._id as string)} // 함수 전달
                                />
                                {showReplyInput[comment._id as string] && ( //reply 인풋 flip
                                    <div className='reply-input'>
                                        <form onSubmit={(e) => handleCommentSubmit(e, comment._id)}>
                                            <input
                                                value={replyInputs[comment._id as string] || ''}
                                                onChange={(e) => handleReplyInputChange(comment._id as string, e.target.value)}
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
