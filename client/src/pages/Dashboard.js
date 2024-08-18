import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
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

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:3000/user', {
                params: { userId }
            });
            setUser(response.data);
        } catch (error) {
            console.log("Error fetching user:", error);
        }
    };

    const getUniversityMatchedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/university-matched-users', {
                params: { university: user?.university }
            });
            setUniversityMatchedUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const searchUser = async () => {
        if (searchUserId) {
            try {
                const response = await axios.get('http://localhost:3000/user', {
                    params: { userId: searchUserId }
                });
                setSearchResult(response.data);
            } catch (error) {
                console.log(error);
                setSearchResult(null);
            }
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            getUniversityMatchedUsers();
        }
    }, [user]);

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:3000/addmatch', {
                userId,
                matchedUserId
            });
            getUser();
        } catch (err) {
            console.log(err);
        }
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

    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId);
    const filteredUniversityMatchedUsers = universityMatchedUsers?.filter(universityUser => !matchedUserIds.includes(universityUser.user_id));

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
                                style={{backgroundImage: `url(${searchResult.url})`}}
                                className="card"
                            >
                                <h3>{searchResult.first_name}</h3>
                            </div>
                        </div>
                    )}
                    <div className="swipe-container">
                        <div className="card-container">
                            {filteredUniversityMatchedUsers?.map((universityUser) => (
                                <SwipeableCard
                                    key={universityUser.user_id}
                                    onSwipe={(dir) => swiped(dir, universityUser.user_id)}
                                    onCardLeftScreen={() => outOfFrame(universityUser.first_name)}
                                >
                                    <div
                                        style={{backgroundImage: `url(${searchResult.url})`}}
                                        className="card"
                                    >
                                        <h3>{searchResult.first_name}</h3>
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