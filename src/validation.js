// validationSchema.js
import * as Yup from 'yup';

export const signUpValidationSchema = Yup.object({
    email: Yup.string()
        .email('유효한 이메일을 입력하세요.')
        .required('이메일은 필수입니다.'),
    password: Yup.string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
        .max(15, '비밀번호는 최대 15자까지 가능합니다.')
        .matches(/[A-Z]/, '대문자를 포함해야 합니다.')
        .matches(/[\W_]/, '특수 문자를 포함해야 합니다.')
        .required('비밀번호는 필수입니다.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], '비밀번호가 다릅니다.')
        .required('비밀번호 확인은 필수입니다.'),
    nickname: Yup.string()
        .max(10, '닉네임은 10자 이내여야 합니다.')
        .matches(/^[a-zA-Z0-9]*$/, '닉네임은 문자와 숫자만 포함해야 합니다.')
        .required('닉네임은 필수입니다.'),
    telNumber: Yup.string().required('전화번호는 필수입니다.'),
    address: Yup.string().required('주소는 필수입니다.'),
});
