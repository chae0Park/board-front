import './Icon.css';
import { useDispatch } from 'react-redux';
import { fetchSearchedPosts } from '../features/postSlice';
import { useNavigate } from 'react-router-dom';

const Icon = ({term}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getKeyword = (keyword) => {
        return keyword.length > 8 ? keyword.slice(0, 8) + '..' : keyword;
    };

    const limitedTerm = getKeyword(term); 

    const handleClick = () => {
        //todo: 검색어 클릭 시 검색 결과 페이지로 이동하는 로직 추가`
        console.log(`Searching for: ${term}`); // 잘 나옴 
        dispatch(fetchSearchedPosts({ searchTerm: term, searchOption: 'all' }));
        navigate("/search");
    }

    return(
        <div className='Icon'>
            <button 
                className='popularIcon'
                onClick={handleClick}
            >
                {limitedTerm}
            </button>
        </div>
    )
}

export default Icon;