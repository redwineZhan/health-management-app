import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setMetrics, 
  setLoading, 
  setError, 
  addMetric, 
  setTrends 
} from '../store/healthSlice';
import axios from 'axios';

const HealthDashboard = () => {
  const dispatch = useDispatch();
  const { metrics, trends, loading, error } = useSelector(state => state.health);
  const { user } = useSelector(state => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    measurementDate: new Date().toISOString().split('T')[0],
    systolicBp: '',
    diastolicBp: '',
    heartRate: '',
    bmi: '',
    bloodSugar: '',
    cholesterolTotal: '',
    cholesterolHdl: '',
    cholesterolLdl: '',
    weightKg: '',
    notes: ''
  });

  // Fetch health metrics on component mount
  useEffect(() => {
    fetchHealthMetrics();
    fetchHealthTrends();
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/health`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        dispatch(setMetrics(response.data.data));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchHealthTrends = async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/health/trends?period=30`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        dispatch(setTrends(response.data.data));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/health`,
        {
          ...formData,
          measurementDate: new Date(formData.measurementDate).toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        dispatch(addMetric(response.data.data));
        setFormData({
          measurementDate: new Date().toISOString().split('T')[0],
          systolicBp: '',
          diastolicBp: '',
          heartRate: '',
          bmi: '',
          bloodSugar: '',
          cholesterolTotal: '',
          cholesterolHdl: '',
          cholesterolLdl: '',
          weightKg: '',
          notes: ''
        });
        setShowForm(false);
        // Refresh trends after adding new metric
        fetchHealthTrends();
      }
    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderNormalRanges = () => (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <h3 className="font-semibold text-blue-800 mb-2">Normal Health Indicator Ranges:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        <div><span className="font-medium">Blood Pressure:</span> 90-120/60-80 mmHg</div>
        <div><span className="font-medium">Heart Rate:</span> 60-100 bpm</div>
        <div><span className="font-medium">BMI:</span> 18.5-24.9 kg/m²</div>
        <div><span className="font-medium">Blood Sugar:</span> 70-100 mg/dL (fasting)</div>
        <div><span className="font-medium">Cholesterol Total:</span> <200 mg/dL</div>
        <div><span className="font-medium">Weight:</span> Based on individual factors</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Health Metrics Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Metric'}
        </button>
      </div>

      {renderNormalRanges()}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Record New Health Metric</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="measurementDate"
                value={formData.measurementDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                name="systolicBp"
                value={formData.systolicBp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 120"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                name="diastolicBp"
                value={formData.diastolicBp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 75"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 22.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Sugar (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                name="bloodSugar"
                value={formData.bloodSugar}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 90"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol Total</label>
              <input
                type="number"
                step="0.1"
                name="cholesterolTotal"
                value={formData.cholesterolTotal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 180"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HDL Cholesterol</label>
              <input
                type="number"
                step="0.1"
                name="cholesterolHdl"
                value={formData.cholesterolHdl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 55"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LDL Cholesterol</label>
              <input
                type="number"
                step="0.1"
                name="cholesterolLdl"
                value={formData.cholesterolLdl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 70.5"
              />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any additional notes about this measurement..."
              ></textarea>
            </div>
            
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Metric'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Recent Measurements</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : metrics.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No health metrics recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.slice(0, 10).map((metric) => (
                  <tr key={metric.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(metric.measurement_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.systolic_bp && metric.diastolic_bp 
                        ? `${metric.systolic_bp}/${metric.diastolic_bp}` 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.heart_rate || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.bmi || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.weight_kg ? `${metric.weight_kg} kg` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {metric.notes || 'No notes'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDashboard;