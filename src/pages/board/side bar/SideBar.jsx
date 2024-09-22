import Icon from '../../../component/Icon';
import './SideBar.css';

const SideBar = () => {
    return(
        <div className='SideBar'>
            <div className='SideBar-title'>인기 검색어</div>

            <div className='SideBar-icon-container'>
                <Icon/>
                <Icon/>
                <Icon/>
            </div>
        </div>
    )
}
export default SideBar;