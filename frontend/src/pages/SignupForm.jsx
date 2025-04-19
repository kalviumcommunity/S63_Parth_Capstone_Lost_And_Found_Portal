import React, { useState } from 'react';
import axios from 'axios'; // Make sure you have installed axios: npm install axios

const SignupForm = () => {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // State for the selected file

    // State for messages (success/error)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Optional: for loading state

    // Handle file input change
    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]); // Get the first selected file
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default page reload
        setMessage('');
        setError('');
        setLoading(true);

        // --- Create FormData ---
        // FormData is needed to send files along with text data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture); // Append the file object
        }

        try {
            // --- Send data to backend ---
            // Replace with your actual backend API endpoint if different
            const response = await axios.post('http://localhost:5000/api/users/', formData, {
                headers: {
                    // Important for file uploads with FormData
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message); // Show success message
            // Optionally clear the form or redirect the user
            setName('');
            setEmail('');
            setPassword('');
            setProfilePicture(null);
            e.target.reset(); // Reset file input

        } catch (err) {
            // Handle errors (validation errors, server errors, etc.)
            console.error("Signup Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // --- JSX for the form ---
    return (
        <div>
            <h2>Sign Up</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="6"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="profilePicture">Profile Picture:</label>
                    <input
                        type="file"
                        id="profilePicture"
                        accept="image/png, image/jpeg, image/jpg" // Specify accepted file types
                        onChange={handleFileChange}
                    />
                     {/* Optional: Preview selected image */}
                     {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="Preview" width="100" />}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default SignupForm;