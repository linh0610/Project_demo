const Chat = ({ descendingOrderMessages }) => {
    return (
        <div className="chat-display">
            {descendingOrderMessages && descendingOrderMessages.length > 0 ? (
                descendingOrderMessages.map((message, _index) => (
                    <div key={_index} className="chat-message">
                        <div className="chat-message-header">
                            <div className="img-container">
                                <img src={message.img} alt={`${message.name} profile`} />
                            </div>
                            <p className="chat-message-name">{message.name}</p>
                        </div>
                        <p className="chat-message-content">{message.message}</p>
                        {message.timestamp && (
                            <p className="chat-message-timestamp">
                                {new Date(message.timestamp).toLocaleString()}
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <p>No messages to display</p>
            )}
        </div>
    );
}

export default Chat;
