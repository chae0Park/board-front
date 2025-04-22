import Detail from './pages/board/detail/Detail';
import { Routes, Route } from 'react-router-dom';
import Header from './pages/header/Header';
import Main from './pages/board/main/Main'
import SignIn from './pages/signIn/SignIn';
import SignUpFirst from './pages/signUp/SignUpFirst';
import Write from './pages/board/write/Write';
import MyPage from './pages/mypage/MyPage';
import Edit from './pages/edit/Edit';
import { PageProvider } from './app/PageContext';
import { LanguageProvider } from './locales/LanguageContext';
import SearchResult from './pages/board/search result/SearchResult';

// 비번: !Testuser1
function App() {

  return (
    <PageProvider>
      <LanguageProvider>
        <div className="App"> 
          <Header />   
          <Routes>
            <Route path="/" element={<Main />} />  
            <Route path="/detail" element={<Detail />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path='/register' element={<SignUpFirst />} />
            <Route path='/mypage' element={<MyPage />} />
            <Route path='/write' element={<Write />} />
            <Route path='/edit/:id' element={<Edit />} />
            <Route path='/detail/:id' element={<Detail />} />
            <Route path='/search' element={<SearchResult />} />
          </Routes>
        </div>
      </LanguageProvider>
    </PageProvider>

  );
}

export default App;
