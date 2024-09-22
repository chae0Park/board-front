import { useForm } from "react-hook-form";
import './Input.css';

const Input = () => {

    const {
        register,
        formState: { isSubmitted, errors },
    } = useForm();

    return(
        <>
            <div className="Input">
                <div className='Input-container'>
                    <div  className='input-label'>이메일주소</div>
                    <input type='email' 
                    id='email'
                    className='bottom-border' 
                    placeholder='이메일을 입력해주세요'
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
                    {errors.email && <small role="alert" style={{ color: "tomato" }}>{errors.email.message}</small>}            
                </div>                       
            </div>
        </>
    )

}

export default Input;