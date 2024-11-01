import './Header.css';
import search from '../../assets/image/search-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/authSlice';
import { useState } from 'react';
import { fetchSearchedPosts } from '../../features/postSlice';
import korea from '../../assets/image/south-korea.png';
import english from '../../assets/image/united-kingdom.png';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../locales/LanguageContext.js';



const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //서치바
    const [clickSearchIcon, setClickSearchIcon] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchOption, setSearchOption] = useState('all');

    const { t } = useTranslation();
    const { changeLanguage } = useLanguage();
    const [openLanguage, setOpenLanguage] = useState(false);

    //get the logging user from Redux
    const user = useSelector((state) => state.auth.user);

    const onNavigate = () => {
        navigate("/signin");
    }
    //async 가 없으면 로그아웃 처리 안된채로 메인으로 넘어감
    const handleLogout  = async () => {
        await dispatch(logoutUser());
        onNavigate(); 
    };
    
    //search bar 돋보기 누르면 서치바 나옴 
    const handleSearchBar = () => {
        setClickSearchIcon((click) => !click);
    }
    // language 토글 
    const handleLangBar = () => {
        setOpenLanguage((click) => !click);
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
                <div className="left-title"><Link to={'/'} style={{ textDecoration: "none", color: "black"}}>{t('Board')}</Link></div>
            </div>
            
            <div className="header-container2">
                {clickSearchIcon && (
                    <div>
                        <select value={searchOption} onChange={handleSearchOptionChange}>
                            <option value="all">{t('all')}</option>
                            <option value="title">{t('title')}</option>
                            <option value="content">{t('content')}</option>
                            <option value="author">{t('nickname')}</option>
                        </select>
                        <input 
                            type='text' 
                            placeholder='search here' 
                            value={searchValue} 
                            onChange={handleSearchValueChange} 
                        />
                        <button 
                        type='button' 
                        onClick={handleSearch} 
                        style={{cursor:'pointer'}}
                        >{t('search')}</button>
                    </div>
                )}
                <div className="search-icon" onClick={handleSearchBar} style={{cursor:'pointer'}}><img src={search} alt='search-icon'/></div>
                
                
                {user ? (
                    <>
                        <Link to={'/'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button onClick={handleLogout} className='logout-btn'>
                            {t('logout')}
                        </button>
                        </Link>
                        <Link to={'/mypage'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button className='mypage-btn'>
                            {t('mypage')}
                        </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to={'/signin'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button type='submit' className="login-btn">
                            {t('login')}
                        </button>
                        </Link>
                    </>
                )}
                <div>
                    <p className='language' onClick={handleLangBar}>language</p>
                    {openLanguage === true && (
                        <div className='language-container'>
                            <p className='lang-kor' onClick={() => changeLanguage('ko')}><img src={korea} alt='korea'/></p>
                            <p className='lang-eng' onClick={() => changeLanguage('en')}><img src={english} alt='english'/></p>
                        </div>
                    )}
                    
                </div>
            </div>
            
            
        </div>           
    )
}
export default Header;