import Footer from '../footer/Footer';
import './Write.css';

const Write = () => {
    // const {
        
    // }

    return (
        <div>       
            <div className='Write'>
                <div className='write-title'>
                    <div className='write-title-input'>
                        <form>
                            <input type='text' 
                                className='write-title-inputbox'
                                placeholder='제목을 입력해주세요' />
                            
                            {/* 구분선 */}
                            <div className='detail-divide'></div>  

                            <textarea 
                                className='write-content' 
                                placeholder="내용을 입력해 주세요." 
                            />
                            
                            <button type='submit' className='write-submit-btn'>게시하기</button>
                        </form>
                    </div> 
                </div>

                <div className='write-detail-container1'>
                    <div className='write-detail-author-info'>
                        <div className='w-detail-author-profile'>
                            <img src='https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTbZgoWDp5B0DE2DfmU3eZP4RjJp4RdE0PzbgZdaTMICo7Hw-DqsWgTM6h5anCmxkh0MgOI3_6GtXVR-44' alt='profile-img'/>
                        </div>
                        <div className='w-detail-author-id'>Ings |</div>
                        <div className='w-detail-author-date'>2024.07.23</div>
                    </div>

                    <div className='w-detail-eidt-delete'>수정 | 삭제</div>
                </div>

                {/* 만약 이미지가 있으면 이미지 삽입 */}
                {/* 
                    <div className='detail-content-img'><img  src='' alt=''/></div>
                */}
            </div>

            <Footer />
        </div>
    )       
}

export default Write;
