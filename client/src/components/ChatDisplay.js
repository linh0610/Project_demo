import Chat from './Chat';
import ChatInput from './ChatInput';
import axios from 'axios';
import { useState, useEffect } from 'react';

const ChatDisplay = ({ user, clickedUser }) => {
    const userId = user?.user_id;
    const clickedUserId = clickedUser?.user_id;
    const [usersMessages, setUsersMessages] = useState(null);
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null);

    const getUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId, correspondingUserId: clickedUserId }
            });
            setUsersMessages(response.data);
        } catch (error) {
            console.log('Error fetching user messages:', error);
        }
    };

    const getClickedUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId: clickedUserId, correspondingUserId: userId }
            });
            setClickedUsersMessages(response.data);
        } catch (error) {
            console.log('Error fetching clicked user messages:', error);
        }
    };

    useEffect(() => {
        if (userId && clickedUserId) {
            getUsersMessages();
            getClickedUsersMessages();
        }
    }, [userId, clickedUserId]);

    const messages = [];

    usersMessages?.forEach((message) => {
        const formattedMessage = {
            name: user?.first_name,
            img: user?.url,
            message: message.message,
            timestamp: message.timestamp
        };
        messages.push(formattedMessage);
    });

    clickedUsersMessages?.forEach((message) => {
        const formattedMessage = {
            name: clickedUser?.first_name,
            img: clickedUser?.url,
            message: message.message,
            timestamp: message.timestamp
        };
        messages.push(formattedMessage);
    });

    const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return (
        <>
            <Chat descendingOrderMessages={descendingOrderMessages} />
            <ChatInput
                user={user}
                clickedUser={clickedUser}
                getUsersMessages={getUsersMessages}
                getClickedUsersMessages={getClickedUsersMessages}
            />
        </>
    );
};

export default ChatDisplay;
