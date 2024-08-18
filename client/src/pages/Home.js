import Nav from '../components/Nav'
import AuthModal from "../components/AuthModal"
import {useState, useEffect} from 'react'
import {useCookies} from "react-cookie"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken
    const navigate = useNavigate()

    useEffect(() => {
        // Reset modal state when the authentication token changes
        if (authToken) {
            setShowModal(false)
        }
    }, [authToken])

    const handleClick = () => {
        if (authToken) {
            // User is authenticated, handle signout
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }

        if (isSignUp) {
            // Navigate to onboarding page
            navigate('/onboarding')
        } else {
            // Show authentication modal if not signing up
            setShowModal(true)
        }
    }

    return (
        <div className="overlay">
            <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
            <div className="home">
                <h1 className="primary-title">Swipe Left to Connect</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? 'Signout' : 'Create Account'}
                </button>

                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} setIsSignUp={setIsSignUp}/>
                )}
            </div>
        </div>
    )
}

export default Home
