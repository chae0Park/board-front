import { useSelector } from 'react-redux';
import Post from '../../../component/Post';
import Header from '../../header/Header';
import Page from '../page nation/Page';
import './SearchResult.css';
import { selectSearchedPosts, selectSearchTerm } from '../../../features/postSlice';

const SearchResult = () => {
    const searchedPosts = useSelector(selectSearchedPosts);
    const keyword = useSelector(selectSearchTerm);
    
    return(
        <div className='SearchResult'>
        
           

             <Header />
             
             <div className='SearchResult-contents'>
                <div className='SearchResult-desc'>"{keyword}"에 대한 검색결과입니다.</div>
                <div className='SearchResult-post'>
                    {searchedPosts.map(post => (
                        <Post key={post._id} post={post} />
                    ))}
                </div> 
             
            </div>
            <Page />
            
             

        </div>
    )
}
export default SearchResult;