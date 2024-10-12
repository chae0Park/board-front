import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, uploadProfileImage } from '../../features/authSlice';
import default_user from '../../assets/image/user-1699635_1280.png';

const MyPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth); // Redux 상태에서 사용자 정보 가져오기
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserProfile(user.id)); // 사용자 정보를 가져오는 액션 호출
        }

    }, [dispatch, user]);
  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file); // 선택한 파일을 상태에 저장
    };

    const handleUpload = () => {
        if (selectedFile) {
            dispatch(uploadProfileImage(selectedFile, user.id)); // 프로필 이미지 업로드 액션 호출
            setSelectedFile(null); // 업로드 후 선택된 파일 초기화
        } else {
            alert('Please select a file to upload.'); // 파일이 선택되지 않았을 때 알림
        }
    };


    if (!user) {
        return <div>Loading...</div>; // 사용자 정보가 로드 중일 때 표시할 메시지
    }

    return (
        <div>
            <h1>My Page</h1>
            <h2>Welcome, {user.nickname}!</h2>
            <div>
                <img src={user.profileImage || default_user } alt="Profile" style={{ width: '100px', height: '100px' }} />
            </div>
            <p>{user.id}</p>
            <p>user name: {user.nickname}</p>
            <p>Email: {user.email}</p>
            {/* 프로필 이미지 업데이트  */}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default MyPage;
