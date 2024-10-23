import { Link } from 'react-router-dom';
import './Top3.css';

const Top3 = () => {
    return(
        <div className='Top3'>         
            <div className='detail'>
                <div className='Top3-top'>
                    <div className='Top3-img-container'><img className='Top3-img' src='https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' alt='profile' /></div>
                    <div className='Top3-user-info'> 
                        <div className='id'>profile 1</div>
                        <div className='date'>2024-07-17</div>
                    </div>
            </div>
            
                <div className='Top3-mid'>
                    <Link to={'/detail'} style={{ textDecoration: "none", color: "black"}}>                 
                        <div className='Top3-mid-title'>내일 뭐 할지 미리 정해보자</div>
                        <div className='content'>일단 아침일찍일어나서 다이소도 가야되고 좀 바쁨</div>
                    </Link>
                </div>
                <div className='Top3-btm'>
                        <div>댓글 0 ·</div>
                        <div>좋아요 0 ·</div>
                        <div>조회수 0</div>    
                </div>
                </div>    
        </div>
    )
}

export default Top3;