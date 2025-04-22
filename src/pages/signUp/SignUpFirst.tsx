import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './SignUpFirst.css';
import Header from '../header/Header';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../features/authSlice';
import Modal from '../../component/Modal';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signUpValidationSchema } from '../../validation';
import { AppDispatch } from '@/app/store';



const SignUpFirst = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [modalErrorMessage, setModalErrorMessage] = useState(null);

    return (
        <div className="SignUp">
            <Header />

            <div className="signup signup-container">
                <div className="signup top">
                    <div className="signup top-title">{t('sign up')}</div>
                </div>

                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        nickname: '',
                        telNumber: '',
                        address: '',
                        addressDetail: '',
                    }}
                    initialStatus={{ submit: '' }}
                    validationSchema={signUpValidationSchema(t)}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        try {
                            dispatch(registerUser(values));
                            navigate('/signin');
                        } catch (error: any) {
                            setStatus({ submit: error.response?.data.message || 'Registration failed', });

                            // show error in modal
                            setModalErrorMessage(error.response?.data.message || 'Registration failed');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            {status?.submit && <div className="error">{status.submit}</div>}
                            <div className="signup email">
                                <div className='email-container'>
                                    <div className='signup-email'>{t('email')}*</div>
                                    <Field
                                        className='bottom-border'
                                        type='email'
                                        placeholder={t('email-placeholder')}
                                        name='email'
                                    />
                                    <ErrorMessage name="email" component="div" className="error" />
                                </div>
                            </div>

                            <div className="signup password">
                                <div className='password-container'>
                                    <div className='signup-pw'>{t('password')}*</div>
                                    <Field
                                        className='bottom-border'
                                        type='password'
                                        placeholder={t('password-validation')}
                                        name='password'
                                    />
                                    <ErrorMessage name="password" component="div" className="error" />
                                </div>
                            </div>

                            <div className="signup password">
                                <div className='password-container'>
                                    <div className='signup-pw'>{t('password confirm')}*</div>
                                    <Field
                                        className='bottom-border'
                                        type='password'
                                        placeholder={t('password confirm')}
                                        name='confirmPassword'
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="error" />
                                </div>
                            </div>

                            <div className="signup nickname">
                                <div className='nickname-container'>
                                    <div className='mid-content'>{t('nickname-signup')}*</div>
                                    <Field
                                        className='bottom-border'
                                        placeholder={t('nickname-placeholder')}
                                        name='nickname'
                                    />
                                    <ErrorMessage name="nickname" component="div" className="error" />
                                </div>
                            </div>

                            <div className="signup pnumber">
                                <div className='phone-container'>
                                    <div className='mid-content'>{t('phone')}*</div>
                                    <Field
                                        className='bottom-border'
                                        name='telNumber'
                                    />
                                    <ErrorMessage name="telNumber" component="div" className="error" />
                                </div>
                            </div>

                            <div className="signup address">
                                <div className='address1-container'>
                                    <div className='mid-content'>{t('address1')}*</div>
                                    <Field
                                        className='bottom-border'
                                        name='address'
                                    />
                                    <ErrorMessage name="address" component="div" className="error" />
                                </div>
                            </div>

                            <div className="signup detailed-address">
                                <div className='address2-container'>
                                    <div className='mid-content'>{t('address2')}</div>
                                    <Field
                                        className='bottom-border'
                                        name='addressDetail'
                                    />
                                </div>
                            </div>

                            <button className='signup-btn' type='submit' disabled={isSubmitting}>
                                {t('sign up')}
                            </button>

                            {modalErrorMessage && (
                                <Modal message={modalErrorMessage} onClose={() => setModalErrorMessage(null)} />
                            )}
                        </Form>
                    )}
                </Formik>

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
