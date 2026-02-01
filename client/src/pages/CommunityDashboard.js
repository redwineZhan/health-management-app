import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const CommunityDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('communities');
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [communityForm, setCommunityForm] = useState({
    name: '',
    description: '',
    maxMembers: 50,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    postType: 'discussion'
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, we would fetch this data from the API
    setCommunities([
      {
        id: 1,
        name: 'Healthy Living Challenge',
        description: 'A 30-day challenge to improve your lifestyle habits',
        creator: 'Admin',
        maxMembers: 50,
        currentMembers: 24,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        isActive: true
      },
      {
        id: 2,
        name: 'TCM Weight Loss Group',
        description: 'Group focusing on traditional Chinese medicine approaches to weight loss',
        creator: 'Dr. Li',
        maxMembers: 30,
        currentMembers: 18,
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        isActive: true
      }
    ]);
    
    setPosts([
      {
        id: 1,
        communityId: 1,
        author: 'Sarah Johnson',
        title: 'Completed Week 2 of Challenge!',
        content: 'Happy to report I\'ve completed the second week of the Healthy Living Challenge. Feeling more energetic already!',
        postType: 'achievement',
        likesCount: 12,
        commentsCount: 5,
        createdAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        communityId: 2,
        author: 'Michael Chen',
        title: 'TCM Tea Recipe for Digestion',
        content: 'Sharing a simple recipe for digestive tea: ginger, mint, and chrysanthemum flowers. Brew for 5 minutes.',
        postType: 'resource',
        likesCount: 8,
        commentsCount: 3,
        createdAt: '2024-01-19T15:45:00Z'
      }
    ]);
    
    setMyCommunities([
      {
        id: 1,
        name: 'Healthy Living Challenge',
        role: 'member',
        joinedDate: '2024-01-16',
        progress: 75
      },
      {
        id: 2,
        name: 'TCM Weight Loss Group',
        role: 'member',
        joinedDate: '2024-01-05',
        progress: 90
      }
    ]);
  }, []);

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, we would send this to the API
      const newCommunity = {
        id: communities.length + 1,
        ...communityForm,
        creator: user?.firstName || 'Current User',
        currentMembers: 1, // Creator counts as first member
        isActive: true
      };
      
      setCommunities([...communities, newCommunity]);
      setCommunityForm({
        name: '',
        description: '',
        maxMembers: 50,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      setShowCommunityForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!selectedCommunity) {
      setError('Please select a community to post in');
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, we would send this to the API
      const newPost = {
        id: posts.length + 1,
        communityId: selectedCommunity.id,
        author: user?.firstName || 'Current User',
        title: postForm.title,
        content: postForm.content,
        postType: postForm.postType,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString()
      };
      
      setPosts([newPost, ...posts]);
      setPostForm({
        title: '',
        content: '',
        postType: 'discussion'
      });
      setShowPostForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityChange = (e) => {
    const { name, value } = e.target;
    setCommunityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const joinCommunity = (communityId) => {
    // In a real app, this would make an API call
    const community = communities.find(c => c.id === communityId);
    if (community && !myCommunities.some(mc => mc.id === communityId)) {
      const newMembership = {
        id: communityId,
        name: community.name,
        role: 'member',
        joinedDate: new Date().toISOString().split('T')[0],
        progress: 0
      };
      setMyCommunities([...myCommunities, newMembership]);
    }
  };

  const leaveCommunity = (communityId) => {
    // In a real app, this would make an API call
    setMyCommunities(myCommunities.filter(c => c.id !== communityId));
    // Also remove related posts from this community
    setPosts(posts.filter(p => p.communityId !== communityId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Community Health Programs</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab(activeTab === 'communities' ? 'posts' : 'communities');
              setShowCommunityForm(false);
              setShowPostForm(false);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Switch to {activeTab === 'communities' ? 'Discussions' : 'Communities'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('communities');
              setShowCommunityForm(false);
              setShowPostForm(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'communities'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Communities
          </button>
          <button
            onClick={() => {
              setActiveTab('discover');
              setShowCommunityForm(false);
              setShowPostForm(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'discover'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Discover Communities
          </button>
          <button
            onClick={() => {
              setActiveTab('posts');
              setShowCommunityForm(false);
              setShowPostForm(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Discussions
          </button>
        </nav>
      </div>

      {/* My Communities Tab */}
      {activeTab === 'communities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Your Health Communities</h2>
          </div>

          {myCommunities.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No communities joined yet</h3>
              <p className="text-gray-600 mb-4">Join a community to start connecting with others on their health journey</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Discover Communities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCommunities.map((community) => {
                const fullCommunity = communities.find(c => c.id === community.id);
                return (
                  <div key={community.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{community.name}</h3>
                          <p className="text-sm text-gray-500">Role: {community.role}</p>
                        </div>
                        <button
                          onClick={() => leaveCommunity(community.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Leave
                        </button>
                      </div>
                      
                      {fullCommunity && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Members:</span>
                            <span className="text-sm font-medium">{fullCommunity.currentMembers}/{fullCommunity.maxMembers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`text-sm font-medium ${
                              fullCommunity.isActive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {fullCommunity.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{community.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${community.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setSelectedCommunity(fullCommunity);
                            setActiveTab('posts');
                          }}
                          className="w-full bg-indigo-100 text-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-200 transition-colors"
                        >
                          View Discussions
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Discover Communities Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Discover Health Communities</h2>
            <button
              onClick={() => {
                setShowCommunityForm(!showCommunityForm);
                setShowPostForm(false);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showCommunityForm ? 'Cancel' : '+ Create Community'}
            </button>
          </div>

          {showCommunityForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Create New Health Community</h3>
              <form onSubmit={handleCommunitySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
                  <input
                    type="text"
                    name="name"
                    value={communityForm.name}
                    onChange={handleCommunityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Monthly Detox Challenge"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={communityForm.description}
                    onChange={handleCommunityChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe your health community..."
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                    <input
                      type="number"
                      name="maxMembers"
                      value={communityForm.maxMembers}
                      onChange={handleCommunityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="5"
                      max="100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={communityForm.startDate}
                      onChange={handleCommunityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      name="endDate"
                      value={communityForm.endDate}
                      onChange={handleCommunityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Community'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div key={community.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{community.name}</h3>
                      <p className="text-sm text-gray-500">Created by {community.creator}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      community.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {community.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{community.description}</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Members:</span>
                      <span className="text-sm font-medium">{community.currentMembers}/{community.maxMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dates:</span>
                      <span className="text-sm font-medium">{community.startDate} to {community.endDate || 'Ongoing'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {myCommunities.some(mc => mc.id === community.id) ? (
                      <button
                        onClick={() => setActiveTab('communities')}
                        className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 transition-colors"
                        disabled
                      >
                        Joined
                      </button>
                    ) : (
                      <button
                        onClick={() => joinCommunity(community.id)}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Join Community
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCommunity ? `${selectedCommunity.name} Discussions` : 'Community Discussions'}
            </h2>
            <button
              onClick={() => {
                setShowPostForm(!showPostForm);
                if (!selectedCommunity && communities.length > 0) {
                  setSelectedCommunity(communities[0]);
                }
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showPostForm ? 'Cancel' : '+ New Post'}
            </button>
          </div>

          {showPostForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Create New Post</h3>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                {communities.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                    <select
                      value={selectedCommunity?.id || ''}
                      onChange={(e) => {
                        const community = communities.find(c => c.id === parseInt(e.target.value));
                        setSelectedCommunity(community);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select a community</option>
                      {communities.map((community) => (
                        <option key={community.id} value={community.id}>
                          {community.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                  <select
                    name="postType"
                    value={postForm.postType}
                    onChange={handlePostChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="discussion">Discussion</option>
                    <option value="achievement">Achievement</option>
                    <option value="challenge">Challenge</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={postForm.title}
                    onChange={handlePostChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="What's your post about?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    name="content"
                    value={postForm.content}
                    onChange={handlePostChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Share your thoughts, achievement, or resource..."
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading || !selectedCommunity}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Recent Posts</h2>
            </div>
            
            {posts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No posts yet. Be the first to create one!</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {posts.map((post) => {
                  const community = communities.find(c => c.id === post.communityId);
                  return (
                    <div key={post.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-md font-medium text-gray-900">{post.title}</h3>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {post.postType}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <p className="text-sm text-gray-600">by {post.author}</p>
                            {community && (
                              <span className="mx-2 text-gray-300">•</span>
                            )}
                            {community && (
                              <span className="text-xs text-gray-500">in {community.name}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="mt-4 text-gray-700">
                        <p>{post.content}</p>
                      </div>
                      
                      <div className="mt-4 flex space-x-4">
                        <button className="flex items-center text-gray-500 hover:text-indigo-600">
                          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                          <span>{post.likesCount}</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-indigo-600">
                          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                          <span>{post.commentsCount}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDashboard;