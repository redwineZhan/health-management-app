import React, { useState } from 'react';

const HealthMetricsForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    measurementDate: initialData.measurementDate || new Date().toISOString().split('T')[0],
    systolicBp: initialData.systolicBp || '',
    diastolicBp: initialData.diastolicBp || '',
    heartRate: initialData.heartRate || '',
    bmi: initialData.bmi || '',
    bloodSugar: initialData.bloodSugar || '',
    cholesterolTotal: initialData.cholesterolTotal || '',
    cholesterolHdl: initialData.cholesterolHdl || '',
    cholesterolLdl: initialData.cholesterolLdl || '',
    weightKg: initialData.weightKg || '',
    notes: initialData.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      measurementDate: new Date(formData.measurementDate).toISOString()
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Record Health Metrics</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="measurementDate"
            value={formData.measurementDate}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., 70.5"
          />
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Any additional notes about this measurement..."
          ></textarea>
        </div>
        
        <div className="md:col-span-3 flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Metrics
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthMetricsForm;