import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AuthModal = ({ setShowModal, setIsSignUp, isSignUp }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const navigate = useNavigate()

    const handleClose = () => {
        setShowModal(false)
        setIsSignUp(true) // Reset to default sign up state when closing
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isSignUp && password !== confirmPassword) {
            setError('Passwords need to match!')
            return
        }

        try {
            const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, { email, password })

            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)

            if (response.status === 201) {
                if (isSignUp) navigate('/onboarding')
                else navigate('/dashboard')
            }

            handleClose() // Close the modal after successful login/signup
        } catch (error) {
            setError('An error occurred. Please try again.') // Set a general error message
            console.error(error) // Log error details for debugging
        }
    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClose}>ⓧ</div>

            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
            <p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && (
                    <input
                        type="password"
                        id="password-check"
                        name="password-check"
                        placeholder="confirm password"
                        required={true}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
            </form>

            <hr/>
            <h2>GET THE APP</h2>
        </div>
    )
}

export default AuthModal
