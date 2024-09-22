import Detail from './pages/board/detail/Detail';
import { Routes, Route } from 'react-router-dom';
import Header from './pages/board/header/Header'
import Main from './pages/board/main/Main'
import SignIn from './pages/signIn/SignIn';
import SignUpFirst from './pages/signUp/SignUpFirst';
import Write from './pages/board/write/Write';



function App() {


  return (
    <div className="App"> 
        <Header />   
        <Routes>
          <Route path="/" element={<Main />} />  
          {/* <Route path="/pages/board/detail/Detail/:id" element={<Detail />} /> */}
          <Route path="/detail" element={<Detail />} />
          <Route path="/pages/signIn/SignIn" element={<SignIn />} />
          <Route path='/pages/signUp/SignUpFirst' element={<SignUpFirst />} />
          <Route path='/write' element={<Write />} />
        </Routes>
    </div>
  );
}

export default App;
