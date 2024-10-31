import Icon from '../../../component/Icon';
import './SideBar.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchFrequencies } from '../../../features/searchSlice';

const SideBar = () => {
    const dispatch = useDispatch();
    const frequencies = useSelector((state) => state.search.frequencies);
    const status = useSelector((state) => state.search.status);


    useEffect(() => {
        if (frequencies.status !== 'succeeded') {
            dispatch(fetchSearchFrequencies());
        }
    }, [dispatch, frequencies.status]);
    
    return(
        <div className='SideBar'>
            <div className='SideBar-title'>인기 검색어</div>

            <div className='SideBar-icon-container'>
                {status === 'succeeded' && frequencies.map((frequency) => (
                    <Icon key={frequency._id} term={frequency.term} /> // term prop을 Icon에 전달
                ))}        
            </div>
        </div>
    )
}
export default SideBar;