import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import SwipeableCard from '../components/SwipeableCard'; // Adjust import based on location
import ChatContainer from '../components/ChatContainer';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [universityMatchedUsers, setUniversityMatchedUsers] = useState([]);
    const [lastDirection, setLastDirection] = useState(null);
    const [searchUserId, setSearchUserId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [cookies] = useCookies(['user']);

    const userId = cookies.UserId;

    // Dummy data
    const dummyUsers = [
        { user_id: "1", first_name: "Alice", university: "University A", url: "https://example.com/alice.jpg", matches: [] },
        { user_id: "2", first_name: "Bob", university: "University B", url: "https://example.com/bob.jpg", matches: [] },
        { user_id: "3", first_name: "Charlie", university: "University A", url: "https://example.com/charlie.jpg", matches: [] }
    ];

    // Simulate fetching user
    const getUser = () => {
        const userData = dummyUsers.find(user => user.user_id === userId);
        setUser(userData || null);
    };

    // Simulate fetching university-matched users
    const getUniversityMatchedUsers = () => {
        const matchedUsers = dummyUsers.filter(user => user.university === user?.university && user.user_id !== userId);
        setUniversityMatchedUsers(matchedUsers);
    };

    // Simulate searching user by userId
    const searchUser = () => {
        if (searchUserId) {
            const userData = dummyUsers.find(user => user.user_id === searchUserId);
            setSearchResult(userData || null);
        }
    };

    useEffect(() => {
        getUser();
    }, [userId]);

    useEffect(() => {
        if (user) {
            getUniversityMatchedUsers();
        }
    }, [user]);

    const updateMatches = (matchedUserId) => {
        // Simulate updating matches
        const updatedUser = { ...user, matches: [...user.matches, { user_id: matchedUserId }] };
        setUser(updatedUser);
    };

    const swiped = (direction, swipedUserId) => {
        if (direction === 'left') {
            updateMatches(swipedUserId);
        }
        setLastDirection(direction);
    };

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!');
    };

    return (
        <>
            {user && (
                <div className="dashboard">
                    <ChatContainer user={user} />
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by userId"
                            value={searchUserId}
                            onChange={(e) => setSearchUserId(e.target.value)}
                        />
                        <button onClick={searchUser}>Search</button>
                    </div>
                    {searchResult && (
                        <div className="search-result">
                            <h3>Search Result</h3>
                            <div
                                style={{ backgroundImage: `url(${searchResult.url})` }}
                                className="card"
                            >
                                <h3>{searchResult.first_name}</h3>
                            </div>
                        </div>
                    )}
                    <div className="swipe-container">
                        <div className="card-container">
                            {universityMatchedUsers?.map((universityUser) => (
                                <SwipeableCard
                                    key={universityUser.user_id}
                                    onSwipe={(dir) => swiped(dir, universityUser.user_id)}
                                    onCardLeftScreen={() => outOfFrame(universityUser.first_name)}
                                >
                                    <div
                                        style={{ backgroundImage: `url(${universityUser.url})` }}
                                        className="card"
                                    >
                                        <h3>{universityUser.first_name}</h3>
                                    </div>
                                </SwipeableCard>
                            ))}
                            <div className="swipe-info">
                                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
