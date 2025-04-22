import React, { createContext, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PageContextType {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    initialPage: number;
    location: ReturnType<typeof useLocation>;
    paginate: (pageNumber: number) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined); //createContext 함수를 사용하여 새로운 Context를 생성

interface PageProviderProps {
    children: React.ReactNode; 
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => { 
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page') || '0') || 0; //url에 있는 page를 가져온다. 없으면 0으로 초기화한다.
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    const paginate = (pageNumber: number): void => {
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

export const usePageContext = (): PageContextType => {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
}
