import './Main.css';
import Top3 from '../../../component/Top3'
import New from '../new/New';
import SideBar from '../side bar/SideBar';
import Page from '../page nation/Page';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPosts,fetchPosts } from '../../../features/postSlice';
import { PageProvider, usePageContext } from '../../../app/PageContext';
import { useTranslation } from 'react-i18next';

const Main = () => {
    const dispatch = useDispatch();    
    // 쿼리 파라미터에서 페이지 번호 가져오기
    const { currentPage, setCurrentPage, initialPage, location } = usePageContext(); // Context에서 값 가져오기
    const postsPerPage = 3;
    const [ weeklyTop3, setWeeklyTop3 ] = useState([]);
    //다국어 처리 
    const { t } = useTranslation();
    
    //posts스토어를 통해 posts데이터들, 상태, 전체 포스트의 갯수를 가져옴 
    const posts = useSelector((state) => state.posts.posts);
    const postStatus = useSelector((state) => state.posts.status); 
    const totalPosts = useSelector((state) => state.posts.totalPosts);
    const allPosts = useSelector((state) => state.posts.allPosts);
    
    //weekly top3 를 위한 posts전체 데이터 - page 처리 하지 않음 
    useEffect(() => {
        if (postStatus !== 'succeeded') {
            dispatch(fetchAllPosts());
        }
    }, [dispatch, postStatus]);


    //앱실행 후 페이지에 맞춰 값을 가져옴 
    useEffect(() => {
        if (postStatus === 'idle' || postStatus === 'failed') {
            dispatch(fetchPosts({ page: 0, postsPerPage }));
        }
    }, [dispatch, postStatus]);

    //현재페이지에 맞는 데이터 가지고 오기 
    useEffect(() => {
        if (initialPage !== currentPage) {
            setCurrentPage(initialPage); // currentPage 업데이트
            dispatch(fetchPosts({ page: initialPage, postsPerPage })); // 새 페이지에 대한 데이터 호출
        }
    }, [ location.search, currentPage, setCurrentPage, dispatch, initialPage ]);
    //currentPage, initialPage를 없애니 다른 페이지로 넘어갈때 오류 뜸 

    //weeklyTop3 점수 계산하는 함수 
    const calculateScore = (post) => {
        return (post.like * 3) + ((post.comments ? post.comments.length : 0) * 2) + post.views;
    };
        
   
    // weeklyTop3 계산하는 로직
    useEffect(() => {
        if (allPosts.length > 0) {
            // 모든 게시물의 점수를 계산하여 상위 3개 게시물 뽑기
            const sortedPosts = [...allPosts]
                .map((post) => ({
                    ...post,
                    score: calculateScore(post),
                }))
                .sort((a, b) => b.score - a.score) // 점수 내림차순 정렬
                .slice(0, 3); // 상위 3개 게시물 추출

            setWeeklyTop3(sortedPosts); // weeklyTop3 상태에 저장

            // 로컬 스토리지에 저장 (선택 사항)
            localStorage.setItem('weeklyTop3', JSON.stringify(sortedPosts));
        }
    }, [allPosts]);

    // 매주 새로운 Top 3를 계산하기 위한 날짜 비교 (주기적 갱신)
    useEffect(() => {
        const lastFetchedDate = localStorage.getItem('lastFetchedDate');
        const now = new Date();
        const lastFetched = new Date(lastFetchedDate);

        const isSunday = now.getDay() === 0;

        // 로컬 스토리지에 저장된 날짜가 없거나, 1주일이 지났다면 다시 갱신
        if ((!lastFetchedDate || now - lastFetched >= 7 * 24 * 60 * 60 * 1000) && isSunday) {
            // 새로운 Top 3 게시물 계산 (주기적으로 갱신)
            dispatch(fetchAllPosts());  // 새로 데이터를 가져와서 갱신
            localStorage.setItem('lastFetchedDate', now.toISOString());
        }
    }, [dispatch]);
    
 
    
    return(
        <>     
        <div className='Main'>
            {/* title under the Header component */}
            <div className='Main-Container1'>
                <div className="Main-title">
                        <div className='Main-title-writing'>
                            <Link to={'/write'} style={{ textDecoration: "none", color: "black"}}>
                                {t('board-title')}
                            </Link>
                        </div>
                </div>
            </div>

     
            <div className='weekly'>weekely top3</div>
            <div className='top3-container'>
                {weeklyTop3.map((post) => (
                    <Top3 key={post._id} post={post} />
                ))}
            </div>

            <div className='main-board-container'>
                <div className='big-container2'>       
                        <New posts={posts} />        
                        <SideBar/>              
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