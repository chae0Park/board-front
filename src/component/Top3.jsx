import { Link } from 'react-router-dom';
import './Top3.css';
import { useTranslation } from 'react-i18next';
import default_user from "../assets/image/user-1699635_1280.png";


const Top3 = ({ post }) => {
    //다국어 처리 
    const { t } = useTranslation();

    if (!post) {
        return null; // 게시글이 없는 경우 null 반환
    }

    const commentCount = post.comments.length;
    const previewText = getPreviewText(post.content);
    
    

    return (
        <div className='Top3'>
            <div className='detail' key={post.id}>
                <div className='Top3-top'>
                    <div className='Top3-img-container'>
                        <img className='Top3-img' src={post.profileImage ? post.profileImage : default_user} alt={post.author} />
                    </div>
                    <div className='Top3-user-info'>
                        <div className='id'>{post.author}</div>
                        <div className='date'>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</div>
                    </div>
                </div>
                <div className='Top3-mid'>
                    <Link to={`/detail/${post._id}`} style={{ textDecoration: "none", color: "black" }}>
                        <div className='Top3-mid-title'>{post.title}</div>
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

const getPreviewText = (content) => {
    const textOnly = content.replace(/<img[^>]*>/g, '');
    const tempElement = document.createElement('div');
    tempElement.innerHTML = textOnly;
    const plainText = tempElement.textContent || tempElement.innerText || '';
    return plainText.length > 60 ? plainText.slice(0, 60) + '...' : plainText;
};

export default Top3;