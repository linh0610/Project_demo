import logo from '../images/logo_transparent.png'
import colorLogo from '../images/logo.png'

const Nav = ({ minimal, authToken}) => {

    return (
        <nav>
        <div className="logo-container">
            <img className="logo" src={minimal ? colorLogo: logo}/>
        </div>

        {!authToken && <button className='nav-button'>Log in</button>}
        </nav>
    )
}
export default Nav