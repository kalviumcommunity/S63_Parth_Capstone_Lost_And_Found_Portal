// src/pages/Guidelines.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Guidelines = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-3">
          Community Guidelines & Safety Tips
        </h1>
        <p className="mb-6 text-gray-600">
          Following these guidelines helps keep Founder's Hub safe, effective, and trustworthy for everyone. Please read carefully before reporting or claiming items.
        </p>

        {/* Section: Reporting Items */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Reporting Lost or Found Items</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong className="font-medium">Be Accurate & Detailed:</strong> Provide clear descriptions (color, brand, size, unique marks), accurate dates, and specific locations. The more detail, the better the chance of a match.
            </li>
            <li>
              <strong className="font-medium">Upload Clear Photos:</strong> High-quality images significantly increase the chances of identification. For found items, photograph them as you found them if possible. For lost items, use photos you already have.
            </li>
             <li>
                <strong className="font-medium">Government ID (Mandatory):</strong> Uploading a clear image of your government ID is required for verification when reporting items. This information is kept private and used solely to enhance platform trust and safety. It will not be shared publicly.
            </li>
            <li>
              <strong className="font-medium">One Report Per Item:</strong> Do not create duplicate listings for the same lost or found item.
            </li>
            <li>
              <strong className="font-medium">Update Status:</strong> If you find your lost item elsewhere, or successfully return a found item, please mark the report accordingly or delete it (available in "My Reports") to keep listings current.
            </li>
            <li>
              <strong className="font-medium">Prohibited Items:</strong> Do not report illegal items, weapons, hazardous materials, or engage in any unlawful activity.
            </li>
          </ul>
        </section>

        {/* Section: Searching and Claiming */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Searching For & Claiming Items</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong className="font-medium">Use Specific Keywords:</strong> Search using descriptive terms relevant to your lost item.
            </li>
            <li>
              <strong className="font-medium">Be Honest When Claiming:</strong> Only claim items that are genuinely yours. When submitting a claim, provide specific details in the description that only the true owner would know. Misleading claims may result in account suspension.
            </li>
            <li>
              <strong className="font-medium">Respond Promptly:</strong> If someone claims an item you found, or if a finder contacts you about your claim, please respond in a timely manner.
            </li>
            <li>
              <strong className="font-medium">Verification is Key:</strong>
              <ul className="list-['-_'] list-inside ml-4 mt-1 text-sm">
                <li><span className="font-medium">If you LOST an item:</span> Be prepared to provide detailed proof of ownership when communicating with the finder.</li>
                <li><span className="font-medium">If you FOUND an item:</span> Carefully review the claimant's description/proof. Ask clarifying questions if needed before agreeing to return the item. You have the right to deny a claim if the proof is insufficient.</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Section: Safety Tips for Meeting */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Safety First: Arranging Returns</h2>
          <p className="text-sm text-gray-600 mb-3">While Founder's Hub connects users, the actual handover is done offline. Prioritize your safety:</p>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong className="font-medium">Meet in Public Places:</strong> Always arrange to meet in well-lit, public locations, preferably during daylight hours (e.g., police station lobby, busy coffee shop, mall). Avoid meeting at private residences.
            </li>
            <li>
              <strong className="font-medium">Tell Someone:</strong> Inform a friend or family member where you are going, who you are meeting, and when you expect to be back.
            </li>
            <li>
              <strong className="font-medium">Bring a Friend (Optional):</strong> If possible, take someone with you.
            </li>
            <li>
              <strong className="font-medium">Trust Your Instincts:</strong> If a situation feels unsafe or suspicious, leave immediately. Do not feel obligated to proceed with the handover if you feel uncomfortable.
            </li>
            <li>
              <strong className="font-medium">Inspect the Item:</strong> Before completing the exchange, briefly inspect the item to ensure it matches the description (if you are the owner).
            </li>
             <li>
                <strong className="font-medium">No Financial Transactions:</strong> Founder's Hub does not facilitate rewards or payments between users for returns. Be wary of anyone demanding money (unless a reward was explicitly offered *by the owner* in their lost report description). Report suspicious activity.
            </li>
          </ul>
        </section>

        {/* Section: Platform Disclaimer Recap */}
        <section>
            <p className="text-sm text-gray-500 italic border-t pt-4">
                Founder's Hub acts as a facilitator to connect users. We do not verify claims, guarantee returns, or take responsibility for interactions or exchanges that occur offline. Please use caution and common sense. Refer to our full <Link to="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</Link> for details.
            </p>
        </section>

      </div>
    </div>
  );
};

export default Guidelines;