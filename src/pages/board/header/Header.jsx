import './Header.css';
import search from '../../../assets/image/search-icon.png';
import { Link } from 'react-router-dom';



const Header = () => {
    return(       
        <div className="Header">

            <div className="header-container1">
                <div className="left-img">✍️</div>
                <div className="left-title"><Link to={'/'} style={{ textDecoration: "none", color: "black"}}>게시판</Link></div>
            </div>
            
            <div className="header-container2">
                <div className="search-icon"><img src={search} alt='search-icon'/></div>
                <Link to={'/pages/signIn/SignIn'} 
                        style={{ textDecoration: "none", color: "black"}}
                    >
                    <button type='submit' className="login-btn">
                            로그인
                    </button>
                </Link>
            </div>
            
            
        </div>           
    )
}
export default Header;