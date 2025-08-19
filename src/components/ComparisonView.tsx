import React from 'react';
import { COMPARISON_CONTENT } from '../data/content';

interface RoundResult {
  userPrompt: string;
  aiResponse: string;
  qualityScore: number;
  frameworkElements: string[];
}

interface ComparisonViewProps {
  rounds: Record<number, RoundResult>;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ rounds }) => {
  const getQualityLabel = (score: number) => {
    const level = COMPARISON_CONTENT.qualityLevels[score as keyof typeof COMPARISON_CONTENT.qualityLevels];
    return level ? level.label : 'Неизвестно';
  };
  
  const getQualityColor = (score: number) => {
    const level = COMPARISON_CONTENT.qualityLevels[score as keyof typeof COMPARISON_CONTENT.qualityLevels];
    return level ? level.color : 'gray';
  };
  
  const getReadinessLabel = (round: number) => {
    const level = COMPARISON_CONTENT.readinessLevels[round as keyof typeof COMPARISON_CONTENT.readinessLevels];
    return level ? level.label : 'Неизвестно';
  };
  
  const getReadinessColor = (round: number) => {
    const level = COMPARISON_CONTENT.readinessLevels[round as keyof typeof COMPARISON_CONTENT.readinessLevels];
    return level ? level.color : 'gray';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {COMPARISON_CONTENT.title}
      </h2>
      <p className="text-gray-600 mb-6">{COMPARISON_CONTENT.subtitle}</p>
      
      {/* Table view */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">
                {COMPARISON_CONTENT.headers.round}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                {COMPARISON_CONTENT.headers.promptQuality}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                {COMPARISON_CONTENT.headers.outputQuality}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                {COMPARISON_CONTENT.headers.executiveReadiness}
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((roundNum) => {
              const roundData = rounds[roundNum];
              if (!roundData) return null;
              
              return (
                <tr key={roundNum}>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {roundNum}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm bg-${getQualityColor(roundData.qualityScore)}-100 text-${getQualityColor(roundData.qualityScore)}-800`}>
                      {getQualityLabel(roundData.qualityScore)}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm bg-${getQualityColor(roundData.qualityScore)}-100 text-${getQualityColor(roundData.qualityScore)}-800`}>
                      {getQualityLabel(roundData.qualityScore)}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm bg-${getReadinessColor(roundNum)}-100 text-${getReadinessColor(roundNum)}-800`}>
                      {getReadinessLabel(roundNum)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Detailed responses */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((roundNum) => {
          const roundData = rounds[roundNum];
          if (!roundData) return null;
          
          return (
            <div key={roundNum} className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Раунд {roundNum} - {getQualityLabel(roundData.qualityScore)}
              </h3>
              
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Промпт:</h4>
                <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                  {roundData.userPrompt || 'Промпт отсутствует'}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Ответ ИИ:</h4>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  {roundData.aiResponse || 'Ответ отсутствует'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonView;
