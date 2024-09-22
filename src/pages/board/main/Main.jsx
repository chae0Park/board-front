import './Main.css';
import Top3 from '../../../component/Top3'
import New from '../new/New';
import SideBar from '../side bar/SideBar';
import Page from '../page nation/Page';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';



const Main = () => {

    return(

        <>
        
        
        <div className='Main'>
            {/* title under the Header component */}
            <div className='Main-Container1'>
                <div className="Main-title">
                        <div className='Main-title-writing'><Link to={'/write'} style={{ textDecoration: "none", color: "black"}}>
                        게시판에서 <br/>다양한 이야기를 나눠보세요 ✍️
                        </Link></div>
                </div>
            </div>
            
            
            

            
            
            <div className='weekly'>weekely top3</div>
            <div className='top3-container'>
                <Top3 />
                <Top3 />
                <Top3 />             
            </div>
            
            

            <div className='main-board-container'>
                <div className='big-container2'>       
                        <New />         
                        <SideBar />              
                </div>

                <div className='page-num'>
                    <Page />
                </div>

                
            </div>
            

            <Footer />
            
            
                
            
        </div>
        </>
        
    )

}

export default Main;