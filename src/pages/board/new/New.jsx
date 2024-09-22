import Post from '../../../component/Post';
import './New.css';

const New = () => {
    return(
        <div className='New'>
            <div className='new-title'>최신게시물</div>
            <div className='new-post-container'>
                {/* 최신게시물은 딱 다섯개만 보이도록 */}              
                <Post/>
                <Post/>
                <Post/>
                

            </div>
        </div>
        
    )
}
export default New;