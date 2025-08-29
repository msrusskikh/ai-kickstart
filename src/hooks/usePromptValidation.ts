import { useMemo } from 'react';

// Framework element patterns for Russian text
const FRAMEWORK_PATTERNS = {
  role: /(?:ты\s+(?:—|являешься)|вы\s+(?:—|являетесь)|роль|customer success|менеджер)/i,
  goal: /(?:цель|задача|должен|нужно|необходимо|требуется|выявить|проанализировать)/i,
  steps: /(?:шаг\s*\d|этап\s*\d|сначала|затем|первый|второй|третий|step\s*\d)/i,
  constraints: /(?:ограничени|не более|максимум|минимум|формат|слов|символов|bullet|маркированн)/i,
  quality_bar: /(?:качеств|стандарт|проверь|убедись|перед предоставлением|review|critique)/i
};

const ELEMENT_SUGGESTIONS = {
  role: [
    "Добавьте роль"
  ],
  goal: [
    "определите цель"
  ],
  steps: [
    "Добавьте пошаговый процесс"
  ],
  constraints: [
    "Укажите ограничения"
  ],
  quality_bar: [
    "Добавьте стандарт качества"
  ]
};

// Define which elements are introduced in each round
const ROUND_ELEMENTS = {
  1: [], // Round 1: No framework elements - just starter prompt
  2: ['role', 'goal'], // Round 2: Introduce role and goal
  3: ['role', 'goal', 'steps', 'constraints'], // Round 3: Add steps and constraints
  4: ['role', 'goal', 'steps', 'constraints', 'quality_bar'] // Round 4: Add quality bar
};

export const usePromptValidation = (promptText: string, currentRound: number = 1) => {
  const validation = useMemo(() => {
    const detectedElements: string[] = [];
    const missingElements: string[] = [];
    const suggestions: string[] = [];
    
    // Get elements that should be available for the current round
    const availableElements = ROUND_ELEMENTS[currentRound as keyof typeof ROUND_ELEMENTS] || ROUND_ELEMENTS[1];
    
    // Check only the elements available for the current round
    availableElements.forEach((element) => {
      if (FRAMEWORK_PATTERNS[element as keyof typeof FRAMEWORK_PATTERNS].test(promptText)) {
        detectedElements.push(element);
      } else {
        missingElements.push(element);
        // Add suggestions for missing elements
        const elementSuggestions = ELEMENT_SUGGESTIONS[element as keyof typeof ELEMENT_SUGGESTIONS];
        if (elementSuggestions) {
          suggestions.push(...elementSuggestions);
        }
      }
    });
    
    // Calculate score based on available elements for current round
    const score = detectedElements.length;
    const maxScore = availableElements.length;
    
    // Determine overall quality based on current round's expectations
    let qualityLevel = 'low';
    if (score >= maxScore * 0.8) qualityLevel = 'high';
    else if (score >= maxScore * 0.5) qualityLevel = 'medium';
    
    return {
      detectedElements,
      missingElements,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      score,
      maxScore,
      qualityLevel,
      isComplete: detectedElements.length === maxScore
    };
  }, [promptText, currentRound]);
  
  return validation;
};
