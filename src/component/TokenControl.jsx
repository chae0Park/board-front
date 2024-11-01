import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode'; // Ensure you import jwt-decode
import Modal from './Modal';

const TokenControl = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const expTime = decodedToken.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const timeLeft = expTime - now;

            // Set notification 5 minutes before expiration
            const notifyTime = timeLeft - 5 * 60 * 1000; // 5 minutes in milliseconds
            if (notifyTime > 0) {
                const notificationTimer = setTimeout(() => {
                    setNotification(`Your session will expire in ${Math.floor(notifyTime / 1000 / 60)} minutes.`);
                }, notifyTime);

                return () => clearTimeout(notificationTimer); // Cleanup on unmount
            }

            // Check for expiration
            const expirationTimer = setTimeout(() => {
                setIsModalVisible(true);
            }, timeLeft);

            return () => clearTimeout(expirationTimer); // Cleanup on unmount
        }
    }, []);

    const handleExtendSession = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in again.');
            return;
        }

        const response = await fetch('http://localhost:5000/api/extend-session', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  // Use sessionStorage here
            },
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('token', data.token); // Save the new token in sessionStorage
            setNotification('Session extended successfully.'); // Optional: Notify user
            setIsModalVisible(false); // Close the modal
        } else {
            const errorData = await response.json(); // Get error response
            setNotification(errorData.message || 'Failed to extend session. Please try again.'); // Notify user of error
            console.error('Failed to extend session:', errorData);
        }
    };

    return (
        <div>
            {notification && <div>{notification}</div>}
            <Modal message={isModalVisible ? 'Your session has expired. Please log in again.' : null} onClose={() => setIsModalVisible(false)} />
            <button onClick={handleExtendSession}>Extend Session</button>
        </div>
    );
};

export default TokenControl;
