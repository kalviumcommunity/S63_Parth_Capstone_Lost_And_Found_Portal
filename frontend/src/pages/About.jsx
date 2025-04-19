// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Optional: For linking within the text

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-3">
          About Founder's Hub
        </h1>

        {/* Mission/Vision Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Losing something valuable can be distressing, and finding something without knowing its owner can be frustrating. Founder's Hub was created to bridge this gap. Our mission is to provide a simple, reliable, and community-driven platform to help reunite lost items with their rightful owners efficiently and securely.
          </p>
        </section>

        {/* How It Works Recap Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">How We Help</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
            <li>
              <strong className="font-medium">Easy Reporting:</strong> Quickly post details and photos of items you've lost or found using our straightforward forms.
            </li>
            <li>
              <strong className="font-medium">Smart Search:</strong> Our platform helps you search through listings to find potential matches for your lost item.
            </li>
            <li>
              <strong className="font-medium">Secure Connection:</strong> Initiate claims for found items and connect directly with the reporter to verify ownership and arrange a safe return. (We facilitate the connection, the return is up to users).
            </li>
            <li>
              <strong className="font-medium">Community Focused:</strong> Built on the principle of helping each other, Founder's Hub relies on the honesty and participation of its users.
            </li>
          </ul>
        </section>

        {/* Values or Commitment Section (Optional) */}
        <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
                We are committed to maintaining user privacy (especially regarding verification documents) and fostering a trustworthy environment. While we cannot guarantee every item will be returned, we strive to provide the best possible tool to increase the chances. Please review our <Link to="/guidelines" className="text-blue-600 hover:underline">Guidelines</Link> and <Link to="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</Link> for more information on using the platform safely and effectively.
            </p>
        </section>

         {/* Team Section (Optional Placeholder) */}
         {/* <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Meet the Team</h2>
             <p className="text-gray-600 leading-relaxed">
                Founder's Hub was developed by [Your Name/Team Name] as a capstone project for [Your Course/University]. We are passionate about using technology to solve real-world problems.
            </p>
            Add team member details or photos here if desired
        </section> */}

      </div>
    </div>
  );
};

export default About;