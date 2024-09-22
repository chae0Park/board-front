import { Link } from 'react-router-dom';
import './SignUpFirst.css';
import Header from '../board/header/Header';
import { useState } from 'react';

const SignUpFirst = ({ onCreateUser }) => {
    //여러개의 input값을 가져와야 할 때 default
    const [ info, setInfo ] = useState({
        email: '',
        password: '',
        nickname: '',
        telNumber: '',
        address: '',
        addressDetail: '',
        agreedPersonal: false,
    });

    const { email, password, nickname, telNumber, address, addressDetail } = info;

    //여러개의 input을 State로 관리할 때 
    const onChangeInfo = (e) => {
        const { value, name } = e.target;
        setInfo({...info, [name]:value }); // email: 'a123@gmail.com'

    };

    //onCreateUser 함수 호출 
    const onSubmit = (e) => {
        e.preventDefault();// it doesn’t refresh the page when the page is refreshed
        onCreateUser(info);
    };

    return (
        <div className="SignUp"> 
            <Header />

            <div className="signup signup-container">
                <div className="signup top">
                    <div className="signup top-title">회원가입</div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="signup email">
                        <div className='email-container'>
                            <div className='signup-email'>이메일주소*</div>
                            <input
                                className='bottom-border'
                                type='email'
                                placeholder='이메일을 입력해주세요'
                                value={email}
                                name='email'
                                onChange={onChangeInfo}
                            />     
                        </div>
                    </div>
                    
                    <div className="signup password">
                        <div className='password-container'>
                            <div className='signup-pw'>비밀번호*</div>
                            <input 
                                className='bottom-border'
                                type='password'
                                placeholder='8~15자 이내, 대문자와 특수기호를 포함해주세요.'
                                value={password}
                                name='password'
                                onChange={onChangeInfo}
                            />
                        </div>
                    </div>

                    <div className="signup password">
                        <div className='password-container'>
                            <div className='signup-pw'>비밀번호확인*</div>
                            <input 
                                className='bottom-border'
                                type='password'
                                placeholder='비밀번호를 다시 입력해주세요'
                                
                            />
                        </div>
                    </div>

                    <div className="signup nickname">
                            <div className='nickname-container'>
                                <div  className='mid-content'>닉네임*</div>
                                <input className='bottom-border' 
                                    placeholder='닉네임을 입력해주세요'
                                    value={nickname}
                                    name='nickname'
                                    onChange={onChangeInfo}
                                />   
                            </div>                       
                        </div>
                    
                    
                    <div className="signup pnumber">
                        <div className='phone-container'>
                            <div className='mid-content'>핸드폰 번호*</div>
                            <input 
                                className='bottom-border' 
                                placeholder='핸드폰 번호를 입력해주세요'
                                value={telNumber}
                                name='telNumber'
                                onChange={onChangeInfo}
                            />
                                           
                        </div>       
                    </div>

                    <div className="signup address">
                        <div className='address1-container'>
                            <div className='mid-content'>주소*</div>
                            <input 
                                className='bottom-border' 
                                placeholder='주소를 입력해주세요'
                                value={address}
                                name='address'
                                onChange={onChangeInfo}
                            />
                            
                        </div>       
                    </div>

                    <div className="signup detailed-address">
                        <div className='address2-container'>
                            <div className='mid-content'>상세주소</div>
                            <input 
                                className='bottom-border' 
                                placeholder='상세주소를 입력해주세요'
                                value={addressDetail}
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
                        회원가입
                    </button>
                </form>

                <div className="signup bottom">
                    <div className='have-account'>
                        <div className='account-yn'>이미 계정이 있으신가요?</div>
                        <div><Link to={'/pages/signIn/SignIn'}>로그인</Link></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpFirst;
