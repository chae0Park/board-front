import { Link } from 'react-router-dom';
import './Top3.css';
import { useTranslation } from 'react-i18next';
import default_user from "../assets/image/user-1699635_1280.png";
import React from 'react';
import { Post } from 'types/PostType';

type Top3Props = {
    post: Post | null; // 게시글 데이터
};

const Top3: React.FC<Top3Props> = ({ post }) => {
    //다국어 처리 
    const { t } = useTranslation();

    if (typeof post === 'undefined' || post === null) {
        return null; // 게시글이 없는 경우 null 반환
    }

    const commentCount:number = (post.comments && post.comments.length > 0 )? post.comments.length : 0;
    const previewTitle:string = getPreviewTitle(post.title);
    const previewText: string = getPreviewText(post.content);
    
    

    return (
        <div className='Top3'>
            <div className='detail' key={post.id}>
                <div className='Top3-top'>
                    <div className='Top3-img-container'>
                        <img className='Top3-img' src={post.profileImage ? post.profileImage : default_user} alt={post.author} />
                    </div>
                    <div className='Top3-user-info'>
                        <div className='id'>{post.author}</div>
                        <div className='date'>{new Date(post.createdAt ?? '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</div>
                    </div>
                </div>
                <div className='Top3-mid'>
                    <Link to={`/detail/${post._id}`} style={{ textDecoration: "none", color: "black" }}>
                        <div className='Top3-mid-title'>{previewTitle}</div>
                        <div className='content'><span dangerouslySetInnerHTML={{ __html: previewText }} /></div>
                    </Link>
                </div>
                <div className='Top3-btm'>
                    <div>{t('comment')} {commentCount} ·</div>
                    <div>{t('like')} {post.like} ·</div>
                    <div>{t('view')} {post.views}</div>
                </div>
            </div>
        </div>
        
    );
            
}

const getPreviewTitle = (title:string):string => {
    return title.length > 23 ? title.slice(0, 23) + '...' : title;
};

const getPreviewText = (content:string):string => {
    const textOnly = content.replace(/<img[^>]*>/g, '');
    const tempElement = document.createElement('div');
    tempElement.innerHTML = textOnly;
    const plainText = tempElement.textContent || tempElement.innerText || '';
    return plainText.length > 60 ? plainText.slice(0, 60) + '...' : plainText;
};

export default Top3;