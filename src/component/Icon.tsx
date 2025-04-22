import './Icon.css';
import { useDispatch } from 'react-redux';
import { fetchSearchedPosts } from '../features/postSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { AppDispatch } from '@/app/store';

interface IconProps {
    term: string;
}

type GetKeyword = (keyword: string) => string;

//함수형 컴포넌트의 인라인으로 prop term의 타입 지정
const Icon: React.FC<IconProps> = ({term}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const getKeyword: GetKeyword = (keyword) => {
        return keyword.length > 8 ? keyword.slice(0, 8) + '..' : keyword;
    };

    const limitedTerm = getKeyword(term); 

    const handleClick = () => {
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