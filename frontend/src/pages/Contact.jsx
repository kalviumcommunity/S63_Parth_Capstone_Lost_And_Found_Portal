// src/pages/Contact.jsx
import React, { useState } from 'react';
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
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus('');

        console.log("Contact Form Data:", formData); // Log data for now

        // --- Placeholder for Backend Integration ---
        // In a real app, you would send this data to your backend here
        // using axios.post('/api/contact', formData)
        // For now, simulate success after a short delay
        setTimeout(() => {
            setFormStatus('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
            setLoading(false);
        }, 1500); // Simulate network delay
        // --- End Placeholder ---

        // --- Example Error Simulation (uncomment to test) ---
        // setTimeout(() => {
        //     setFormStatus('Failed to send message. Please try again later.');
        //     setLoading(false);
        // }, 1500);
        // --- ---
    };

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
                                {/* Optional Icon: <FaEnvelope className="text-blue-600" /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:support@foundershub.example.com" className="hover:text-blue-700 hover:underline">
                                    support@foundershub.example.com {/* Replace with your actual email */}
                                </a>
                            </div>
                            {/* Address (Optional) */}
                            {/* <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>
                                    JECRC University<br />
                                    Jaipur, Rajasthan<br />
                                    India
                                </span>
                            </div> */}
                             {/* Phone (Optional) */}
                             {/* <div className="flex items-center gap-3"> ... Phone Icon ... <span>+91 123 456 7890</span></div> */}

                        </div>
                        {/* Social Media Links (Placeholder) */}
                        {/* <div className="mt-6">
                             <h3 className="text-md font-semibold text-gray-700 mb-2">Follow Us</h3>
                             <div className="flex gap-4">
                                <a href="#" className="text-gray-500 hover:text-blue-700">FB</a>
                                <a href="#" className="text-gray-500 hover:text-blue-700">TW</a>
                                <a href="#" className="text-gray-500 hover:text-blue-700">IN</a>
                            </div>
                        </div> */}
                    </section>

                    {/* Contact Form Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            {/* Form Status Message */}
                            {formStatus && (
                                <p className={`text-sm text-center p-2 rounded ${formStatus.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {formStatus}
                                </p>
                            )}
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