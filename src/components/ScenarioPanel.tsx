import React from 'react';

interface ScenarioPanelProps {
  title: string;
  description: string;
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h2>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ScenarioPanel;
