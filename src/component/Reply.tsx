import './Reply.css';
import default_user from '../assets/image/user-1699635_1280.png';
import React from 'react';

interface ReplyProps {
    author: string;
    profileImg: string;
    timestamp: string;
    content: string;
}

const Reply:React.FC<ReplyProps> = ({author, profileImg, timestamp, content}) => {

    return(
        <div className='Reply'>
            <div className='reply-top'>
                <div className='reply-author-profile'>
                    <img className='reply-author-profileImg' src={profileImg || default_user } alt='unknown'></img>
                </div>
                <p>{author} | </p>
                <p>{timestamp}</p>
            </div>
            <div>{content}</div>
        </div>
    )

}

export default Reply;