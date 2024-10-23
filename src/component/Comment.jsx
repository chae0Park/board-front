import './Comment.css';
import default_user from '../assets/image/user-1699635_1280.png';

const Comment = ({author, profileImg, timestamp, content, flip }) => {


    return(
       <div className="Comment">
            <div className='comment-top'>
                <div className='comment-author-profile'>
                    <img className='comment-author-profileImg' src={profileImg || default_user } alt='unknown'></img>
                </div>
                <p>{author} | </p>
                <p>{timestamp}</p>
            </div>
            <div>{content}</div>
            {/* 여기 좋아요 기능도 넣을거임 */}
            <p onClick={flip} style={{ cursor: 'pointer' }} >✏️</p>

       </div>
    )
}
export default Comment;