import './Footer.css';
import { Link } from 'react-router-dom';
import instagram from '../../../assets/image/instagram_logo.png';
import { useTranslation } from 'react-i18next';


const Footer = () => {
    //다국어 처리 
    const { t } = useTranslation();

    return(
        <div className='Footer'>
            <div className='Footer-left'>
                <div className='Footer-left-top'>
                    <div className='site-logo'>✍️</div>
                    <div className='site-name'><Link to={"/"} style={{ textDecoration: "none", color: "white"}}>{t('Board')}</Link></div>
                </div>
                <div className='Footer-desc' >{t('footer-desc')}</div>
            </div>
            

            <div className='Footer-right'>
                <div className='Footer-email'>cyp022@gmail.com</div>
                <div className='Footer-instagram'><img src={instagram} alt='instagram'/></div>
                <div className='Footer-github'><img src='https://cdn-icons-png.flaticon.com/512/25/25231.png' alt='github'/></div>
            </div>
        </div>
    )
}

export default Footer;