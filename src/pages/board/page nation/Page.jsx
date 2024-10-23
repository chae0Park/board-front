import { useState } from 'react';
import './Page.css';
import { usePageContext } from '../../../app/PageContext';

const Page = ({ totalPosts }) => {
    const [currentPageSet, setCurrentPageSet] = useState(0);
    const postsPerPage = 3;
    const totalPages = Math.ceil((totalPosts / postsPerPage)-1); // 전체 페이지수 :totalPages
    const pagesPerSet = 5; // 0~ 몇 개 까지를 최대로 보여줄지 정함 : pagesPerSet
    const startPage = currentPageSet * pagesPerSet;
    const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);
    const { paginate } = usePageContext(); // Context에서 값 가져오기

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        if (i >= 0) pageNumbers.push(i); // 페이지 번호가 0 이상일 때만 추가
    }

    const handlePageClick = (number) => {
        console.log('페이지 클릭:', number); // 추가된 로그
        paginate(number); // 현재 페이지 설정
    };// 유저가 누른 페이지에 해당하는 숫자를 paginate에 넘겨줌 (렌더링과 상관없이 바로 이뤄지는 작업)


    return(
        <div className='Page'>
        <div className='Page-container'>
            {currentPageSet > 0 && (
                <div className='prev-page' onClick={() => setCurrentPageSet(currentPageSet - 1)}>
                    &lt; 
                </div>
            )}
            {pageNumbers.map((number) => (
                <div key={number} className={`pagebtn Page-${number}`} onClick={() => handlePageClick(number)}>
                    {number+1} {/* 사용자에게는 1부터 보여주기 */}
                </div>
            ))}
            {endPage < totalPages && (
                <div className='next-page' onClick={() => setCurrentPageSet(currentPageSet + 1)}>
                     &gt;
                </div>
            )}
        </div>
    </div>
    )
}

export default Page;