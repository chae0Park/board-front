import './Comment.css';
import default_user from '../assets/image/user-1699635_1280.png';

interface CommentProps {
    author: string;
    profileImg: string; 
    timestamp: string;
    content: string;
    flip: () => void; 
}

const Comment = ({author, profileImg, timestamp, content, flip }: CommentProps) => {
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24시간 형식으로 표시
    });
    const date = new Date(timestamp);
    const createdAt = formatter.format(date);

    return(
       <div className="Comment">
            <div className='comment-top'>
                <div className='comment-author-profile'>
                    <img className='comment-author-profileImg' src={profileImg || default_user } alt='unknown'></img>
                </div>
                <p>{author} | </p>
                <p>{createdAt}</p>
            </div>
            <div>{content}</div>
            {/* 여기 좋아요 기능도 넣을거임 */}
            <p onClick={flip} style={{ cursor: 'pointer' }} >✏️</p>
       </div>
    )
}
export default Comment;