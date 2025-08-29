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
      {frameworkElements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-blue-900 mb-3 text-base">
            Элементы фреймворка для этого раунда:
          </h4>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-3">
              {frameworkElements.map((elementKey) => {
                const element = FRAMEWORK_ELEMENTS[elementKey as keyof typeof FRAMEWORK_ELEMENTS];
                if (!element) return null;
                
                const isPresent = detectedElements.includes(elementKey);
                
                return (
                  <div 
                    key={elementKey}
                    className={`px-3 py-2 rounded-md text-sm border ${
                      isPresent 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{element.icon}</span>
                      <span className="font-medium">{element.name}</span>
                      <span className="text-xs">
                        {isPresent ? '✓' : '○'}
                      </span>
                    </div>
                    <p className="text-xs ml-7 text-gray-600 dark:text-gray-400">
                      {element.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      

      
      {/* Examples */}
      {'examples' in roundData && roundData.examples && roundData.examples.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-blue-900 mb-3 text-base">
            Примеры:
          </h4>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="space-y-3">
              {roundData.examples.map((example, index) => (
                <div key={index} className="px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200">
                  <code className="text-blue-700">{example}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Expected output */}
      <div className="mb-6">
        <h4 className="font-semibold text-blue-900 mb-3 text-base">
          Ожидаемый результат:
        </h4>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-700">{roundData.expectedOutput}</p>
        </div>
      </div>
    </div>
  );
};

export default RoundGuidance;
