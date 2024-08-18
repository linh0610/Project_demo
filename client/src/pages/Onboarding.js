import Nav from '../components/Nav'
import {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from "axios";


const Onboarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        email: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        url: "",
        university:"",
        about: "",
        matches: []

    })
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate()

    const fetchUniversities = async (query) => {
        if (query.length < 2) {  // Start suggesting after at least 2 characters
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
            const universities = await response.json();
            setSuggestions(universities.slice(0, 10));
        } catch (err) {
            console.error('Error fetching university data:', err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }

    const validateUniversityName = async (name) => {
        try {
            const response = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(name)}`);
            const universities = await response.json();
            return universities.some(university => university.name.toLowerCase() === name.toLowerCase());
        } catch (err) {
            console.error('Error fetching university data:', err);
            return false;
        }
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const isUniversityValid = await validateUniversityName(formData.university);
        if (!isUniversityValid) {
            alert("Please enter a valid university name.");
            return;
        }

        if (!validateEmail(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }
        try {
            const response = await axios.put('http://localhost:8000/user', { formData })
            const success = response.status === 200
            if (success) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'university') {
            fetchUniversities(value);
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setFormData(prevState => ({
            ...prevState,
            university: suggestion
        }));
        setSuggestions([]);  // Clear suggestions
    }


    return (
        <>
            <Nav minimal={true} setShowModal={() => {}} showModal={false} />

            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required={true}
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <label htmlFor="university">University</label>
                        <div className="university-container">
                            <input
                                id="university"
                                type="text"
                                name="university"
                                placeholder="Your University"
                                value={formData.university}
                                onChange={handleChange}
                            />
                            {loading && <p>Loading...</p>}
                            {suggestions.length > 0 && (
                                <div className="suggestions-container">
                                    <ul>
                                        {suggestions.map((university, index) => (
                                            <li key={index} onClick={() => handleSuggestionClick(university.name)}>
                                                {university.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <div className="checkbox-container">
                            <input
                                id="show-gender"
                                type="checkbox"
                                name="show_gender"
                                onChange={handleChange}
                                checked={formData.show_gender}
                            />
                            <label htmlFor="show-gender">Show Gender on my Profile</label>
                        </div>

                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like java..."
                            value={formData.about}
                            onChange={handleChange}
                        />

                        <input type="submit" />
                    </section>

                    <section>
                        <label htmlFor="url">Profile Photo</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview" />}
                        </div>
                    </section>
                </form>
            </div>
        </>
    )
}
export default Onboarding