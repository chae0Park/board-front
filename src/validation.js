// validationSchema.js
import * as Yup from 'yup';

export const signUpValidationSchema = (t) => Yup.object({
    email: Yup.string()
        .email(t('valid-email')) // t()를 사용하여 동적 메시지 적용
        .required(t('email-required')),
    password: Yup.string()
        .min(8, t('password more than 8'))
        .max(15, t('password less than 15'))
        .matches(/[A-Z]/, t('cap needed'))
        .matches(/[\W_]/, t('special character needed'))
        .required(t('password required')),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], t('password different'))
        .required(t('password confirm required')),
    nickname: Yup.string()
        .max(10, t('nickname less than 11'))
        .matches(/^[a-zA-Z0-9]*$/, t('nickname included only string and int'))
        .required(t('nickname required')),
    telNumber: Yup.string().required(t('phone required')),
    address: Yup.string().required(t('address1 required')),
});
