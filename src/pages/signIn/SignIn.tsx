import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';
import React, { useState } from 'react';
import { loginUser } from '../../features/authSlice'; 
import { useDispatch } from 'react-redux';
import Modal from '../../component/Modal';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from '@/app/store';



const SignIn = () => {
    const [ formData, setFormData ] = useState({ email:'', password:'', });
    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    //다국어 처리 
    const { t } = useTranslation();

    const onNavigate = () => {
        navigate('/');
    }
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await dispatch(loginUser(formData));
            setErrorMessage('');
            onNavigate();
        }catch (error: any) {
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
                    <div className="signin top-title">{t('login')}</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="signin email">
                        <div className='email-container'>
                            <div  className='signin-email'>{t('email')}</div>
                            <input type='email' 
                                name='email'
                                className='bottom-border' 
                                placeholder= {t('email-placeholder')}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />            
                        </div>                       
                    </div>
                
                    
                    <div className="signin password">
                        <div className='password-container'>
                            <div className='signin-pw'>{t('password')}</div>
                            <input 
                            type='password'
                            name='password'
                            className='bottom-border' 
                            placeholder={t('password-placeholder')}
                            value={formData.password}
                            onChange={handleChange}
                            />
                            
                        </div>       
                    </div>
                    
                    
                    {/* 로그인버튼 */}
                    <button className='signIn-btn'
                    type='submit'
                    >{t('login')}</button>
                    <p><Modal message={errorMessage} onClose={handleCloseModal} /></p>
                </form>

                <div className="signup bottom">       
                    <div className='have-account'>
                        <div className='account-yn'>{t('new here?')}</div>
                        <div>
                            <Link to={'/register'} 
                            style={{ textDecoration: "none", color: "gray"}}>
                                {t('sign up')}
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
            
       
        </div>
    )
}

export default SignIn;