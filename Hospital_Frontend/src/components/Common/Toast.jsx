

import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ type = 'success', title, message }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50'
  };

  const Icon = icons[type];

  return (
    <div className={`${bgColors[type]} border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${colors[type]} mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          )}
          {message && (
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;