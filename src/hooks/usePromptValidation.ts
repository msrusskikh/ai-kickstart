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
    "Добавьте роль: 'Ты — customer success менеджер'",
    "Укажите профессиональную перспективу для ИИ"
  ],
  goal: [
    "Определите цель: 'выявить критичные темы'",
    "Укажите конкретный желаемый результат"
  ],
  steps: [
    "Добавьте пошаговый процесс: 'Шаг 1:', 'Шаг 2:', 'Шаг 3:'",
    "Структурируйте логическую последовательность действий"
  ],
  constraints: [
    "Укажите ограничения: 'не более 300 слов', 'используй bullet points'",
    "Определите формат и стиль результата"
  ],
  quality_bar: [
    "Добавьте стандарт качества: 'включай только темы с 2+ упоминаниями'",
    "Попросите ИИ проверить свою работу перед ответом"
  ]
};

export const usePromptValidation = (promptText: string) => {
  const validation = useMemo(() => {
    const detectedElements: string[] = [];
    const missingElements: string[] = [];
    const suggestions: string[] = [];
    
    // Check each framework element
    Object.entries(FRAMEWORK_PATTERNS).forEach(([element, pattern]) => {
      if (pattern.test(promptText)) {
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
    
    // Calculate score (0-5 based on number of elements)
    const score = detectedElements.length;
    
    // Determine overall quality
    let qualityLevel = 'low';
    if (score >= 4) qualityLevel = 'high';
    else if (score >= 2) qualityLevel = 'medium';
    
    return {
      detectedElements,
      missingElements,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      score,
      qualityLevel,
      isComplete: detectedElements.length === 5
    };
  }, [promptText]);
  
  return validation;
};
