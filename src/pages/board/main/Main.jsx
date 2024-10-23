import './Main.css';
import Top3 from '../../../component/Top3'
import New from '../new/New';
import SideBar from '../side bar/SideBar';
import Page from '../page nation/Page';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../../features/postSlice';
import { PageProvider, usePageContext } from '../../../app/PageContext';

const Main = () => {
    const dispatch = useDispatch();    
    // 쿼리 파라미터에서 페이지 번호 가져오기
    const { currentPage, setCurrentPage, initialPage, location } = usePageContext(); // Context에서 값 가져오기
    const postsPerPage = 3;
    
    //posts스토어를 통해 posts데이터들, 상태, 전체 포스트의 갯수를 가져옴 
    const posts = useSelector((state) => state.posts.posts);
    const postStatus = useSelector((state) => state.posts.status); 
    const totalPosts = useSelector((state) => state.posts.totalPosts);

    //기존의 앱 실행 후 현재 페이지에 맞는 data 가져오는 식 
    useEffect(() => {
        if (postStatus === 'idle' || postStatus === 'failed') {
            console.log('fetchPosts 호출됨 currentPage, postsPerPage :', { currentPage, postsPerPage });
            dispatch(fetchPosts({ page: currentPage, postsPerPage }));
        }
    }, [currentPage, dispatch, postStatus]);

    useEffect(() => {
        if (initialPage !== currentPage) {
            setCurrentPage(initialPage); // currentPage 업데이트
            dispatch(fetchPosts({ page: initialPage, postsPerPage })); // 새 페이지에 대한 데이터 호출
        }
    }, [ location.search, currentPage, setCurrentPage, dispatch, initialPage ]);
//currentPage, initialPage를 없애니 다른 페이지로 넘어갈때 오류 뜸 
    
    return(
        <>     
        <div className='Main'>
            {/* title under the Header component */}
            <div className='Main-Container1'>
                <div className="Main-title">
                        <div className='Main-title-writing'><Link to={'/write'} style={{ textDecoration: "none", color: "black"}}>
                        게시판에서 <br/>다양한 이야기를 나눠보세요 ✍️
                        </Link></div>
                </div>
            </div>
     
            <div className='weekly'>weekely top3</div>
            <div className='top3-container'>
                <Top3 />
                <Top3 />
                <Top3 />             
            </div>

            <div className='main-board-container'>
                <div className='big-container2'>       
                        <New posts={posts} />         
                        <SideBar />              
                </div>

                <div className='page-num'>
                <Page
                    totalPosts={totalPosts}
                />
                </div>  
            </div>

            <Footer />
       
        </div>
        </>
        
    )

};

const MainWithProvider = () => (
    <PageProvider>
        <Main />
    </PageProvider>
);

export default MainWithProvider;

//export default Main;