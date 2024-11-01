import Post from '../../../component/Post';
import './New.css';
import { useTranslation } from 'react-i18next';

const New = ({ posts }) => {
    //다국어 처리 
    const { t } = useTranslation();

    return (
        <div className='New'>
            <div className='new-title'>{t('new')}</div>
            <div className='new-post-container'>
                {posts.map((item) => (
                    <Post key={item._id} post={item} />
                ))}
            </div>
        </div>
    );
};

export default New;
