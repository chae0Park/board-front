import Icon from '../../../component/Icon';
import './SideBar.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchFrequencies } from '../../../features/searchSlice';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '../../../app/store';
import { SearchFrequencyType } from 'types/SearchFrequencyType';

const SideBar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const frequencies = useSelector((state:RootState) => state.search.frequencies);
    const status = useSelector((state:RootState) => state.search.status);
    //다국어 처리 
    const { t } = useTranslation();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSearchFrequencies());
        }
    }, [dispatch, status]);
    
    return(
        <div className='SideBar'>
            <div className='SideBar-title'>{t('popular')}</div>

            <div className='SideBar-icon-container'>
                {status === 'succeeded' && frequencies.map((frequency:SearchFrequencyType) => (
                    <Icon 
                        // className='icon' 
                        key={frequency._id} 
                        term={frequency.term} /> // term prop을 Icon에 전달
                ))}        
            </div>
        </div>
    )
}
export default SideBar;