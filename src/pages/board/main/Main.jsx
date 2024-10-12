import './Main.css';
import Top3 from '../../../component/Top3'
import New from '../new/New';
import SideBar from '../side bar/SideBar';
import Page from '../page nation/Page';
import Footer from '../footer/Footer';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../../features/postSlice';

const Main = () => {
    const dispatch = useDispatch();    
    const location = useLocation();
    const navigate = useNavigate();


    // 쿼리 파라미터에서 페이지 번호 가져오기
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 0; // 기본값 1
    const [currentPage, setCurrentPage] = useState(initialPage);
    const postsPerPage = 3;
    //posts스토어를 통해 posts데이터들, 상태, 전체 포스트의 갯수를 가져옴 
    const posts = useSelector((state) => state.posts.posts);
    const postStatus = useSelector((state) => state.posts.status); 
    const totalPosts = useSelector((state) => state.posts.totalPosts);
    const paginate = (pageNumber) => {
        console.log('페이지 클릭이 실행되었나요?',pageNumber);
        if (pageNumber !== currentPage) {
            navigate(`?page=${pageNumber}`); // page로 부터 받은 숫자를 이용해 url을 업데이트한다.
        } //url이 바뀌었기 때문에 location.serach 가 이를감지하고 변한 숫자가 initialPage안에 담기게 된다.
    };

    //기존의 앱 실행 후 data 가져오는 식 
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
    }, [ location.search, currentPage, dispatch, initialPage ]);
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
                        <New 
                            posts={posts}
                            />         
                        <SideBar />              
                </div>

                <div className='page-num'>
                <Page
                    totalPosts={totalPosts}
                    postsPerPage={postsPerPage}
                    paginate={paginate}
                />
                </div>  
            </div>

            <Footer />
       
        </div>
        </>
        
    )

}

export default Main;