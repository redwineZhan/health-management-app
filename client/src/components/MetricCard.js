import React from 'react';

const MetricCard = ({ title, value, unit, normalRange, status, icon }) => {
  // Determine status color
  const statusColors = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const statusColor = statusColors[status] || statusColors.info;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
          </p>
        </div>
        <div className={`p-3 rounded-full ${statusColor}`}>
          {icon}
        </div>
      </div>
      {normalRange && (
        <div className="mt-4">
          <p className="text-xs text-gray-500">Normal range: {normalRange}</p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;