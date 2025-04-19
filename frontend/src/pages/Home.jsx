// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for search redirection

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Redirect to a search results page (we'll create this later)
            // Pass the search term as a query parameter
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

       {/* 3. Call-to-Action Buttons Section */}
       <section className="container mx-auto px-4 text-center pt-8 md:pt-12">
       <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-700">
          Report an Item
      </h2>
      <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          {/* THIS IS THE BUTTON */}
          <Link
              to="/report-lost" // <<<--- This 'to' prop tells it where to navigate
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out transform hover:scale-105"
          >
              I Lost Something
          </Link>
          {/* ... other button ... */}
      </div>

      <Link
    to="/report-found" // <<<--- Ensure this matches the route in App.jsx
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out transform hover:scale-105"
>
    I Found Something
</Link>

  </section>

  

    return (
        <div className="space-y-12 md:space-y-16 lg:space-y-20"> {/* Add vertical spacing between sections */}

            {/* 1. Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 md:py-28 lg:py-32 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        Lost Something? Found Something?
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                        Connect with our community to reunite lost items with their owners. Fast, simple, and effective.
                    </p>
                    {/* Optional: Add an image or illustration here */}
                </div>
            </section>

            {/* 2. Search Bar Section */}
            <section className="container mx-auto px-4 -mt-10 md:-mt-12 z-10 relative"> {/* Negative margin to overlap hero slightly */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-gray-700">
                        Find Your Item
                    </h2>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter item name (e.g., 'black wallet', 'keys', 'cat')..."
                            className="flex-grow shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Search for lost or found items"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* 3. Call-to-Action Buttons Section */}
            <section className="container mx-auto px-4 text-center pt-8 md:pt-12">
                 <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-700">
                    Report an Item
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                    <Link
                        to="/report-lost" // Link to the Lost Item Form page
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out transform hover:scale-105"
                    >
                        I Lost Something
                    </Link>
                    <Link
                        to="/report-found" // Link to the Found Item Form page
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out transform hover:scale-105"
                    >
                        I Found Something
                    </Link>
                </div>
            </section>

            {/* 4. How It Works Section (Optional) */}
            <section className="bg-gray-50 py-16 md:py-20">
                 <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">How Founder's Hub Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4 text-3xl font-bold">1</div>
                            <h3 className="text-lg font-semibold mb-2">Report Item</h3>
                            <p className="text-gray-600 text-sm">Quickly submit details about your lost or found item, including photos.</p>
                        </div>
                        {/* Step 2 */}
                         <div className="flex flex-col items-center">
                             <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4 text-3xl font-bold">2</div>
                            <h3 className="text-lg font-semibold mb-2">Search & Match</h3>
                            <p className="text-gray-600 text-sm">Use our search or browse listings to find potential matches.</p>
                        </div>
                         {/* Step 3 */}
                         <div className="flex flex-col items-center">
                             <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4 text-3xl font-bold">3</div>
                            <h3 className="text-lg font-semibold mb-2">Connect & Return</h3>
                            <p className="text-gray-600 text-sm">Initiate a claim and connect directly with the finder/owner to arrange the return.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Recent Items Section (Optional - Placeholder) */}
            {/* <section className="container mx-auto px-4 py-16 md:py-20">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Recently Reported Items</h2>
                <div className="text-center text-gray-500">
                    (Recent items list will appear here - Requires backend integration)
                </div>
                 Add ItemCard components here later
            </section> */}

        </div> // End of main container div
    );
};

export default Home;