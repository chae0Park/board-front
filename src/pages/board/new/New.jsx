import Post from '../../../component/Post';
import './New.css';

const New = ({ posts }) => {

    return (
        <div className='New'>
            <div className='new-title'>최신게시물</div>
            <div className='new-post-container'>
                {posts.map((item) => (
                    <Post key={item._id} post={item} />
                ))}
            </div>
        </div>
    );
};

export default New;
