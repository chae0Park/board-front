import './Header.css';
import search from '../../assets/image/search-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/authSlice';



const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    //get the logging user from Redux
    const user = useSelector((state) => state.auth.user);

    const onNavigate = () => {
        navigate("/signin");
    }

    const handleLogout  = () => {
        dispatch(logoutUser()); // dispatch the logout action
        onNavigate(); //redirect to the login page after logout
    };

    return(       
        <div className="Header">

            <div className="header-container1">
                <div className="left-img">✍️</div>
                <div className="left-title"><Link to={'/'} style={{ textDecoration: "none", color: "black"}}>게시판</Link></div>
            </div>
            
            <div className="header-container2">
                <div className="search-icon"><img src={search} alt='search-icon'/></div>
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