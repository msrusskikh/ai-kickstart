import type { LessonFrontmatter, Module, SearchResult } from './types';

// This would normally load from MDX files
// For now, we'll create sample content structure
export const modules: Module[] = [
  {
    id: 1,
    title: "Мышление и основы ИИ",
    description: "Понимание основ искусственного интеллекта и принципов работы с ним",
    sections: [
      {
        slug: "what-is-modern-ai",
        title: "Что такое современный ИИ",
        summary: "Введение в современные технологии искусственного интеллекта и их возможности.",
        duration: 15,
        objectives: ["Понять что такое современный ИИ", "Разобраться в основных технологиях", "Осознать масштаб изменений"],
        prerequisites: [],
        module: 1,
        section: 1,
        quiz: [
          {
            type: "mcq",
            question: "Что из перечисленного НЕ является примером современного ИИ?",
            choices: ["ChatGPT", "Автопилот Tesla", "Калькулятор", "DALL-E"],
            answer: "Калькулятор"
          },
          {
            type: "reflection",
            prompt: "Как вы думаете, как ИИ может изменить вашу работу в ближайшие 2-3 года?"
          }
        ]
      },
      {
        slug: "how-llms-think",
        title: "Как «думают» LLM",
        summary: "Разбор принципов работы больших языковых моделей и их внутренней логики.",
        duration: 20,
        objectives: ["Понять архитектуру LLM", "Разобраться в принципах обучения", "Осознать ограничения"],
        prerequisites: ["Что такое современный ИИ"],
        module: 1,
        section: 2,
        quiz: [
          {
            type: "mcq",
            question: "LLM обучаются на:",
            choices: ["Только на русском языке", "Только на английском языке", "На множестве языков", "Только на математических формулах"],
            answer: "На множестве языков"
          }
        ]
      },
      {
        slug: "strengths-weaknesses",
        title: "Сильные и слабые стороны — и как с ними работать",
        summary: "Анализ возможностей и ограничений ИИ для эффективного использования.",
        duration: 18,
        objectives: ["Определить сильные стороны ИИ", "Понять ограничения", "Научиться обходить недостатки"],
        prerequisites: ["Как «думают» LLM"],
        module: 1,
        section: 3
      },
      {
        slug: "augmentation-not-replacement",
        title: "Усиление, а не замена: цикл «Человек ↔ ИИ»",
        summary: "Принципы эффективного взаимодействия человека и ИИ для достижения лучших результатов.",
        duration: 22,
        objectives: ["Понять принцип усиления", "Научиться распределять задачи", "Создать эффективный цикл работы"],
        prerequisites: ["Сильные и слабые стороны — и как с ними работать"],
        module: 1,
        section: 4
      },
      {
        slug: "responsible-safe-usage",
        title: "Ответственное и безопасное использование",
        summary: "Этические принципы и меры безопасности при работе с ИИ.",
        duration: 16,
        objectives: ["Понять риски ИИ", "Изучить принципы безопасности", "Научиться ответственному использованию"],
        prerequisites: ["Усиление, а не замена: цикл «Человек ↔ ИИ»"],
        module: 1,
        section: 5
      },
      {
        slug: "verification-insurance",
        title: "Верификация: ваша страховка",
        summary: "Методы проверки и валидации результатов работы ИИ.",
        duration: 19,
        objectives: ["Научиться проверять результаты", "Понять методы валидации", "Создать систему контроля"],
        prerequisites: ["Ответственное и безопасное использование"],
        module: 1,
        section: 6
      },
      {
        slug: "common-failures-quick-fixes",
        title: "Частые сбои и быстрые исправления",
        summary: "Типичные проблемы при работе с ИИ и способы их решения.",
        duration: 17,
        objectives: ["Распознавать типичные ошибки", "Применять быстрые исправления", "Предотвращать проблемы"],
        prerequisites: ["Верификация: ваша страховка"],
        module: 1,
        section: 7
      },
      {
        slug: "working-rules",
        title: "Рабочие правила",
        summary: "Практические правила и принципы эффективной работы с ИИ.",
        duration: 14,
        objectives: ["Усвоить основные правила", "Создать свой свод принципов", "Применять на практике"],
        prerequisites: ["Частые сбои и быстрые исправления"],
        module: 1,
        section: 8
      },
      {
        slug: "myths-reality",
        title: "Мифы и реальность",
        summary: "Разоблачение распространенных мифов об ИИ и понимание реальности.",
        duration: 16,
        objectives: ["Разобрать популярные мифы", "Понять реальные возможности", "Отделить факты от вымысла"],
        prerequisites: ["Рабочие правила"],
        module: 1,
        section: 9
      },
      {
        slug: "what-means-good",
        title: "Что значит «хорошо»",
        summary: "Критерии качества работы с ИИ и способы их достижения.",
        duration: 18,
        objectives: ["Определить критерии качества", "Научиться оценивать результаты", "Постоянно улучшаться"],
        prerequisites: ["Мифы и реальность"],
        module: 1,
        section: 10
      },
      {
        slug: "recap-module-1",
        title: "Recap",
        summary: "Повторение и закрепление ключевых концепций модуля.",
        duration: 12,
        objectives: ["Закрепить основные понятия", "Проверить понимание", "Подготовиться к следующему модулю"],
        prerequisites: ["Что значит «хорошо»"],
        module: 1,
        section: 11
      }
    ]
  },
  {
    id: 2,
    title: "Искусство промптинга",
    description: "Мастерство создания эффективных запросов для ИИ",
    sections: [
      {
        slug: "why-learn-prompts",
        title: "Зачем вообще учиться писать промпты",
        summary: "Обоснование важности навыка промптинга в современном мире.",
        duration: 12,
        objectives: ["Понять ценность промптинга", "Осознать преимущества", "Мотивироваться к изучению"],
        prerequisites: [],
        module: 2,
        section: 1,
        quiz: [
          {
            type: "mcq",
            question: "Промптинг — это:",
            choices: ["Программирование", "Искусство составления запросов", "Дизайн интерфейсов", "Анализ данных"],
            answer: "Искусство составления запросов"
          }
        ]
      },
      {
        slug: "role-goal-steps-constraints-criteria",
        title: "Модель «Роль → Цель → Шаги → Ограничения → Критерий качества»",
        summary: "Структурированный подход к созданию эффективных промптов.",
        duration: 25,
        objectives: ["Изучить модель РГШОК", "Научиться применять структуру", "Создать первые промпты"],
        prerequisites: ["Зачем вообще учиться писать промпты"],
        module: 2,
        section: 2
      },
      {
        slug: "how-ai-hears-instructions",
        title: "Как ИИ «слышит» инструкции",
        summary: "Понимание того, как ИИ интерпретирует и обрабатывает запросы.",
        duration: 20,
        objectives: ["Понять процесс обработки", "Учесть особенности восприятия", "Оптимизировать запросы"],
        prerequisites: ["Модель «Роль → Цель → Шаги → Ограничения → Критерий качества»"],
        module: 2,
        section: 3
      },
      {
        slug: "building-query-as-dialogue",
        title: "Постройка запроса как диалога",
        summary: "Создание интерактивных и последовательных запросов для лучших результатов.",
        duration: 22,
        objectives: ["Научиться строить диалоги", "Создавать последовательность", "Поддерживать контекст"],
        prerequisites: ["Как ИИ «слышит» инструкции"],
        module: 2,
        section: 4
      },
      {
        slug: "anatomy-of-strong-prompt",
        title: "Анатомия сильного промпта",
        summary: "Разбор компонентов и структуры эффективных промптов.",
        duration: 24,
        objectives: ["Понять компоненты промпта", "Изучить структуру", "Создать шаблоны"],
        prerequisites: ["Постройка запроса как диалога"],
        module: 2,
        section: 5
      },
      {
        slug: "five-key-patterns",
        title: "5 ключевых шаблонов",
        summary: "Основные паттерны промптинга для различных задач.",
        duration: 28,
        objectives: ["Изучить ключевые шаблоны", "Научиться применять", "Адаптировать под задачи"],
        prerequisites: ["Анатомия сильного промпта"],
        module: 2,
        section: 6
      },
      {
        slug: "multi-step-chains",
        title: "Многошаговые цепочки запросов",
        summary: "Создание сложных последовательностей запросов для сложных задач.",
        duration: 26,
        objectives: ["Планировать многошаговые процессы", "Создавать цепочки", "Управлять сложностью"],
        prerequisites: ["5 ключевых шаблонов"],
        module: 2,
        section: 7
      },
      {
        slug: "built-in-verification",
        title: "Встроенная проверка прямо в промпте",
        summary: "Интеграция механизмов проверки качества в сами промпты.",
        duration: 20,
        objectives: ["Добавлять проверки", "Автоматизировать контроль", "Повышать качество"],
        prerequisites: ["Многошаговые цепочки запросов"],
        module: 2,
        section: 8
      },
      {
        slug: "prompt-self-criticism",
        title: "Промпт-самокритика",
        summary: "Методы анализа и улучшения собственных промптов.",
        duration: 18,
        objectives: ["Анализировать промпты", "Находить слабые места", "Постоянно улучшаться"],
        prerequisites: ["Встроенная проверка прямо в промпте"],
        module: 2,
        section: 9
      },
      {
        slug: "prompting-pitfalls",
        title: "Подводные камни промптинга",
        summary: "Распространенные ошибки и способы их избежания.",
        duration: 16,
        objectives: ["Распознавать ошибки", "Избегать типичных проблем", "Исправлять недочеты"],
        prerequisites: ["Промпт-самокритика"],
        module: 2,
        section: 10
      },
      {
        slug: "what-means-good-prompts",
        title: "Что значит «хорошо»",
        summary: "Критерии качества промптов и способы их достижения.",
        duration: 19,
        objectives: ["Определить критерии", "Оценивать качество", "Стремиться к совершенству"],
        prerequisites: ["Подводные камни промптинга"],
        module: 2,
        section: 11
      },
      {
        slug: "recap-module-2",
        title: "Recap",
        summary: "Повторение и закрепление навыков промптинга.",
        duration: 15,
        objectives: ["Закрепить навыки", "Проверить понимание", "Подготовиться к практике"],
        prerequisites: ["Что значит «хорошо»"],
        module: 2,
        section: 12
      }
    ]
  },
  {
    id: 3,
    title: "Инструменты и рабочие процессы",
    description: "Практическое применение ИИ в рабочих процессах",
    sections: [
      {
        slug: "tools-less-important-than-processes",
        title: "Почему сами инструменты важны меньше, чем процессы",
        summary: "Приоритет процессов над инструментами при внедрении ИИ.",
        duration: 16,
        objectives: ["Понять приоритет процессов", "Сфокусироваться на методологии", "Избежать технологического фетишизма"],
        prerequisites: [],
        module: 3,
        section: 1
      },
      {
        slug: "three-main-ways-ai-work",
        title: "Три основных способа применения ИИ на работе",
        summary: "Классификация основных подходов к использованию ИИ в профессиональной деятельности.",
        duration: 20,
        objectives: ["Изучить три подхода", "Понять различия", "Выбрать подходящий"],
        prerequisites: ["Почему сами инструменты важны меньше, чем процессы"],
        module: 3,
        section: 2
      },
      {
        slug: "choosing-right-tool",
        title: "Как выбрать подходящий инструмент для задачи",
        summary: "Методология выбора оптимальных ИИ-инструментов под конкретные задачи.",
        duration: 22,
        objectives: ["Анализировать задачи", "Оценивать инструменты", "Принимать обоснованные решения"],
        prerequisites: ["Три основных способа применения ИИ на работе"],
        module: 3,
        section: 3
      },
      {
        slug: "example-llm-chatbots",
        title: "Пример инструмента: LLM-чатботы",
        summary: "Практическое применение языковых моделей в виде чат-ботов.",
        duration: 18,
        objectives: ["Понять возможности чат-ботов", "Изучить примеры применения", "Оценить эффективность"],
        prerequisites: ["Как выбрать подходящий инструмент для задачи"],
        module: 3,
        section: 4
      },
      {
        slug: "example-ai-spreadsheets",
        title: "Пример инструмента: ИИ в электронных таблицах",
        summary: "Использование ИИ для автоматизации работы с данными в таблицах.",
        duration: 19,
        objectives: ["Автоматизировать работу с данными", "Использовать ИИ-функции", "Повысить эффективность"],
        prerequisites: ["Пример инструмента: LLM-чатботы"],
        module: 3,
        section: 5
      },
      {
        slug: "example-automation-platforms",
        title: "Пример инструмента: Платформы автоматизации",
        summary: "Обзор платформ для создания автоматизированных рабочих процессов.",
        duration: 21,
        objectives: ["Изучить платформы", "Понять возможности", "Выбрать подходящую"],
        prerequisites: ["Пример инструмента: ИИ в электронных таблицах"],
        module: 3,
        section: 6
      },
      {
        slug: "building-workflow-principles",
        title: "Принципы построения рабочего процесса с ИИ",
        summary: "Основные принципы и методологии создания эффективных ИИ-процессов.",
        duration: 24,
        objectives: ["Изучить принципы", "Применить методологии", "Создать процессы"],
        prerequisites: ["Пример инструмента: Платформы автоматизации"],
        module: 3,
        section: 7
      },
      {
        slug: "start-small-scale",
        title: "Начните с малого и масштабируйте",
        summary: "Поэтапный подход к внедрению ИИ в рабочие процессы.",
        duration: 17,
        objectives: ["Планировать поэтапное внедрение", "Начинать с простого", "Постепенно усложнять"],
        prerequisites: ["Принципы построения рабочего процесса с ИИ"],
        module: 3,
        section: 8
      },
      {
        slug: "what-means-good-workflows",
        title: "Что значит «хорошо»",
        summary: "Критерии качества рабочих процессов с ИИ и способы их достижения.",
        duration: 18,
        objectives: ["Определить критерии", "Оценивать качество", "Постоянно улучшаться"],
        prerequisites: ["Начните с малого и масштабируйте"],
        module: 3,
        section: 9
      },
      {
        slug: "recap-module-3",
        title: "Recap",
        summary: "Повторение и закрепление принципов создания рабочих процессов.",
        duration: 14,
        objectives: ["Закрепить принципы", "Проверить понимание", "Подготовиться к практике"],
        prerequisites: ["Что значит «хорошо»"],
        module: 3,
        section: 10
      }
    ]
  },
  {
    id: 4,
    title: "Поиск и масштабирование успешных кейсов применения ИИ",
    description: "Стратегии внедрения и развития ИИ в организациях",
    sections: [
      {
        slug: "why-this-skill-important",
        title: "Почему этот навык важен",
        summary: "Обоснование важности умения находить и масштабировать успешные кейсы ИИ.",
        duration: 15,
        objectives: ["Понять ценность навыка", "Осознать преимущества", "Мотивироваться к изучению"],
        prerequisites: [],
        module: 4,
        section: 1
      },
      {
        slug: "eighty-twenty-rule",
        title: "Правило «80/20» для поиска возможностей",
        summary: "Применение принципа Парето для эффективного поиска ИИ-возможностей.",
        duration: 18,
        objectives: ["Понять правило 80/20", "Применить к поиску возможностей", "Сфокусироваться на главном"],
        prerequisites: ["Почему этот навык важен"],
        module: 4,
        section: 2
      },
      {
        slug: "automation-checklist",
        title: "Чек-лист автоматизации",
        summary: "Практический инструмент для оценки потенциала автоматизации задач.",
        duration: 20,
        objectives: ["Изучить чек-лист", "Применить к задачам", "Оценить потенциал"],
        prerequisites: ["Правило «80/20» для поиска возможностей"],
        module: 4,
        section: 3
      },
      {
        slug: "start-with-micro-wins",
        title: "Начинайте с микро-побед",
        summary: "Стратегия достижения быстрых успехов для демонстрации ценности ИИ.",
        duration: 16,
        objectives: ["Планировать микро-победи", "Достигать быстрых результатов", "Строить доверие"],
        prerequisites: ["Чек-лист автоматизации"],
        module: 4,
        section: 4
      },
      {
        slug: "measuring-effect",
        title: "Как измерять эффект",
        summary: "Методологии и инструменты для оценки эффективности ИИ-решений.",
        duration: 22,
        objectives: ["Выбрать метрики", "Настроить измерение", "Анализировать результаты"],
        prerequisites: ["Начинайте с микро-побед"],
        module: 4,
        section: 5
      },
      {
        slug: "share-successes",
        title: "Делитесь успехами",
        summary: "Стратегии коммуникации успехов для продвижения ИИ в организации.",
        duration: 17,
        objectives: ["Планировать коммуникацию", "Демонстрировать ценность", "Строить поддержку"],
        prerequisites: ["Как измерять эффект"],
        module: 4,
        section: 5
      },
      {
        slug: "building-ai-culture",
        title: "Как сформировать ИИ-культуру",
        summary: "Создание организационной культуры, поддерживающей внедрение ИИ.",
        duration: 24,
        objectives: ["Понять элементы культуры", "Планировать изменения", "Внедрять постепенно"],
        prerequisites: ["Делитесь успехами"],
        module: 4,
        section: 6
      },
      {
        slug: "scaling-beyond-role",
        title: "Масштабирование за пределы своей роли",
        summary: "Стратегии расширения влияния ИИ за рамки индивидуальной работы.",
        duration: 21,
        objectives: ["Планировать масштабирование", "Вовлекать коллег", "Создавать движение"],
        prerequisites: ["Как сформировать ИИ-культуру"],
        module: 4,
        section: 7
      },
      {
        slug: "mature-ai-implementation",
        title: "Как выглядит зрелое внедрение ИИ",
        summary: "Видение конечного состояния успешного внедрения ИИ в организации.",
        duration: 19,
        objectives: ["Понять конечную цель", "Планировать развитие", "Стремиться к зрелости"],
        prerequisites: ["Масштабирование за пределы своей роли"],
        module: 4,
        section: 8
      },
      {
        slug: "recap-module-4",
        title: "Recap",
        summary: "Повторение и закрепление стратегий внедрения ИИ.",
        duration: 16,
        objectives: ["Закрепить стратегии", "Проверить понимание", "Планировать действия"],
        prerequisites: ["Как выглядит зрелое внедрение ИИ"],
        module: 4,
        section: 9
      }
    ]
  }
];

export function getModule(id: number): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLesson(moduleId: number, sectionId: number): LessonFrontmatter | undefined {
  const module = getModule(moduleId);
  return module?.sections.find(s => s.section === sectionId);
}

export function getAllLessons(): SearchResult[] {
  return modules.flatMap(module =>
    module.sections.map(section => ({
      module: module.id,
      section: section.section,
      title: section.title,
      summary: section.summary,
      slug: section.slug
    }))
  );
}

export function searchLessons(query: string): SearchResult[] {
  const lessons = getAllLessons();
  const lowerQuery = query.toLowerCase();
  
  return lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(lowerQuery) ||
    lesson.summary.toLowerCase().includes(lowerQuery)
  );
}

// Custom lesson content mapping
export const lessonContent: Record<string, string> = {
  // Introduction Module
  "1-1": `
    <h2>Welcome to Your Learning Journey</h2>
    <p>Congratulations on taking the first step towards mastering new skills! This course is designed to be interactive, engaging, and most importantly, effective.</p>
    
    <h3>What You'll Get</h3>
    <ul>
      <li><strong>Structured Learning:</strong> Carefully curated content that builds upon itself</li>
      <li><strong>Interactive Elements:</strong> Quizzes, exercises, and hands-on practice</li>
      <li><strong>Progress Tracking:</strong> Monitor your advancement through the course</li>
      <li><strong>Flexible Navigation:</strong> Learn at your own pace with intuitive controls</li>
    </ul>
    
    <h3>How to Use This Course</h3>
    <p>Each module contains multiple lessons that progressively build your knowledge. Complete the quizzes to reinforce learning and track your progress as you advance through the material.</p>
    
    <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
      <p class="text-blue-800 dark:text-blue-200"><strong>Pro Tip:</strong> Use the keyboard shortcuts (K for command menu, J/L for navigation) to move quickly through lessons.</p>
    </div>
  `,
  
  "1-2": `
    <h2>Understanding the Learning Flow</h2>
    <p>This course is designed with a specific learning methodology that maximizes retention and understanding.</p>
    
    <h3>Learning Flow</h3>
    <ol>
      <li><strong>Introduction:</strong> Get familiar with the topic and objectives</li>
      <li><strong>Core Content:</strong> Dive deep into the material with examples</li>
      <li><strong>Practice:</strong> Apply what you've learned through exercises</li>
      <li><strong>Assessment:</strong> Test your understanding with quizzes</li>
      <li><strong>Reflection:</strong> Think about how to apply this knowledge</li>
    </ol>
    
    <h3>Navigation Controls</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold mb-2">Keyboard Shortcuts</h4>
        <ul class="space-y-1 text-sm">
          <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">K</kbd> - Open command menu</li>
          <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">J</kbd> - Previous lesson</li>
          <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">L</kbd> - Next lesson</li>
        </ul>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold mb-2">Progress Tracking</h4>
        <p class="text-sm">Your progress is automatically saved as you scroll through lessons and complete quizzes.</p>
      </div>
    </div>
  `,
  
  "1-3": `
    <h2>Your First Steps</h2>
    <p>Now that you understand how the course works, let's get you started on your learning journey!</p>
    
    <h3>Getting Started Checklist</h3>
    <div class="space-y-3">
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <span class="text-green-600 dark:text-green-400 text-sm">✓</span>
        </div>
        <span>Course structure understood</span>
      </div>
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <span class="text-green-600 dark:text-green-400 text-sm">✓</span>
        </div>
        <span>Navigation controls learned</span>
      </div>
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <span class="text-blue-600 dark:text-blue-400 text-sm">→</span>
        </div>
        <span>Ready for your first real lesson</span>
      </div>
    </div>
    
    <h3>What's Next?</h3>
    <p>You're now ready to dive into the core concepts! The next module will introduce fundamental principles that will serve as the foundation for everything you'll learn.</p>
    
    <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500 mt-6">
      <p class="text-green-800 dark:text-green-200"><strong>Ready to go?</strong> Use the navigation controls below to move to the next lesson or explore other modules.</p>
    </div>
  `,
  
  // Web Development Module
  "5-1": `
    <h2>HTML Fundamentals</h2>
    <p>HTML (HyperText Markup Language) is the backbone of every website. It provides the structure and content that makes web pages possible.</p>
    
    <h3>What is HTML?</h3>
    <p>HTML is a markup language that uses tags to define the structure of web content. It's not a programming language, but rather a way to organize and present information on the web.</p>
    
    <h3>Basic HTML Structure</h3>
    <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;My First Webpage&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello, World!&lt;/h1&gt;
    &lt;p&gt;This is my first HTML page.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
    </div>
    
    <h3>Key HTML Elements</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">&lt;h1&gt; to &lt;h6&gt;</h4>
        <p class="text-sm">Headings that create hierarchy in your content</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">&lt;p&gt;</h4>
        <p class="text-sm">Paragraphs for text content</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">&lt;div&gt;</h4>
        <p class="text-sm">Container element for grouping content</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">&lt;img&gt;</h4>
        <p class="text-sm">Images and media content</p>
      </div>
    </div>
    
    <h3>Best Practices</h3>
    <ul>
      <li>Use semantic HTML elements when possible</li>
      <li>Always close your tags properly</li>
      <li>Use descriptive alt text for images</li>
      <li>Keep your HTML clean and well-structured</li>
    </ul>
  `,
  
  "5-2": `
    <h2>CSS Styling</h2>
    <p>CSS (Cascading Style Sheets) transforms plain HTML into beautiful, visually appealing web pages. It controls everything from colors and fonts to layouts and animations.</p>
    
    <h3>CSS Basics</h3>
    <p>CSS works by selecting HTML elements and applying styles to them. It uses a simple syntax: <code>selector { property: value; }</code></p>
    
    <h3>CSS Selectors</h3>
    <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
      <pre><code>/* Element selector */
h1 {
  color: blue;
  font-size: 24px;
}

/* Class selector */
.highlight {
  background-color: yellow;
}

/* ID selector */
#header {
  border-bottom: 2px solid black;
}</code></pre>
    </div>
    
    <h3>Common CSS Properties</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Text Properties</h4>
        <ul class="text-sm space-y-1">
          <li><code>color</code> - Text color</li>
          <li><code>font-size</code> - Text size</li>
          <li><code>font-family</code> - Font type</li>
          <li><code>text-align</code> - Text alignment</li>
        </ul>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Layout Properties</h4>
        <ul class="text-sm space-y-1">
          <li><code>margin</code> - Outer spacing</li>
          <li><code>padding</code> - Inner spacing</li>
          <li><code>border</code> - Element borders</li>
          <li><code>display</code> - Display behavior</li>
        </ul>
      </div>
    </div>
    
    <h3>CSS Box Model</h3>
    <p>Every HTML element is treated as a box with content, padding, border, and margin. Understanding this model is crucial for layout design.</p>
    
    <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
      <p class="text-blue-800 dark:text-blue-200"><strong>Pro Tip:</strong> Use browser developer tools to inspect elements and see how CSS affects the box model in real-time.</p>
    </div>
  `,
  
  "5-3": `
    <h2>JavaScript Essentials</h2>
    <p>JavaScript is the programming language that brings websites to life. It adds interactivity, handles user input, and creates dynamic content.</p>
    
    <h3>What is JavaScript?</h3>
    <p>JavaScript is a high-level, interpreted programming language that runs in web browsers. It's essential for modern web development and can also run on servers (Node.js).</p>
    
    <h3>Basic JavaScript Syntax</h3>
    <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
      <pre><code>// Variables
let name = "John";
const age = 25;
var city = "New York"; // older syntax

// Functions
function greet(person) {
  return "Hello, " + person + "!";
}

// Arrow functions (modern syntax)
const greetArrow = (person) => {
  return \`Hello, \${person}!\`;
};

// Event handling
document.getElementById("button").addEventListener("click", function() {
  alert("Button clicked!");
});</code></pre>
    </div>
    
    <h3>DOM Manipulation</h3>
    <p>JavaScript can interact with HTML elements through the Document Object Model (DOM).</p>
    
    <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
      <pre><code>// Select elements
const element = document.querySelector(".my-class");
const elements = document.querySelectorAll("p");

// Modify content
element.textContent = "New text";
element.innerHTML = "&lt;strong&gt;Bold text&lt;/strong&gt;";

// Change styles
element.style.backgroundColor = "blue";
element.classList.add("highlight");</code></pre>
    </div>
    
    <h3>Common Use Cases</h3>
    <ul>
      <li>Form validation and submission</li>
      <li>Dynamic content updates</li>
      <li>User interaction handling</li>
      <li>Data processing and manipulation</li>
      <li>API communication</li>
    </ul>
  `,
  
  "5-4": `
    <h2>Introduction to React</h2>
    <p>React is a powerful JavaScript library for building user interfaces. It makes it easy to create interactive, component-based web applications.</p>
    
    <h3>Why React?</h3>
    <p>React simplifies complex UI development by breaking interfaces into reusable components. It efficiently updates the DOM and provides a declarative way to describe UI.</p>
    
    <h3>React Components</h3>
    <p>Components are the building blocks of React applications. They can be functional or class-based.</p>
    
    <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
      <pre><code>// Functional Component
function Welcome(props) {
  return &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;;
}

// Using the component
&lt;Welcome name="React Developer" /&gt;

// Modern functional component with hooks
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Increment
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
    </div>
    
    <h3>JSX Syntax</h3>
    <p>JSX allows you to write HTML-like code in JavaScript. It gets compiled into regular JavaScript function calls.</p>
    
    <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
      <pre><code>// JSX syntax
const element = (
  &lt;div className="container"&gt;
    &lt;h1&gt;Welcome to React&lt;/h1&gt;
    &lt;p&gt;This is JSX syntax&lt;/p&gt;
  &lt;/div&gt;
);

// Compiled JavaScript (simplified)
const element = React.createElement(
  "div",
  { className: "container" },
  React.createElement("h1", null, "Welcome to React"),
  React.createElement("p", null, "This is JSX syntax")
);</code></pre>
    </div>
    
    <h3>React Hooks</h3>
    <p>Hooks are functions that allow you to use state and other React features in functional components.</p>
    
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 class="font-semibold">Common Hooks</h4>
      <ul class="text-sm space-y-1">
        <li><code>useState</code> - Manage component state</li>
        <li><code>useEffect</code> - Handle side effects</li>
        <li><code>useContext</code> - Access React context</li>
        <li><code>useRef</code> - Reference DOM elements</li>
      </ul>
    </div>
    
    <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500 mt-6">
      <p class="text-green-800 dark:text-green-200"><strong>Next Steps:</strong> Practice building simple React components and explore the React ecosystem with tools like Create React App or Next.js.</p>
    </div>
  `,
  
  // Core Concepts Module
  "2-1": `
    <h2>Fundamental Principles</h2>
    <p>Understanding the core principles is essential for building a strong foundation in any field. These concepts will serve as the building blocks for more advanced topics.</p>
    
    <h3>Key Principles</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">1. Systematic Thinking</h4>
        <p class="text-sm">Break complex problems into smaller, manageable parts</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">2. Pattern Recognition</h4>
        <p class="text-sm">Identify common patterns and apply them to new situations</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">3. Iterative Improvement</h4>
        <p class="text-sm">Continuously refine and improve your approach</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">4. Context Awareness</h4>
        <p class="text-sm">Understand when and where to apply different concepts</p>
      </div>
    </div>
    
    <h3>Application Framework</h3>
    <p>Use this framework to apply core concepts to any new problem:</p>
    <ol>
      <li><strong>Analyze:</strong> Break down the problem into components</li>
      <li><strong>Identify:</strong> Find relevant core concepts</li>
      <li><strong>Apply:</strong> Use the concepts to solve the problem</li>
      <li><strong>Evaluate:</strong> Assess the effectiveness of your solution</li>
      <li><strong>Refine:</strong> Improve based on feedback and results</li>
    </ol>
    
    <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
      <p class="text-blue-800 dark:text-blue-200"><strong>Practice Exercise:</strong> Think of a recent problem you solved. How did you apply these core principles? Could you have used them more effectively?</p>
    </div>
  `,
  
  "2-2": `
    <h2>Advanced Topics</h2>
    <p>Now that you understand the fundamentals, let's explore more complex concepts that build upon your foundation.</p>
    
    <h3>Complex Problem Solving</h3>
    <p>Advanced topics often involve multiple interconnected concepts and require sophisticated problem-solving approaches.</p>
    
    <h3>Advanced Techniques</h3>
    <div class="space-y-4">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Multi-dimensional Analysis</h4>
        <p>Consider problems from multiple perspectives and dimensions. This often reveals hidden connections and opportunities.</p>
        <ul class="text-sm mt-2 space-y-1">
          <li>• Technical feasibility</li>
          <li>• User experience impact</li>
          <li>• Business value</li>
          <li>• Long-term sustainability</li>
        </ul>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Systemic Thinking</h4>
        <p>Understand how changes in one area affect the entire system. This is crucial for avoiding unintended consequences.</p>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Creative Synthesis</h4>
        <p>Combine seemingly unrelated concepts to create innovative solutions. This is where breakthrough thinking happens.</p>
      </div>
    </div>
    
    <h3>Challenges and Solutions</h3>
    <p>Advanced topics come with unique challenges. Here are strategies to overcome them:</p>
    <ul>
      <li><strong>Complexity:</strong> Use decomposition and abstraction</li>
      <li><strong>Uncertainty:</strong> Embrace iterative approaches and experimentation</li>
      <li><strong>Interdependencies:</strong> Map relationships and identify critical paths</li>
      <li><strong>Scale:</strong> Design for growth from the beginning</li>
    </ul>
  `,
  
  // Practical Application Module
  "3-1": `
    <h2>Real World Examples</h2>
    <p>Seeing concepts in action helps solidify understanding and reveals practical nuances that theory alone can't convey.</p>
    
    <h3>Case Study: E-commerce Platform</h3>
    <p>Let's examine how core concepts apply to building a real e-commerce platform:</p>
    
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 class="font-semibold">Systematic Thinking Applied</h4>
      <p>The platform can be broken down into:</p>
      <ul class="text-sm mt-2 space-y-1">
        <li>• User authentication and management</li>
        <li>• Product catalog and search</li>
        <li>• Shopping cart and checkout</li>
        <li>• Payment processing</li>
        <li>• Order management</li>
        <li>• Admin dashboard</li>
      </ul>
    </div>
    
    <h3>Pattern Recognition in Action</h3>
    <p>Common patterns you'll encounter:</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">CRUD Operations</h4>
        <p class="text-sm">Create, Read, Update, Delete - fundamental to most applications</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Authentication Flow</h4>
        <p class="text-sm">Login, session management, permissions, logout</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Search and Filter</h4>
        <p class="text-sm">Query processing, result ranking, faceted search</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Data Validation</h4>
        <p class="text-sm">Input sanitization, business rule enforcement</p>
      </div>
    </div>
    
    <h3>Lessons Learned</h3>
    <p>Real-world applications teach valuable lessons:</p>
    <ul>
      <li>Performance requirements often drive architecture decisions</li>
      <li>User experience considerations can override technical elegance</li>
      <li>Security must be built-in from the beginning</li>
      <li>Scalability planning prevents future headaches</li>
    </ul>
  `,
  
  "3-2": `
    <h2>Hands-on Practice</h2>
    <p>Knowledge without practice is like a car without fuel - it won't get you anywhere. Let's put theory into action.</p>
    
    <h3>Practice Projects</h3>
    <p>Here are some hands-on projects to reinforce your learning:</p>
    
    <div class="space-y-4">
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Project 1: Personal Portfolio</h4>
        <p class="text-sm">Build a responsive portfolio website showcasing your skills and projects.</p>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <strong>Skills practiced:</strong> HTML, CSS, responsive design, content organization
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Project 2: Task Management App</h4>
        <p class="text-sm">Create a simple task manager with add, edit, delete, and mark-complete functionality.</p>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <strong>Skills practiced:</strong> JavaScript, DOM manipulation, local storage, event handling
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 class="font-semibold">Project 3: Weather Dashboard</h4>
        <p class="text-sm">Build a weather app that fetches data from an API and displays it in an attractive interface.</p>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <strong>Skills practiced:</strong> API integration, async programming, data visualization, error handling
        </div>
      </div>
    </div>
    
    <h3>Development Workflow</h3>
    <p>Follow this workflow for each project:</p>
    <ol>
      <li><strong>Plan:</strong> Define requirements and create wireframes</li>
      <li><strong>Design:</strong> Create the user interface and user experience</li>
      <li><strong>Build:</strong> Implement the functionality step by step</li>
      <li><strong>Test:</strong> Verify everything works as expected</li>
      <li><strong>Refine:</strong> Improve based on testing and feedback</li>
      <li><strong>Deploy:</strong> Make your project available online</li>
    </ol>
    
    <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500">
      <p class="text-green-800 dark:text-green-200"><strong>Pro Tip:</strong> Start with the simplest project and gradually increase complexity. Each project builds upon the skills from previous ones.</p>
    </div>
  `
};
