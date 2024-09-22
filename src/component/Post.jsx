import { Link } from 'react-router-dom';
// import Detail from '../pages/board/detail/Detail';
import './Post.css';




// 포스트안에 보여줄 때 글자제한 필요
const Post = () => {
    return(
        <div class="Post-container">
            <div className='Post'>         
                <div className='Post-content'>

                        <div className='Post-top'>
                            <div className='Post-img'><img className='Post-profile-img' src='https://d2v80xjmx68n4w.cloudfront.net/gigs/sdatI1688375010.jpg' alt='profile' /></div>
                            <div className='Post-user-info'> 
                                <div className='Post-id'>user 1</div>
                                <div className='Post-date'>2024-07-17</div>
                            </div>
                        </div>
                    
                        <div className='Post-mid'>
                            <div className='Post-mid-title'>
                                <Link to={'/pages/board/detail/Detail'}
                                    style={{ textDecoration: "none", color: "black"}}
                                >
                                    최신게시물에 들어갑니다
                                </Link>
                            </div> 
                            <div className='Post-mid-content'>지금 카페와서 작업중인데 다이소 위치 찾아보는거 굿아이디어 인거 같음
                                <br />아까 먹은 아이스크림도 너무 맛있음 성공적임 </div>
                        </div>

                        <div className='Post-btm'>
                            <div>댓글 0 ·</div>
                            <div>좋아요 0 ·</div>
                            <div>조회수 0</div>    
                        </div>
                </div> 

                        {/* 만약 게시물에 이미지가 있으면 미리보이도록 하기 
                        이미지 컨테이너를 미리 넣어준다 
                        */}
                <div className='post-content-img'><img className='post-content-img-src' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShmrYrkdowb1COVNhgCF8id6juxqoU14v9AQ&s' alt='gelato'/></div>
            </div>
        </div>
    )
}
export default Post;