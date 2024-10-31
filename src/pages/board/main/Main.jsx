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

const Main = () => {
    const dispatch = useDispatch();    
    // 쿼리 파라미터에서 페이지 번호 가져오기
    const { currentPage, setCurrentPage, initialPage, location } = usePageContext(); // Context에서 값 가져오기
    const postsPerPage = 3;
    const [ weeklyTop3, setWeeklyTop3 ] = useState([]);
    
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
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // 매달 1일로 설정
            const endOfWeek = new Date();
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
            endOfWeek.setHours(23, 59, 59, 999);
    
            //if today's not Sunday
            if(now.getDay() !== 0){
                console.log('오늘이 일요일이 아닐 때 allPosts:', allPosts);
                const topPosts = [...allPosts]
                .filter((post) => {
                    const postDate = new Date(post.createdAt);
                    // console.log('게시물 날짜:', postDate); // 게시물 날짜 로그
                    // console.log('필터링 기준: 오늘 시작:', startOfMonth, '다음 일요일:', endOfWeek);
                    return postDate >= startOfMonth && postDate < endOfWeek;
                })
                .sort((a, b) => calculateScore(b) - calculateScore(a))
                .slice(0, 3);
                // topPosts 값을 로그로 출력
                //console.log('오늘이 일요일이 아닐 때 선택된 주간 Top 3 게시물:', topPosts);
                setWeeklyTop3(topPosts);
            }else{ //일요일인 경우 
                const topPosts = [...allPosts]
                    .sort((a, b) => calculateScore(b) - calculateScore(a))
                    .slice(0, 3);
                    // topPosts 값을 로그로 출력
                //console.log('오늘이 일요일일 때 선택된 주간 Top 3 게시물:', topPosts);
                setWeeklyTop3(topPosts);
            }
        };


        const now = new Date();
        const nextSunday = now;
        nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        nextSunday.setHours(23, 59, 59, 999);
        // 남은 시간 로그
        const timeUntilNextSunday = nextSunday - now;

        const timer = setTimeout(() => {
            updateWeeklyTop3();
        }, timeUntilNextSunday);

        return () => clearTimeout(timer);
    }, [allPosts]);



    
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