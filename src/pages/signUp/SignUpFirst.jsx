import { Link, useNavigate } from 'react-router-dom';
import './SignUpFirst.css';
import Header from '../header/Header';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../features/authSlice';
import Modal from '../../component/Modal';
import { useTranslation } from 'react-i18next';

const SignUpFirst = () => {
    //여러개의 input값을 가져와야 할 때 default
    const [ formData, setFormData ] = useState({
        email: '',
        password: '',
        nickname: '',
        telNumber: '',
        address: '',
        addressDetail: '',
        agreedPersonal: false,
    });
    const [ errorMessage,setErrorMessage ] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //다국어 처리 
    const { t } = useTranslation();

    const onNavigate = () => {
        navigate('/signin');
    }

    //const { email, password, nickname, telNumber, address, addressDetail } = info;

  
    const onChangeInfo = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value }); // email: 'a123@gmail.com'

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await dispatch(registerUser(formData));
            setErrorMessage('');
            onNavigate();
        }catch (error) {
            setErrorMessage(error.response?.data.message || 'Registration failed');
        }
    };

    const handleCloseModal = () => {
        setErrorMessage('');
        setFormData({email: '',
            password: '',
            nickname: '',
            telNumber: '',
            address: '',
            addressDetail: '',
            agreedPersonal: false,});
    };

    return (
        <div className="SignUp"> 
            <Header />

            <div className="signup signup-container">
                <div className="signup top">
                    <div className="signup top-title">{t('sign up')}</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="signup email">
                        <div className='email-container'>
                            <div className='signup-email'>{t('email')}*</div>
                            <input
                                className='bottom-border'
                                type='email'
                                placeholder={t('email-placeholder')}
                                value={formData.email}
                                name='email'
                                onChange={onChangeInfo}
                            />     
                        </div>
                    </div>
                    
                    <div className="signup password">
                        <div className='password-container'>
                            <div className='signup-pw'>{t('password')}*</div>
                            <input 
                                className='bottom-border'
                                type='password'
                                placeholder={t('password-validation')}
                                value={formData.password}
                                name='password'
                                onChange={onChangeInfo}
                            />
                        </div>
                    </div>

                    <div className="signup password">
                        <div className='password-container'>
                            <div className='signup-pw'>{t('password confirm')}*</div>
                            <input 
                                className='bottom-border'
                                type='password'
                                placeholder={t('password confirm')}
                                
                            />
                        </div>
                    </div>

                    <div className="signup nickname">
                            <div className='nickname-container'>
                                <div  className='mid-content'>{t('nickname-signup')}*</div>
                                <input className='bottom-border' 
                                    placeholder={t('nickname-placeholder')}
                                    value={formData.nickname}
                                    name='nickname'
                                    onChange={onChangeInfo}
                                />   
                            </div>                       
                        </div>
                    
                    
                    <div className="signup pnumber">
                        <div className='phone-container'>
                            <div className='mid-content'>
                            {t('phone')}*</div>
                            <input 
                                className='bottom-border' 
                                value={formData.telNumber}
                                name='telNumber'
                                onChange={onChangeInfo}
                            />
                                           
                        </div>       
                    </div>

                    <div className="signup address">
                        <div className='address1-container'>
                            <div className='mid-content'>{t('address1')}*</div>
                            <input 
                                className='bottom-border' 
                                value={formData.address}
                                name='address'
                                onChange={onChangeInfo}
                            />
                            
                        </div>       
                    </div>

                    <div className="signup detailed-address">
                        <div className='address2-container'>
                            <div className='mid-content'>{t('address2')}</div>
                            <input 
                                className='bottom-border' 
                                value={formData.addressDetail}
                                name='addressDetail'
                                onChange={onChangeInfo}
                                />
                                
                        </div>       
                    </div>

                    {/* Submit button without wrapping with Link */}
                    <button 
                        className='signup-btn' 
                        type='submit' 
                        
                    >
                        {t('sign up')}
                    </button>
                    <p><Modal message={errorMessage} onClose={handleCloseModal} /></p>
                </form>

                <div className="signup bottom">
                    <div className='have-account'>
                        <div className='account-yn'>{t('accountY/N')}</div>
                        <div><Link to={'/signIn'}>{t('login')}</Link></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpFirst;
