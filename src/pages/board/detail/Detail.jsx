import './Detail.css';
//import Header from '../header/Header'
import Footer from '../footer/Footer'

const Detail = () => {
    return(
        <div>
            <div className='Detail'>
                <div className='detail-title'>
                    <div className='detail-title-writing'>오늘 저녁 뭐먹을지 추천해주세요.</div>
                    
                </div>

                <div className='detail-container1'>
                    <div className='detail-author-info'>
                        <div className='detail-author-profile'><img src='https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTbZgoWDp5B0DE2DfmU3eZP4RjJp4RdE0PzbgZdaTMICo7Hw-DqsWgTM6h5anCmxkh0MgOI3_6GtXVR-44' alt='profile-img'/></div>
                        <div className='detail-author-id'>Ings |</div>
                        <div className='detail-author-date'>2024.07.23</div>
                    </div>

                    <div className='detail-eidt-delete'>수정 | 삭제</div>
                </div>
                
                

        

                {/* 구분선 */}
                <div className='detail-divide'></div>  

                    
                <div className='detail-container2'>
                    <div className='detail-content'>내용입니다. 오늘 하루는 계획된 대로 잘 보내고 있나요?</div>
                    
                    <div className='detail-like-comment'>
                        <div>❤️</div>
                        <div>좋아요</div>
                        <div>✏️</div>
                        <div>댓글</div>
                    </div>
                </div>
                
                {/* 만약 이미지가 있으면 이미지 삽입  */}
                {/* 
                    <div className='detail-content-img'><img  src='' alt=''/></div>
                */}


                
            </div>

                <Footer />
               
        </div>
            
            
    )       
}

export default Detail;