import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Health Management Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome to HealthTrack Pro! Monitor your health metrics, follow TCM-based weight loss guidance, 
          and connect with a community focused on wellness.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/health" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Health Metrics</h2>
            <p className="text-blue-100">Track your vital signs and health indicators</p>
          </Link>
          
          <Link 
            to="/weight-loss" 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Weight Loss Program</h2>
            <p className="text-green-100">Follow TCM-based guidance for healthy weight loss</p>
          </Link>
          
          <Link 
            to="/community" 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Community</h2>
            <p className="text-purple-100">Join health-focused groups and share experiences</p>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Health Metrics</h2>
          <p className="text-gray-600">Your latest health measurements</p>
          {/* Placeholder for recent metrics visualization */}
          <div className="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Health metrics chart will appear here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Community Activity</h2>
          <p className="text-gray-600">Latest posts from your health communities</p>
          {/* Placeholder for community activity */}
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">New challenge started</p>
              <p className="text-sm text-gray-600">Join the 7-day hydration challenge</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Achievement unlocked</p>
              <p className="text-sm text-gray-600">Sarah completed her 30-day goal</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">New post</p>
              <p className="text-sm text-gray-600">Mike shared a TCM recipe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;