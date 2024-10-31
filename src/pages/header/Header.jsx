import './Header.css';
import search from '../../assets/image/search-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/authSlice';
import { useState } from 'react';
import { fetchSearchedPosts } from '../../features/postSlice';



const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //서치바
    const [clickSearchIcon, setClickSearchIcon] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchOption, setSearchOption] = useState('all');


    //get the logging user from Redux
    const user = useSelector((state) => state.auth.user);

    const onNavigate = () => {
        navigate("/signin");
    }
    //async 가 없으면 로그아웃 처리 안된채로 메인으로 넘어감
    const handleLogout  = async () => {
        console.log("로그아웃 요청 중...");
        await dispatch(logoutUser());
        console.log("로그아웃 완료, 메인으로 이동 중...");
        onNavigate(); 
    };
    
    //search bar 돋보기 누르면 서치바 나옴 
    const handleSearchBar = () => {
        setClickSearchIcon((click) => !click);
    }

    const handleSearchOptionChange = (event) => {
        setSearchOption(event.target.value);
    };

    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    };

    
    //검색버튼을 누르면 fetchSearchedPosts호출 
    const handleSearch = () => {
        console.log("searchValue",searchValue);
        dispatch(fetchSearchedPosts({ searchTerm: searchValue, searchOption }));
        navigate("/search");
        setSearchValue('');
        setClickSearchIcon(false);
    };
    

    return(       
        <div className="Header">

            <div className="header-container1">
                <div className="left-img">✍️</div>
                <div className="left-title"><Link to={'/'} style={{ textDecoration: "none", color: "black"}}>게시판</Link></div>
            </div>
            
            <div className="header-container2">
                {clickSearchIcon && (
                    <div>
                        <select value={searchOption} onChange={handleSearchOptionChange}>
                            <option value="all">전체</option>
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                            <option value="author">작성자명</option>
                        </select>
                        <input 
                            type='text' 
                            placeholder='검색어 입력' 
                            value={searchValue} 
                            onChange={handleSearchValueChange} 
                        />
                        <button 
                        type='button' 
                        onClick={handleSearch} 
                        style={{cursor:'pointer'}}
                        >검색</button>
                    </div>
                )}
                <div className="search-icon" onClick={handleSearchBar} style={{cursor:'pointer'}}><img src={search} alt='search-icon'/></div>
                
                
                {user ? (
                    <>
                        <Link to={'/'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button onClick={handleLogout} className='logout-btn'>
                                로그아웃
                        </button>
                        </Link>
                        <Link to={'/mypage'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button className='mypage-btn'>
                                마이페이지
                        </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to={'/signin'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button type='submit' className="login-btn">
                                로그인
                        </button>
                        </Link>
                    </>
                )}
                
            </div>
            
            
        </div>           
    )
}
export default Header;