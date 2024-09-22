import './Page.css';

const Page = () => {
    return(
        // < 이전 | 1 2 3 4 5~ 10 | 다음 >
        <div className='Page'>
            <div className='Page-container'>
                <div className='prev-page'> &lt; 이전</div>
                <div className='Page-1'>1</div>
                <div className='Page-2'>2</div>
                <div className='Page-3'>3</div>
                <div className='Page-4'>4</div>
                <div className='Page-5'>5</div>
                <div className='next-page'>다음  &gt; </div>
            </div>
            
        </div>
    )
}

export default Page;