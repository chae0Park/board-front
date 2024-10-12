import Detail from './pages/board/detail/Detail';
import { Routes, Route } from 'react-router-dom';
import Header from './pages/header/Header';
import Main from './pages/board/main/Main'
import SignIn from './pages/signIn/SignIn';
import SignUpFirst from './pages/signUp/SignUpFirst';
import Write from './pages/board/write/Write';
import MyPage from './pages/mypage/MyPage';




function App() {


  return (
    <div className="App"> 
        <Header />   
        <Routes>
          <Route path="/" element={<Main />} />  
          <Route path="/detail" element={<Detail />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path='/register' element={<SignUpFirst />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/write' element={<Write />} />
          <Route path='/detail/:id' element={<Detail />} />
        </Routes>
    </div>
  );
}

export default App;
