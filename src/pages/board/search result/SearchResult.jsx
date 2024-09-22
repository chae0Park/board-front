import Post from '../../../component/Post';
import Footer from '../footer/footer';
import Page from '../page nation/Page';
import './SearchResult.css';

const SearchResult = () => {
    return(
        <div className='SearchResult'>
        
            {/* 
            <Header /> : 로그인을 해야 검색할 수 있기 때문에 버튼은 "마이페이지"
             검색어 알림 관련 : "keyword"에 대한 검색결과입니다.
            
             [왼쪽]
             <Post /> : 해당 검색어를 포함하고 있는 컴포넌트를 모두 보여줌, 최대 5개 
            [오른쪽]
            관련검색어: 검색어와 관련된 검색어를 모두 보여준다. 1열에 3개씩 
            
            [아래]
            <Page />
            <Footer />
             */}

             <Header />
             <div className='SearchResult-desc'>"keyword"에 대한 검색결과입니다.</div>
             <div className='screen-setter'>
                <div className='SearchResult-post'>
                    <Post />
                </div>
                <div className='SearchResult-popular'>

                </div>
            
            <Page />
            <Footer />
             </div>
             

        </div>
    )
}
export default SearchResult;