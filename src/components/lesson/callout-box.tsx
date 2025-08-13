import React from 'react';

interface CalloutBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'tip' | 'warning' | 'note';
  title?: string;
  className?: string;
}

export function CalloutBox({ children, type = 'info', title, className = '' }: CalloutBoxProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'tip':
        return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'note':
        return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default:
        return 'border-l-4 border-gray-400 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'tip':
        return '💡';
      case 'warning':
        return '⚠️';
      case 'note':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const getTypeTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'tip':
        return 'Совет';
      case 'warning':
        return 'Внимание';
      case 'note':
        return 'Примечание';
      default:
        return 'Информация';
    }
  };

  return (
    <div className={`rounded-lg p-4 my-6 ${getTypeStyles()} ${className}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{getTypeIcon()}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {getTypeTitle()}
            </h4>
          )}
          <div className="text-gray-800 dark:text-gray-200 prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
