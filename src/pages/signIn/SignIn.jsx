import { Link } from 'react-router-dom';
import './SignIn.css';
import { useForm } from "react-hook-form";

const SignIn = () => {

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, isSubmitted, errors },
    } = useForm();

    return(
        <div className="SignIn">
            
            <div className="signin container">
                <div className="signin top">
                    <div className="signin top-title">로그인</div>
                </div>

                <form
                    onSubmit={handleSubmit(async (data) => {
                        await new Promise((r) => setTimeout(r,1000));
                        alert(JSON.stringify(data));
                    })}
                >
                    <div className="signin email">
                        <div className='email-container'>
                            <div  className='signin-email'>이메일주소</div>
                            <input type='email' 
                            id='email'
                            className='bottom-border' 
                            placeholder= {errors.email ? errors.email.message : '이메일을 입력해주세요'}
                            aria-invalid={
                                isSubmitted ? (errors.email ? "true" : "false") : undefined
                            }
                            {...register("email", {
                                required: "이메일은 필수 입력입니다.",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "이메일 형식에 맞지 않습니다."
                                },
                            })}
                            />            
                        </div>                       
                    </div>
                
                    
                    <div className="signin password">
                        <div className='password-container'>
                            <div className='signin-pw'>비밀번호</div>
                            <input 
                            type='password'
                            id='password'
                            className='bottom-border' 
                            placeholder={errors.password ? errors.password.message : '비밀번호를 입력해주세요'}
                            aria-invalid={
                                isSubmitted ? (errors.password ? "true" : "false") : undefined
                            }
                            {...register("password", {
                                required: "비밀번호는 필수 입력입니다.",
                                minLength: {
                                    value: 8,
                                    message: "8자리 이상 비밀번호를 입력해주세요"
                                },
                            })}
                            />
                            
                        </div>       
                    </div>
                    
                    
                    {/* 로그인버튼 */}
                    <button className='signIn-btn'
                    type='submit'
                    disabled={isSubmitting}
                    >로그인</button>

                </form>

                <div className="signup bottom">       
                    <div className='have-account'>
                        <div className='account-yn'>신규 사용자이신가요?</div>
                        <div>
                            <Link to={'/pages/signUp/SignUpFirst'} 
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