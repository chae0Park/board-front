import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return(
        <div className='Footer'>
            <div className='Footer-left'>
                <div className='Footer-left-top'>
                    <div className='site-logo'>✍️</div>
                    <div className='site-name'><Link to={"/"} style={{ textDecoration: "none", color: "white"}}>게시판</Link></div>
                </div>
                <div className='Footer-desc' >자유롭게 이용해보세요!</div>
            </div>
            

            <div className='Footer-right'>
                <div className='Footer-email'>email@email.com</div>
                <div className='Footer-instagram'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/480px-Instagram_icon.png' alt='instagram'/></div>
                <div className='Footer-github'><img src='https://cdn-icons-png.flaticon.com/512/25/25231.png' alt='github'/></div>
            </div>
        </div>
    )
}

export default Footer;