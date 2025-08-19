import React from 'react';
import { ROUNDS_CONTENT, FRAMEWORK_ELEMENTS } from '../data/content';

interface RoundGuidanceProps {
  currentRound: number;
  detectedElements: string[];
}

const RoundGuidance: React.FC<RoundGuidanceProps> = ({ 
  currentRound, 
  detectedElements 
}) => {
  const roundData = ROUNDS_CONTENT[currentRound as keyof typeof ROUNDS_CONTENT];
  
  if (!roundData) return null;
  
  // Type guard to check if frameworkElements exists
  const hasFrameworkElements = 'frameworkElements' in roundData && Array.isArray(roundData.frameworkElements);
  const frameworkElements = hasFrameworkElements ? roundData.frameworkElements : [];
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        {roundData.title}
      </h3>
      
      <p className="text-blue-800 mb-4">
        {roundData.description}
      </p>
      
      {/* Starter prompt for Round 1 */}
      {currentRound === 1 && 'starterPrompt' in roundData && roundData.starterPrompt && (
        <div className="bg-white p-4 rounded border mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Промпт:</h4>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {roundData.starterPrompt}
          </code>
        </div>
      )}
      
      {/* Framework Elements Checklist */}
      <div className="mb-4">
        <h4 className="font-medium text-blue-900 mb-2">Элементы фреймворка:</h4>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(FRAMEWORK_ELEMENTS).map(([key, element]) => {
            const isPresent = detectedElements.includes(key);
            const isRequired = frameworkElements.includes(key);
            
            return (
              <div 
                key={key}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm ${
                  isPresent 
                    ? 'bg-green-100 text-green-800' 
                    : isRequired 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className="text-lg">{element.icon}</span>
                <span className="font-medium">{element.name}</span>
                <span className="text-xs">
                  {isPresent ? '✓' : isRequired ? '✗' : '○'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Guidance points */}
      {'guidance' in roundData && roundData.guidance && roundData.guidance.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Руководство:</h4>
          <ul className="space-y-1">
            {roundData.guidance.map((guide, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start">
                <span className="mr-2">•</span>
                <span>{guide}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Examples */}
      {'examples' in roundData && roundData.examples && roundData.examples.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Примеры:</h4>
          <div className="space-y-2">
            {roundData.examples.map((example, index) => (
              <div key={index} className="bg-white p-2 rounded text-sm border">
                <code className="text-blue-700">{example}</code>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Expected output */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-900 mb-1">Ожидаемый результат:</h4>
        <p className="text-sm text-gray-700">{roundData.expectedOutput}</p>
      </div>
    </div>
  );
};

export default RoundGuidance;
