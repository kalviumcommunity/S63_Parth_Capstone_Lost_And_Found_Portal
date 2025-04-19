// src/pages/SearchResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import ItemCard from '../components/ItemCard'; // <<<--- IMPORT the actual ItemCard component

// Remove the inline placeholder ItemCard - we import the real one now

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                setError('');
                setResults([]);

                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    // Ensure this matches your backend search route
                    // Assuming your backend route is /api/search?query=...
                    const response = await axios.get(`${apiUrl}/api/search?query=${encodeURIComponent(query)}`);

                    // Add a check if the response data is actually an array
                    if (Array.isArray(response.data)) {
                        setResults(response.data);
                        if (response.data.length === 0) {
                            setError(`No items found matching "${query}". Try a different search term.`);
                        }
                    } else {
                        // Handle unexpected response format
                        console.error("Unexpected API response format:", response.data);
                        setError('Received invalid data from server.');
                        setResults([]); // Ensure results are empty
                    }

                } catch (err) {
                    console.error("Search Error:", err.response?.data || err.message);
                    setError(`Failed to fetch search results (${err.response?.status || 'Network Error'}). Please try again.`);
                    setResults([]); // Ensure results are empty on error
                } finally {
                    setLoading(false);
                }
            };

            fetchResults();
        } else {
             // Clear results and show prompt if query is empty
             setError("Enter a search term on the home page to see results.");
             setResults([]);
        }
    }, [query]); // Dependency array - effect runs when 'query' changes

    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
            {query && ( // Only show the query if it exists
                <p className="text-gray-600 mb-6">
                    Showing results for: <span className="font-semibold text-blue-700">"{query}"</span>
                </p>
            )}

            {/* Back to Home Link */}
            <div className="mb-6">
                <Link to="/" className="text-blue-600 hover:underline text-sm">
                    ← Back to Home Search
                </Link>
            </div>


            {/* Loading State */}
            {loading && (
                 <div className="flex justify-center items-center p-10">
                    {/* Basic spinner - you can replace with a nicer one */}
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-500">Loading results...</span>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                 <div className="text-center text-red-600 bg-red-50 p-4 rounded-md border border-red-200">
                    <p>{error}</p>
                 </div>
            )}

            {/* Results Display */}
            {!loading && !error && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {results.map((item) => (
                        // Use the imported ItemCard component
                        <ItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}

             {/* Explicit "No Results" message (handled by error state when length is 0) */}
             {/* {!loading && !error && results.length === 0 && query && (
                 <p className="text-center text-gray-500 mt-8">No items found matching your search criteria.</p>
             )} */}
        </div>
    );
};

export default SearchResultsPage;