// src/pages/Contact.jsx
import React, { useState } from 'react';
import axios from 'axios'; // <<<--- Import axios

// Optional: Import icons if you use them (e.g., from react-icons)
// import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    // State for the contact form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState(''); // To show success/error messages
    const [isError, setIsError] = useState(false); // Differentiate error/success styling
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // --- UPDATED handleSubmit Function ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus('');
        setIsError(false); // Reset error state

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Send data to the backend endpoint we created
            const response = await axios.post(`${apiUrl}/api/contact`, formData);

            // Use success message from backend
            setFormStatus(response.data.message || 'Message sent successfully! We will get back to you soon.');
            setIsError(false); // Ensure success styling
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form

        } catch (err) {
            console.error("Contact Form Error:", err.response?.data || err.message);
            // Get specific error message from backend if available
             const errorMsg = err.response?.data?.errors
                ? err.response.data.errors.map(e => e.msg).join(', ')
                : err.response?.data?.message || 'Failed to send message. Please try again later.';
            setFormStatus(errorMsg);
            setIsError(true); // Ensure error styling
        } finally {
            setLoading(false);
        }
    };
    // --- END UPDATED handleSubmit ---


    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">

                {/* Page Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-3">
                    Contact Us
                </h1>
                <p className="mb-8 text-gray-600">
                    Have questions, feedback, or need support? Reach out to us using the form below or via our contact details.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Contact Information Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Get in Touch</h2>
                        <div className="space-y-4 text-gray-600">
                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:support@foundershub.example.com" className="hover:text-blue-700 hover:underline">
                                    parthsarawgi18@gmail.com {/* Replace */}
                                </a>
                            </div>
                             {/* Add other contact details like Phone or Address if needed */}
                        </div>
                    </section>

                    {/* Contact Form Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Send Us a Message</h2>

                        {/* --- UPDATED Form Status Message Display --- */}
                        {formStatus && (
                            <p className={`text-sm text-center p-3 rounded mb-4 border ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                {formStatus}
                            </p>
                        )}
                        {/* --- END UPDATED --- */}

                        <form onSubmit={handleSubmit} className="space-y-4">
                             {/* Input fields remain the same */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="input-style" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email <span className="text-red-500">*</span></label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="input-style" />
                            </div>
                             <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} className="input-style" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                                <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleChange} required className="input-style"></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
              </div>
               {/* Reusable input style */}
             <style jsx>{`
                .input-style { @apply shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
            `}</style>
        </div>
    );
};

export default Contact;