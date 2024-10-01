import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';
import { useState } from 'react';
import { loginUser } from '../../features/authSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../component/Modal';

const SignIn = () => {
    const [ formData, setFormData ] = useState({ email:'', password:'', });
    const [ errorMessage, setErrorMessage ] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onNavigate = () => {
        navigate('/');
    }

    //data update
    const user = useSelector((state) => state.auth.user);
    
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await dispatch(loginUser(formData));
            setErrorMessage('');
            onNavigate();
        }catch (error) {
            setErrorMessage(error.response?.data.message || 'User not exists');
        }
    }

    const handleCloseModal = () => {
        setErrorMessage('');
        setFormData({email: '', password: '',})
    }

    return(
        <div className="SignIn">
            
            <div className="signin container">
                <div className="signin top">
                    <div className="signin top-title">로그인</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="signin email">
                        <div className='email-container'>
                            <div  className='signin-email'>이메일주소</div>
                            <input type='email' 
                            name='email'
                            className='bottom-border' 
                            placeholder= {'이메일을 입력해주세요'}
                            
                            value={formData.email}
                            onChange={handleChange}
                            required
                            />            
                        </div>                       
                    </div>
                
                    
                    <div className="signin password">
                        <div className='password-container'>
                            <div className='signin-pw'>비밀번호</div>
                            <input 
                            type='password'
                            name='password'
                            className='bottom-border' 
                            placeholder={'비밀번호를 입력해주세요'}
                            value={formData.password}
                            onChange={handleChange}
                            />
                            
                        </div>       
                    </div>
                    
                    
                    {/* 로그인버튼 */}
                    <button className='signIn-btn'
                    type='submit'
                    >로그인</button>
                    <p><Modal message={errorMessage} onClose={handleCloseModal} /></p>
                </form>

                <div className="signup bottom">       
                    <div className='have-account'>
                        <div className='account-yn'>신규 사용자이신가요?</div>
                        <div>
                            <Link to={'/register'} 
                            style={{ textDecoration: "none", color: "gray"}}>
                                회원가입
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
            
       
        </div>
    )
}

export default SignIn;