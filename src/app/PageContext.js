import React, { createContext, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PageContext = createContext();

export const PageProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 0;
    const [currentPage, setCurrentPage] = useState(initialPage);

    const paginate = (pageNumber) => {
        console.log('페이지 클릭이 실행되었나요?',pageNumber);
        if (pageNumber !== currentPage) {
            navigate(`?page=${pageNumber}`); // page로 부터 받은 숫자를 이용해 url을 업데이트한다.
        } //url이 바뀌었기 때문에 location.serach 가 이를감지하고 변한 숫자가 initialPage안에 담기게 된다.
    };
    
    
    

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage, initialPage, location, paginate  }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePageContext = () => useContext(PageContext);