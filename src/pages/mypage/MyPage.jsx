import { useSelector } from 'react-redux';


const UserProfile = () => {
    const user = useSelector((state) => state.auth.user);

    if (!user) return <p>Please log in to see your profile.</p>;

    return (
        <div> 
            <h1>Welcome, {user.nickname}!</h1>
            <h1>Profile Information</h1>
            <p>Name: {user.nickname}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default UserProfile;
