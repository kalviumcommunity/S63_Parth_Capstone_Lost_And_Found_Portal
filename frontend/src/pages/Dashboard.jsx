import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [userDashboardData, setUserDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get user ID from localStorage (will be replaced with Auth Context later)
  const getUserIdAndToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      return { userId: user?._id, token };
    } catch (error) {
      console.error('Error getting user ID and token:', error);
      return { userId: null, token: null };
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { userId, token } = getUserIdAndToken();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch general dashboard data
        const generalResponse = await axios.get(`${apiUrl}/api/dashboard`);
        setDashboardData(generalResponse.data);
        
        // Fetch user-specific dashboard data if user is logged in
        if (userId) {
          const userResponse = await axios.get(`${apiUrl}/api/dashboard/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserDashboardData(userResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>
      
      {/* User-specific statistics */}
      {userDashboardData && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-medium text-gray-700">Your Reports</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-3xl font-bold text-red-500">{userDashboardData.userStatistics.lostItems}</p>
                  <p className="text-sm text-gray-500">Lost Items</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-500">{userDashboardData.userStatistics.foundItems}</p>
                  <p className="text-sm text-gray-500">Found Items</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-lg font-medium text-gray-700">Your Claims</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-3xl font-bold text-purple-500">{userDashboardData.userStatistics.claimsMade}</p>
                  <p className="text-sm text-gray-500">Claims Made</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-500">{userDashboardData.userStatistics.claimsReceived}</p>
                  <p className="text-sm text-gray-500">Claims Received</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-medium text-gray-700">Claim Status</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-3xl font-bold text-green-600">{userDashboardData.userStatistics.approvedClaimsMade}</p>
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-500">{userDashboardData.userStatistics.pendingClaimsMade}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* User's recent items */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent lost items */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Your Recent Lost Items</h3>
              {userDashboardData.recentUserLostItems.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {userDashboardData.recentUserLostItems.map(item => (
                    <li key={item._id} className="py-3">
                      <Link to={`/lost/${item._id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-red-600 text-xl">L</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Lost on {formatDate(item.dateLost)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No lost items reported yet.</p>
              )}
              <div className="mt-4">
                <Link to="/report-lost" className="text-red-600 hover:text-red-800 text-sm font-medium">
                  + Report a Lost Item
                </Link>
              </div>
            </div>
            
            {/* Recent found items */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Your Recent Found Items</h3>
              {userDashboardData.recentUserFoundItems.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {userDashboardData.recentUserFoundItems.map(item => (
                    <li key={item._id} className="py-3">
                      <Link to={`/found/${item._id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-green-600 text-xl">F</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Found on {formatDate(item.dateFound)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No found items reported yet.</p>
              )}
              <div className="mt-4">
                <Link to="/report-found" className="text-green-600 hover:text-green-800 text-sm font-medium">
                  + Report a Found Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* System-wide statistics */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Portal Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-red-500">{dashboardData.statistics.totalLostItems}</p>
            <p className="text-gray-600 mt-2">Lost Items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-green-500">{dashboardData.statistics.totalFoundItems}</p>
            <p className="text-gray-600 mt-2">Found Items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-yellow-500">{dashboardData.statistics.totalClaims}</p>
            <p className="text-gray-600 mt-2">Total Claims</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-blue-500">{dashboardData.statistics.approvedClaims}</p>
            <p className="text-gray-600 mt-2">Successful Matches</p>
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent lost items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Lost Items</h3>
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentLostItems.map(item => (
                <li key={item._id} className="py-3">
                  <Link to={`/lost/${item._id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-red-600 text-xl">L</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Lost on {formatDate(item.dateLost)}</p>
                      <p className="text-xs text-gray-400">Reported by {item.createdBy?.name || 'Anonymous'}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recent found items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Found Items</h3>
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentFoundItems.map(item => (
                <li key={item._id} className="py-3">
                  <div 
                    className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 text-xl">F</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Found on {formatDate(item.dateFound)}</p>
                      <p className="text-xs text-gray-400">Reported by {item.createdBy?.name || 'Anonymous'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Successful matches */}
      {dashboardData.recentApprovedClaims && dashboardData.recentApprovedClaims.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Successful Matches</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentApprovedClaims.map(claim => (
                <li key={claim._id} className="py-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 text-xl">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {claim.foundItemId?.name || 'Item'} was successfully returned
                      </p>
                      <p className="text-sm text-gray-500">
                        Claimed by {claim.claimantUserId?.name || 'Anonymous'} on {formatDate(claim.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/report-lost" className="bg-red-100 hover:bg-red-200 p-6 rounded-lg text-center transition-colors duration-200">
            <div className="text-red-600 text-4xl mb-2">📝</div>
            <p className="font-medium text-gray-800">Report Lost Item</p>
          </Link>
          <Link to="/report-found" className="bg-green-100 hover:bg-green-200 p-6 rounded-lg text-center transition-colors duration-200">
            <div className="text-green-600 text-4xl mb-2">🔍</div>
            <p className="font-medium text-gray-800">Report Found Item</p>
          </Link>
          <Link to="/search" className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg text-center transition-colors duration-200">
            <div className="text-blue-600 text-4xl mb-2">🔎</div>
            <p className="font-medium text-gray-800">Search Items</p>
          </Link>
          <Link to="/my-reports" className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg text-center transition-colors duration-200">
            <div className="text-purple-600 text-4xl mb-2">📋</div>
            <p className="font-medium text-gray-800">My Reports</p>
          </Link>
        </div>
      </div>
      
      {/* Modal for showing reporter information */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Item Reporter Information</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  {selectedItem.createdBy?.profilePicture ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${selectedItem.createdBy.profilePicture}`}
                      alt={selectedItem.createdBy.name}
                      className="h-16 w-16 rounded-full object-cover border border-gray-300 mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-green-200 flex items-center justify-center mr-4">
                      <span className="text-green-700 text-xl font-bold">
                        {selectedItem.createdBy?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">{selectedItem.createdBy?.name || 'Anonymous'}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.createdBy?.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Item Details</h5>
                  <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {selectedItem.name}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Found on:</span> {formatDate(selectedItem.dateFound)}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {selectedItem.locationFound}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Contact Information</h5>
                  <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {selectedItem.contactNo || 'Not provided'}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {selectedItem.createdBy?.email || 'Not provided'}</p>
                </div>

                {selectedItem.description && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Description</h5>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedItem.description}</p>
                  </div>
                )}

                {selectedItem.images && selectedItem.images.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Images</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.images.map((image, index) => (
                        <img 
                          key={index}
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${image}`}
                          alt={`Item image ${index + 1}`}
                          className="h-20 w-20 object-cover rounded border border-gray-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.png';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate(`/found/${selectedItem._id}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;