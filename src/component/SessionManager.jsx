import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, logoutSuccess } from '../features/authSlice';
import { useNavigate, useParams } from 'react-router-dom';

const SessionManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const checkSession = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return; // 토큰이 없으면 세션 체크를 생략
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(loginSuccess({ user: response.data.user, token }));
        } catch (error) {
            dispatch(logoutSuccess()); // 세션 만료 시 로그아웃 처리 
        }
    };

    const refreshToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return; // 토큰이 없으면 토큰 갱신 생략
        }
        try {
            const response = await axios.post('http://localhost:5000/api/refresh-token', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem('token', response.data.token); // 새로운 토큰 저장
        } catch (error) {
            if (error.response && error.response.status === 401) {
                dispatch(logoutSuccess()); // 세션 만료 시 로그아웃 처리 
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                navigate('/signIn');
            } else {
                dispatch(logoutSuccess());
            }
        }
    };

    useEffect(() => {
        if (id) {
            checkSession(id); // id가 있을 때 세션 체크 호출
        }

        const interval = setInterval(() => {
            refreshToken(); // 5분마다 토큰 갱신
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [dispatch, id, navigate]);

    return null; // 렌더링할 내용이 없으므로 null 반환
};

export default SessionManager;
