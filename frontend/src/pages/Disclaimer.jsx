// src/pages/Disclaimer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Optional for linking

const Disclaimer = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-3">
          Disclaimer & User Agreement
        </h1>
        <p className="mb-6 text-sm text-gray-500 italic">
          Last Updated: [Insert Date, e.g., April 18, 2024]. By using the Founder's Hub website ("Platform"), you agree to the terms outlined below.
        </p>

        {/* Section 1: Platform Purpose */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">1. Platform Purpose</h2>
          <p className="text-gray-600 leading-relaxed">
            Founder's Hub is a community platform designed solely to facilitate the connection between individuals who have lost items and individuals who have found items. We provide the tools for users to list items and potentially initiate contact, but we are not involved in the actual recovery, verification, or exchange process.
          </p>
        </section>

        {/* Section 2: No Guarantees */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">2. No Guarantees or Verification</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
            <li>
              Founder's Hub does <strong className="font-medium">not guarantee</strong> that any lost item will be found or returned through the use of this Platform.
            </li>
            <li>
              We do <strong className="font-medium">not verify</strong> the accuracy, legitimacy, or completeness of information provided in user-submitted lost or found reports. Users submit content at their own risk.
            </li>
            <li>
              We do <strong className="font-medium">not verify</strong> the identity of users or the authenticity of claims made for found items. The responsibility for verifying ownership rests solely with the users involved (the finder and the potential claimant).
            </li>
          </ul>
        </section>

        {/* Section 3: User Responsibility */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">3. User Responsibility</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
            <li>
              Users are solely responsible for the content they post, including the accuracy of descriptions and images.
            </li>
            <li>
              Users are solely responsible for verifying the identity and claims of other users they choose to interact with.
            </li>
            <li>
              Users are solely responsible for their safety when arranging and conducting offline meetups to return or collect items. We strongly advise following the <Link to="/guidelines" className="text-blue-600 hover:underline">Safety Tips</Link> outlined in our Guidelines.
            </li>
            <li>
               You agree not to post illegal, prohibited, offensive, or misleading content. You agree to use the Platform lawfully and ethically.
            </li>
          </ul>
        </section>

         {/* Section 4: Limitation of Liability */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">4. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Founder's Hub, its owners, developers, and affiliates will <strong className="font-medium">not be liable</strong> for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to, use of, or inability to use the Platform. This includes, but is not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed mt-2 ml-4 text-sm">
              <li>Loss or theft of items.</li>
              <li>Inaccurate or fraudulent listings or claims.</li>
              <li>Disputes between users.</li>
              <li>Safety issues or negative experiences during offline meetups.</li>
              <li>Any errors or omissions in Platform content.</li>
          </ul>
        </section>

        {/* Section 5: Data and Privacy */}
        <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">5. Data and Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
               Your use of the Platform is also governed by our Privacy Policy [Create and Link a Privacy Policy if needed]. We take user privacy seriously, particularly regarding verification documents like Government IDs, which are collected solely for platform trust and are not displayed publicly. However, no online platform can guarantee absolute security.
            </p>
        </section>

        {/* Section 6: Modification and Termination */}
         <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">6. Modification and Termination</h2>
            <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms or the Platform's features at any time without prior notice. We also reserve the right to suspend or terminate user accounts that violate these terms or our community guidelines.
            </p>
        </section>

        {/* Section 7: Agreement */}
        <section className="border-t pt-4 mt-6">
            <p className="text-sm font-medium text-gray-700">
                By creating an account or using Founder's Hub, you acknowledge that you have read, understood, and agree to be bound by this Disclaimer and User Agreement.
            </p>
        </section>

      </div>
    </div>
  );
};

export default Disclaimer;