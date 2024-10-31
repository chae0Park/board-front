import { Link } from 'react-router-dom';
import './Top3.css';


const Top3 = ({ post }) => {
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
                        <img className='Top3-img' src={post.profileImage} alt={post.author} />
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
                    <div>댓글 {commentCount} ·</div>
                    <div>좋아요 {post.like} ·</div>
                    <div>조회수 {post.views}</div>
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
    return plainText.length > 70 ? plainText.slice(0, 70) + '...' : plainText;
};

export default Top3;