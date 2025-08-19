import React from 'react';
import { KEY_TAKEAWAYS, DOWNLOADABLE_ASSETS, UI_MESSAGES } from '../data/content';

interface CompletionViewProps {
  onDownload: (assetName: string) => void;
}

const CompletionView: React.FC<CompletionViewProps> = ({ onDownload }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          {UI_MESSAGES.completion}
        </h2>
        <p className="text-green-800">
          Вы успешно освоили итерационный подход к промптингу!
        </p>
      </div>
      
      {/* Key Takeaways */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-900 mb-4">
          {KEY_TAKEAWAYS.title}
        </h3>
        <p className="text-green-800 mb-4">{KEY_TAKEAWAYS.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {KEY_TAKEAWAYS.insights.map((insight, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">
                {insight.title}
              </h4>
              <p className="text-gray-700 text-sm">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-2">
            {KEY_TAKEAWAYS.application.title}
          </h4>
          <p className="text-gray-700 mb-3">
            {KEY_TAKEAWAYS.application.description}
          </p>
          <ul className="space-y-1">
            {KEY_TAKEAWAYS.application.steps.map((step, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="mr-2">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Downloadable Assets */}
      <div>
        <h3 className="text-xl font-semibold text-green-900 mb-4">
          {DOWNLOADABLE_ASSETS.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOWNLOADABLE_ASSETS.items.map((asset, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onDownload(asset.name)}
            >
              <div className="text-3xl mb-2">{asset.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {asset.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {asset.description}
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                {UI_MESSAGES.buttons.download}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletionView;
