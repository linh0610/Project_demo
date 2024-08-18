import { useCookies } from 'react-cookie';

const ChatHeader = ({ user }) => {
    const [cookies, , removeCookie] = useCookies(['user']);

    const logout = () => {
        removeCookie('UserId');
        removeCookie('AuthToken');
        window.location.reload();
    };

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url} alt={`photo of ${user.first_name}`} />
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <button className="log-out-icon" onClick={logout} aria-label="Logout">
                ⇦
            </button>
        </div>
    );
};

export default ChatHeader;
