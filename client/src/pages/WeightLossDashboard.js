import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const WeightLossDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [planForm, setPlanForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    targetWeight: '',
    dailyCalorieTarget: '',
    tcmRecommendations: '',
    notes: ''
  });
  
  const [logForm, setLogForm] = useState({
    dateRecorded: new Date().toISOString().split('T')[0],
    morningMeasurements: { weight: '', bloodPressure: '', heartRate: '' },
    eveningMeasurements: { weight: '', bloodPressure: '', heartRate: '' },
    dailyHabits: { 
      dietQuality: 5, 
      exerciseMinutes: 0, 
      sleepHours: 0, 
      waterIntake: 0, 
      stressLevel: 5 
    },
    moodRating: 5,
    sleepHours: 0,
    waterIntakeLiters: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, we would fetch this data from the API
    setPlans([
      {
        id: 1,
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        targetWeight: 70.5,
        dailyCalorieTarget: 1800,
        tcmRecommendations: 'Include warming foods like ginger and cinnamon. Drink herbal teas in the morning.',
        notes: 'Starting with gentle approach',
        status: 'active',
        progress: 65 // percentage
      }
    ]);
    
    setDailyLogs([
      {
        id: 1,
        date: '2024-01-20',
        morningWeight: 75.2,
        eveningWeight: 75.0,
        caloriesConsumed: 1750,
        exerciseMinutes: 30,
        mood: 7,
        sleepHours: 7.5,
        waterIntake: 2.5
      },
      {
        id: 2,
        date: '2024-01-19',
        morningWeight: 75.4,
        eveningWeight: 75.3,
        caloriesConsumed: 1820,
        exerciseMinutes: 45,
        mood: 8,
        sleepHours: 8,
        waterIntake: 3.0
      }
    ]);
  }, []);

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, we would send this to the API
      const newPlan = {
        id: plans.length + 1,
        ...planForm,
        status: 'active',
        progress: 0
      };
      
      setPlans([...plans, newPlan]);
      setPlanForm({
        startDate: new Date().toISOString().split('T')[0],
        targetWeight: '',
        dailyCalorieTarget: '',
        tcmRecommendations: '',
        notes: ''
      });
      setShowPlanForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, we would send this to the API
      const newLog = {
        id: dailyLogs.length + 1,
        date: logForm.dateRecorded,
        morningWeight: logForm.morningMeasurements.weight,
        eveningWeight: logForm.eveningMeasurements.weight,
        caloriesConsumed: logForm.dailyHabits.caloriesConsumed || 0,
        exerciseMinutes: logForm.dailyHabits.exerciseMinutes,
        mood: logForm.moodRating,
        sleepHours: logForm.sleepHours,
        waterIntake: logForm.waterIntakeLiters
      };
      
      setDailyLogs([newLog, ...dailyLogs]);
      setLogForm({
        dateRecorded: new Date().toISOString().split('T')[0],
        morningMeasurements: { weight: '', bloodPressure: '', heartRate: '' },
        eveningMeasurements: { weight: '', bloodPressure: '', heartRate: '' },
        dailyHabits: { 
          dietQuality: 5, 
          exerciseMinutes: 0, 
          sleepHours: 0, 
          waterIntake: 0, 
          stressLevel: 5 
        },
        moodRating: 5,
        sleepHours: 0,
        waterIntakeLiters: 0
      });
      setShowLogForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLogForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMorningMeasurementChange = (e) => {
    const { name, value } = e.target;
    setLogForm(prev => ({
      ...prev,
      morningMeasurements: {
        ...prev.morningMeasurements,
        [name]: value
      }
    }));
  };

  const handleEveningMeasurementChange = (e) => {
    const { name, value } = e.target;
    setLogForm(prev => ({
      ...prev,
      eveningMeasurements: {
        ...prev.eveningMeasurements,
        [name]: value
      }
    }));
  };

  const handleHabitChange = (e) => {
    const { name, value } = e.target;
    setLogForm(prev => ({
      ...prev,
      dailyHabits: {
        ...prev.dailyHabits,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Weight Loss Program</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab(activeTab === 'plans' ? 'logs' : 'plans');
              setShowPlanForm(false);
              setShowLogForm(false);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Switch to {activeTab === 'plans' ? 'Daily Logs' : 'Plans'}
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
              setActiveTab('plans');
              setShowPlanForm(false);
              setShowLogForm(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Weight Loss Plans
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              setShowPlanForm(false);
              setShowLogForm(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Daily Logs
          </button>
          <button
            onClick={() => {
              setActiveTab('tcm-guidance');
              setShowPlanForm(false);
              setShowLogForm(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tcm-guidance'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            TCM Guidance
          </button>
        </nav>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Your Weight Loss Plans</h2>
            <button
              onClick={() => {
                setShowPlanForm(!showPlanForm);
                setShowLogForm(false);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showPlanForm ? 'Cancel' : '+ Create Plan'}
            </button>
          </div>

          {showPlanForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Create New Weight Loss Plan</h3>
              <form onSubmit={handlePlanSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={planForm.startDate}
                      onChange={handlePlanChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="targetWeight"
                      value={planForm.targetWeight}
                      onChange={handlePlanChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 70.0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Calorie Target</label>
                    <input
                      type="number"
                      name="dailyCalorieTarget"
                      value={planForm.dailyCalorieTarget}
                      onChange={handlePlanChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1800"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TCM Recommendations</label>
                  <textarea
                    name="tcmRecommendations"
                    value={planForm.tcmRecommendations}
                    onChange={handlePlanChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Traditional Chinese Medicine recommendations for this plan..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={planForm.notes}
                    onChange={handlePlanChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Any additional notes about this plan..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Weight Loss Plan</h3>
                      <p className="text-sm text-gray-500">Started: {plan.startDate}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      plan.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : plan.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Target Weight:</span>
                      <span className="text-sm font-medium">{plan.targetWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Daily Calories:</span>
                      <span className="text-sm font-medium">{plan.dailyCalorieTarget}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{plan.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">TCM Recommendations</h4>
                    <p className="text-sm text-gray-600">{plan.tcmRecommendations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Daily Health Logs</h2>
            <button
              onClick={() => {
                setShowLogForm(!showLogForm);
                setShowPlanForm(false);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showLogForm ? 'Cancel' : '+ Log Today'}
            </button>
          </div>

          {showLogForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Log Today's Health Data</h3>
              <form onSubmit={handleLogSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="dateRecorded"
                    value={logForm.dateRecorded}
                    onChange={handleLogChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Morning Measurements</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          name="weight"
                          value={logForm.morningMeasurements.weight}
                          onChange={handleMorningMeasurementChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 75.2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          name="bloodPressure"
                          value={logForm.morningMeasurements.bloodPressure}
                          onChange={handleMorningMeasurementChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                        <input
                          type="number"
                          name="heartRate"
                          value={logForm.morningMeasurements.heartRate}
                          onChange={handleMorningMeasurementChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 75"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Evening Measurements</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          name="weight"
                          value={logForm.eveningMeasurements.weight}
                          onChange={handleEveningMeasurementChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 75.0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          name="bloodPressure"
                          value={logForm.eveningMeasurements.bloodPressure}
                          onChange={handleEveningMeasurementChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 118/78"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                        <input
                          type="number"
                          name="heartRate"
                          value={logForm.eveningMeasurements.heartRate}
                          onChange={handleEveningMeasurementChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 72"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Daily Habits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diet Quality (1-10)</label>
                      <input
                        type="range"
                        name="dietQuality"
                        min="1"
                        max="10"
                        value={logForm.dailyHabits.dietQuality}
                        onChange={handleHabitChange}
                        className="w-full"
                      />
                      <div className="text-center text-sm">{logForm.dailyHabits.dietQuality}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exercise (minutes)</label>
                      <input
                        type="number"
                        name="exerciseMinutes"
                        value={logForm.dailyHabits.exerciseMinutes}
                        onChange={handleHabitChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                      <input
                        type="number"
                        step="0.5"
                        name="sleepHours"
                        value={logForm.dailyHabits.sleepHours}
                        onChange={handleHabitChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 7.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Water Intake (liters)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="waterIntake"
                        value={logForm.dailyHabits.waterIntake}
                        onChange={handleHabitChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-10)</label>
                      <input
                        type="range"
                        name="stressLevel"
                        min="1"
                        max="10"
                        value={logForm.dailyHabits.stressLevel}
                        onChange={handleHabitChange}
                        className="w-full"
                      />
                      <div className="text-center text-sm">{logForm.dailyHabits.stressLevel}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mood Rating (1-10)</label>
                    <input
                      type="range"
                      name="moodRating"
                      min="1"
                      max="10"
                      value={logForm.moodRating}
                      onChange={handleLogChange}
                      className="w-full"
                    />
                    <div className="text-center text-sm">{logForm.moodRating}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Sleep Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      name="sleepHours"
                      value={logForm.sleepHours}
                      onChange={handleLogChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 7.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Water Intake (liters)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="waterIntakeLiters"
                      value={logForm.waterIntakeLiters}
                      onChange={handleLogChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Log'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Recent Daily Logs</h2>
            </div>
            
            {dailyLogs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No daily logs recorded yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Morning Wt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evening Wt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleep</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailyLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.morningWeight} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.eveningWeight} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.exerciseMinutes} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < log.mood ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.687 0 1.175-.969.588-1.81l-2.8-2.034z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm">{log.mood}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.sleepHours} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.waterIntake} L
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TCM Guidance Tab */}
      {activeTab === 'tcm-guidance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM-Based Weight Loss Guidance</h2>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-gray-900">Understanding Your Constitution</h3>
              <p className="text-gray-600">
                Traditional Chinese Medicine approaches weight loss by understanding your unique constitution 
                and addressing imbalances in your body's energy (Qi), blood, and fluids.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6">Dietary Guidelines</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Eat warm, cooked foods that are easier to digest</li>
                <li>Include warming spices like ginger, cinnamon, and fennel</li>
                <li>Avoid cold, raw, and overly sweet foods</li>
                <li>Drink warm teas like green tea, oolong tea, or herbal blends</li>
                <li>Eat regular meals at consistent times to support digestion</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6">Herbal Remedies (Consult Practitioner)</h3>
              <p className="text-gray-600">
                Common herbs used in TCM for weight management include:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
                <li><strong>Hawthorn berry:</strong> Helps with digestion and fat metabolism</li>
                <li><strong>Pu-erh tea:</strong> Believed to help break down fats</li>
                <li><strong>Dioscorea (Shan Yao):</strong> Strengthens digestion</li>
                <li><strong>Lotus leaf:</strong> Traditionally used for weight management</li>
              </ul>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> Consult with a qualified TCM practitioner before using any herbal remedies. 
                      This information is for educational purposes only and not intended as medical advice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Morning Routine</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Start with warm lemon water to stimulate digestion</li>
                <li>Include a warm, nourishing breakfast</li>
                <li>Practice gentle movement like Tai Chi or Qi Gong</li>
                <li>Take time for mindful meditation</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Evening Routine</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Eat dinner early and lightly</li>
                <li>Take a gentle walk after eating</li>
                <li>Sip on digestive herbal tea</li>
                <li>Prepare for restful sleep with relaxation techniques</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightLossDashboard;