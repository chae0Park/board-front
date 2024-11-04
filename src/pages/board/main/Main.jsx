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


    //weeklyTop3 게시물 선정을 위해 점수를 계산하는 함수 
    const calculateScore = (post) => {
        return (post.like * 3) + ((post.comments ? post.comments.length : 0) * 2) + post.views;
    };
        
    

     //자정 기준으로 주간 Top 3 업데이트 
    useEffect(() => {
        const updateWeeklyTop3 = () => {
            // console.log('updateWeeklyTop3 실행 allPosts는?', allPosts);
            if (allPosts.length === 0) {
                console.log('allPosts가 비어 있습니다!');
                return; // 비어 있을 경우 함수 종료
            }

            const now =  new Date();
            const isSunday = now.getDay() === 0;
            
            
    
            //if today's not Sunday
            if(isSunday){
                const topPosts = [...allPosts]                    
                    .sort((a, b) => calculateScore(b) - calculateScore(a))
                    .slice(0, 3);
                console.log('매주 일요일 주간 Top 3 게시물:', topPosts);
                setWeeklyTop3(topPosts);
            }else{ //일요일이 아닌경우엔 mock 데이터 쓰겠습니다.
                const mockTopPosts = mockData;
                setWeeklyTop3(mockTopPosts);
            }
        };

        updateWeeklyTop3(); // 초기 실행

        const timer = setTimeout(() => {
            updateWeeklyTop3();
        }, 604800000);

        return () => clearTimeout(timer);
    }, [allPosts]);


    const mockData =  
         [
            allPosts[11], 
            allPosts[12], 
            allPosts[13]
        ];
 
    
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